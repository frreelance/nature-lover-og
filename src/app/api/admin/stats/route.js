import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth-server';

export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      revenueResult,
      todayOrders,
      totalUsers,
      recentOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'completed' }),
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.countDocuments({ createdAt: { $gte: today } }),
      User.countDocuments(),
      Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5)
    ]);

    const statusDistribution = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    return NextResponse.json({
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: revenueResult[0]?.total || 0,
        todayOrders,
        totalUsers,
        statusDistribution,
        recentOrders
      },
      message: "Dashboard stats fetched"
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
