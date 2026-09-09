import { Request, Response } from "express";
import { Order } from "../models/order.model";
import User from "../models/user.model";
import { Product } from "../models/product.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

// 1. Get Admin platform-wide analytics for Approved Suppliers and their products
export const getAdminAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    // Total Users count
    const totalUsers = await User.countDocuments();

    // 1. Total Suppliers count strictly for approved suppliers
    const totalSuppliers = await User.countDocuments({
      role: "supplier",
      status: "approved",
    });

    // Find IDs of all approved suppliers
    const approvedSuppliers = await User.find({
      role: "supplier",
      status: "approved",
    }).select("_id");
    const approvedSupplierIds = approvedSuppliers.map((s) => s._id.toString());

    // Find products belonging to approved suppliers
    const approvedProducts = await Product.find({
      supplier: { $in: approvedSupplierIds },
    }).select("_id");
    const approvedProductIds = approvedProducts.map((p) => p._id.toString());

    // 2. Fetch all orders to compute revenue and counts based on approved suppliers only
    const allOrders = await Order.find({});

    let totalRevenue = 0;
    const dailyMetrics: {
      [key: string]: { orderIds: Set<string>; revenue: number };
    } = {};

    allOrders.forEach((order) => {
      let orderHasApprovedItems = false;
      let orderApprovedRevenue = 0;

      order.items.forEach((item: any) => {
        const prodId = item.productId.toString();
        if (approvedProductIds.includes(prodId)) {
          orderApprovedRevenue += item.price * item.quantity;
          orderHasApprovedItems = true;
        }
      });

      if (orderHasApprovedItems) {
        totalRevenue += orderApprovedRevenue;

        // Format date for ordersOverTime grouping (YYYY-MM-DD)
        const dateKey = order.createdAt.toISOString().split("T")[0];
        if (!dailyMetrics[dateKey]) {
          dailyMetrics[dateKey] = { orderIds: new Set(), revenue: 0 };
        }
        dailyMetrics[dateKey].orderIds.add(order._id.toString());
        dailyMetrics[dateKey].revenue += orderApprovedRevenue;
      }
    });

    // Count only orders that contain at least one approved supplier's product
    const totalOrders = Object.values(dailyMetrics).reduce(
      (acc, curr) => acc + curr.orderIds.size,
      0,
    );

    // Format ordersOverTime array for charts
    const ordersOverTime = Object.keys(dailyMetrics)
      .sort()
      .map((date) => ({
        _id: date,
        count: dailyMetrics[date].orderIds.size,
        revenue: dailyMetrics[date].revenue,
      }));

    return res.status(200).json(
      new ApiResponse("Admin analytics fetched successfully", {
        totalUsers,
        totalSuppliers,
        totalOrders,
        totalRevenue,
        ordersOverTime,
      }),
    );
  },
);

// 2. Get top-selling products for admin
export const getTopProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    return res
      .status(200)
      .json(new ApiResponse("Top products fetched successfully", topProducts));
  },
);

// 3. Get performance and analytics for the logged-in supplier
export const getSupplierAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const supplierId = req.user?._id;

    // Find products belonging to this supplier
    const products = await Product.find({ supplier: supplierId });
    const productIds = products.map((p) => p._id);
    const totalProducts = products.length;

    // Calculate total stock and average rating across supplier's products
    const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
    const avgRating =
      totalProducts > 0
        ? products.reduce((acc, p) => acc + (p.rating || 0), 0) / totalProducts
        : 0;

    // Find orders containing these products
    const orders = await Order.find({ "items.productId": { $in: productIds } });

    let totalRevenue = 0;
    let totalItemsSold = 0;

    orders.forEach((order) => {
      order.items.forEach((item: any) => {
        if (
          productIds.some((id) => id.toString() === item.productId.toString())
        ) {
          totalRevenue += item.price * item.quantity;
          totalItemsSold += item.quantity;
        }
      });
    });

    return res.status(200).json(
      new ApiResponse("Supplier performance analytics fetched successfully", {
        totalProducts,
        totalStock,
        totalOrders: orders.length,
        totalItemsSold,
        totalRevenue,
        averageRating: Number(avgRating.toFixed(1)),
      }),
    );
  },
);
