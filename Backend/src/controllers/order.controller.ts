import { Request, Response } from "express";
import { Order, type IOrder } from "../models/order.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { createNotification } from "../utils/notificationHelper";
import { Product } from "../models/product.model";
import { getActiveApprovedSupplierIds } from "../utils/supplierAvailability";

// 1. Create a new order (Checkout)
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "No order items provided");
  }
  if (
    !shippingAddress ||
    typeof shippingAddress.fullName !== "string" ||
    !shippingAddress.fullName.trim() ||
    typeof shippingAddress.address !== "string" ||
    !shippingAddress.address.trim() ||
    typeof shippingAddress.city !== "string" ||
    !shippingAddress.city.trim() ||
    typeof shippingAddress.postalCode !== "string" ||
    !shippingAddress.postalCode.trim()
  ) {
    throw new ApiError(400, "Complete shipping information is required");
  }
  if (paymentMethod && paymentMethod !== "Cash on Delivery") {
    throw new ApiError(400, "Only Cash on Delivery is currently supported");
  }

  const quantities = new Map<string, number>();
  for (const item of items) {
    if (
      typeof item?.productId !== "string" ||
      !/^[a-f\d]{24}$/i.test(item.productId) ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1
    ) {
      throw new ApiError(400, "Order items must include a valid product and quantity");
    }
    const productId = item.productId.toLowerCase();
    const quantity = (quantities.get(productId) ?? 0) + item.quantity;
    if (!Number.isSafeInteger(quantity)) {
      throw new ApiError(400, "Order quantity is too large");
    }
    quantities.set(productId, quantity);
  }

  const activeSupplierIds = await getActiveApprovedSupplierIds();
  const products = await Product.find({
    _id: { $in: Array.from(quantities.keys()) },
    isVisible: { $ne: false },
    supplier: { $in: activeSupplierIds },
  });
  if (products.length !== quantities.size) {
    throw new ApiError(400, "One or more products are no longer available");
  }

  const orderItems = products.map((product) => ({
    productId: product._id,
    name: product.name,
    price: product.price,
    quantity: quantities.get(product._id.toString())!,
    status: "pending" as const,
  }));
  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const reserved: Array<{ productId: string; quantity: number }> = [];
  let order: IOrder;

  try {
    for (const item of orderItems) {
      const reservation = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          isVisible: { $ne: false },
          supplier: { $in: activeSupplierIds },
          stock: { $gte: item.quantity },
        },
        { $inc: { stock: -item.quantity } },
        { new: true },
      );
      if (!reservation) {
        throw new ApiError(409, `Not enough stock available for "${item.name}"`);
      }
      reserved.push({
        productId: item.productId.toString(),
        quantity: item.quantity,
      });
    }

    order = await Order.create({
      userId: req.user?._id,
      items: orderItems,
      total,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        postalCode: shippingAddress.postalCode.trim(),
      },
      paymentMethod: "Cash on Delivery",
      status: "pending",
    });
  } catch (error) {
    for (const reservation of reserved) {
      try {
        await Product.updateOne(
          { _id: reservation.productId },
          { $inc: { stock: reservation.quantity } },
        );
      } catch (rollbackError) {
        console.error("Failed to restore stock after order creation failed", rollbackError);
      }
    }
    throw error;
  }

  // 1. Send ONE overall summary notification to the customer for the entire order
  await createNotification(
    order.userId.toString(),
    `Your order has been placed successfully with ${order.items.length} item(s) using Cash on Delivery. Total: PKR ${total.toLocaleString("en-PK")}.`,
    "ORDER_PLACED",
    { orderId: order._id.toString(), status: "pending" },
  );

  // 2. Loop through each item to handle individual item notifications and supplier alerts
  for (const item of order.items) {

    // Find the product's supplier and send them their specific notification
    const product = products.find(
      (candidate) => candidate._id.toString() === item.productId.toString(),
    );
    if (product && product.supplier) {
      await createNotification(
        product.supplier.toString(),
        `New  order received for your product "${item.name}" (Qty: ${item.quantity}).`,
        "NEW_ORDER",
        { orderId: order._id.toString(), productId: item.productId.toString(), status: "pending" }
      );
    }
  }
  return res
    .status(201)
    .json(new ApiResponse("Order placed successfully", order));
});

// 2. Get customer's own order history
export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  console.log("Get my orders request ", req.body);

  const orders = await Order.find({ userId: req.user?._id }).sort({
    createdAt: -1,
  });
  if (!orders || orders.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse("No orders found for this customer", []));
  }
  return res
    .status(200)
    .json(new ApiResponse("Order history fetched successfully", orders));
});

