import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { createNotification } from "../utils/notificationHelper";
import { Product } from "../models/product.model";

// 1. Create a new order (Checkout)
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  console.log("Create order request ", req.body);

  const { items, total, shippingAddress, paymentMethod } = req.body;
  if (!items || items.length === 0) {
    throw new ApiError(400, "No order items provided");
  }
  if (!shippingAddress) {
    throw new ApiError(400, "Shipping address is required");
  }
  const order = await Order.create({
    userId: req.user?._id,
    items,
    total,
    shippingAddress,
    paymentMethod: paymentMethod || "Cash on Delivery", // Defaults to Cash on Delivery if not specified
    status: "pending",
  });

  // 1. Send ONE overall summary notification to the customer for the entire order
  await createNotification(
    order.userId.toString(),
    `Your order has been placed successfully with ${items.length} item(s) using Cash on Delivery. Total: ${total}. `,
    "ORDER_PLACED",
    { orderId: order._id.toString(), status: "pending"}
  );

  // 2. Loop through each item to handle individual item notifications and supplier alerts
  for (const item of order.items) {

    // Find the product's supplier and send them their specific notification
    const product = await Product.findById(item.productId);
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

    // Find the specific item in the order and update its status
    let itemFound = false;
    order.items.forEach((item: any) => {
      if (item.productId.toString() === productId) {
        item.status = status;
        itemFound = true;
      }
    });

    if (!itemFound) {
      throw new ApiError(404, "Product item not found in this order");
    }

    await order.save();

    // Find the specific item we just updated to grab its exact current status
    const updatedItem = order.items.find(
      (item: any) => item.productId.toString() === productId
    );
    const currentStatus = updatedItem ? updatedItem.status : status;

   // 1. Notify the customer (Already exists)
    await createNotification(
      order.userId.toString(),
      `Your order item "${updatedItem ? updatedItem.name : 'Product'}" status has been updated.`,
      "STATUS_UPDATE",
      { orderId: order._id.toString(), productId: productId, status: currentStatus }
    );

    // 2. 🔔 ADD THIS: Notify the supplier so it appears in their own /notifications/my list
    if (req.user?._id) {
      await createNotification(
        req.user._id.toString(),
        `You successfully updated item "${updatedItem ? updatedItem.name : 'Product'}".`,
        "SUPPLIER_STATUS_UPDATE_LOG",
        { orderId: order._id.toString(), productId: productId, status: currentStatus }
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