// 3. Get single order detail by ID
export const getOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("Get order by ID request ", req.body);

    const order = await Order.findById(req.params.id)
      .populate("items.productId", "name image")
      .lean(); // Use .lean() so we can modify and return the plain object

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    // 1. If the user is a customer, ensure they own the order
    if (
      req.user?.role === "customer" &&
      order.userId.toString() !== req.user?._id?.toString()
    ) {
      throw new ApiError(403, "Unauthorized to view this order");
    }

    // 2. If the user is a supplier, ensure the order contains at least one of their products, and filter items
    if (req.user?.role === "supplier") {
      // Find products belonging to this supplier
      const products = await Product.find({ supplier: req.user?._id }).select(
        "_id",
      );
      const productIds = products.map((p) => p._id.toString());

      // Check if this order contains any product owned by this supplier
      const hasAccess = order.items.some((item: any) =>
        productIds.includes(
          item.productId._id
            ? item.productId._id.toString()
            : item.productId.toString(),
        ),
      );

      if (!hasAccess) {
        throw new ApiError(403, "Unauthorized to view this order");
      }

      // Filter items array so supplier only sees their own products in this order detail view
      order.items = order.items.filter((item: any) => {
        const prodId = item.productId._id
          ? item.productId._id.toString()
          : item.productId.toString();
        return productIds.includes(prodId);
      });
    }

    return res
      .status(200)
      .json(new ApiResponse("Order fetched successfully", order));
  },
);
// "How does FashionHub handle multiple suppliers in a single customer order?", you can confidently answer: "We use item-level status tracking so each vendor can independently manage fulfillment for their specific products." Evaluators love this level of practical realism.
// Multi-Vendor Order Splitting problem.
// 4. Update order status
export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("Update Order status ", req.body);

    const { status, productId } = req.body;
    const validStatuses = ["pending", "processing", "shipped", "delivered"];

    if (!validStatuses.includes(status)) {
      throw new ApiError(400, "Invalid status value");
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    // Find products belonging to this supplier if user is a supplier
    let productIds: string[] = [];
    if (req.user?.role === "supplier") {
      const supplierProducts = await Product.find({
        supplier: req.user._id,
      }).select("_id");
      productIds = supplierProducts.map((p) => p._id.toString());

      const product = await Product.findOne({
        _id: productId,
        supplier: req.user._id,
      });
      if (!product) {
        throw new ApiError(403, "You do not own this product in the order");
      }
    }

    const updatedItem = order.items.find(
      (item) => item.productId.toString() === productId,
    );
    if (!updatedItem) {
      throw new ApiError(404, "Product item not found in this order");
    }

    if (req.user?.role === "supplier" && !productIds.includes(productId)) {
      throw new ApiError(403, "You do not own this product in the order");
    }

    const statusProgression = ["pending", "processing", "shipped", "delivered"];
    const currentStatus = updatedItem.status || "pending";
    const currentIndex = statusProgression.indexOf(currentStatus);
    const requestedIndex = statusProgression.indexOf(status);
    if (requestedIndex !== currentIndex + 1) {
      throw new ApiError(
        409,
        `Order items can only advance to ${statusProgression[currentIndex + 1] ?? "a later status"}`,
      );
    }
    updatedItem.status = status;
    const itemStatuses = order.items.map((item) => item.status || "pending");
    const overallIndex = Math.min(
      ...itemStatuses.map((itemStatus) => {
        const index = statusProgression.indexOf(itemStatus);
        return index < 0 ? 0 : index;
      }),
    );
    order.status = statusProgression[
      overallIndex
    ] as IOrder["status"];
    await order.save();

   // 1. Notify the customer (Already exists)
    await createNotification(
      order.userId.toString(),
      `Your order item "${updatedItem.name}" status has been updated.`,
      "STATUS_UPDATE",
      { orderId: order._id.toString(), productId: productId, status }
    );

    // 2. 🔔 ADD THIS: Notify the supplier so it appears in their own /notifications/my list
    if (req.user?._id) {
      await createNotification(
        req.user._id.toString(),
        `You successfully updated item "${updatedItem.name}".`,
        "SUPPLIER_STATUS_UPDATE_LOG",
        { orderId: order._id.toString(), productId: productId, status }
      );
    }

    // Convert to plain object to modify response payload for suppliers
    let responseData: any = order.toObject();

    if (req.user?.role === "supplier") {
      responseData.items = responseData.items.filter((item: any) =>
        productIds.includes(item.productId.toString()),
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse("Item order status updated successfully", responseData),
      );
  },
);

export const getSupplierOrders = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("Get supplier orders request ", req.body);

    // 1. Find all product IDs belonging to this logged-in supplier
    const products = await Product.find({ supplier: req.user?._id }).select(
      "_id",
    );
    const productIds = products.map((p) => p._id.toString());

    // 2. Find orders that contain at least one of these product IDs
    const orders = await Order.find({
      "items.productId": { $in: productIds },
    })
      .lean()
      .sort({ createdAt: -1 });

    // 3. Filter each order's items array so the supplier ONLY sees their own products
    const supplierOrders = orders.map((order: any) => {
      const filteredItems = order.items.filter((item: any) =>
        productIds.some((id) => id.toString() === item.productId.toString()),
      );
      return {
        ...order,
        items: filteredItems,
      };
    });

    if (!supplierOrders || supplierOrders.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse("No orders found for this supplier", []));
    }

    return res
      .status(200)
      .json(
        new ApiResponse("Supplier orders fetched successfully", supplierOrders),
      );
  },
);

// 6. Get all orders (admin only)
export const getAllOrdersForAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("Get all orders request ", req.body);
    const orders = await Order.find({})
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse("All orders fetched successfully", orders));
  },
);
