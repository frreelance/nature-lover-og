import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';
import { getAuthUser } from '@/lib/auth-server';

export async function GET(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    await connectDB();
    const targetUser = await User.findById(id).select('-password -refreshToken');
    if (!targetUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const orders = await Order.find({ user: id }).sort({ createdAt: -1 }).limit(10);
    const stats = await Order.aggregate([
      { $match: { user: targetUser._id } },
      { $group: { _id: null, totalOrders: { $sum: 1 }, totalSpent: { $sum: '$totalAmount' }, completedOrders: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } } } }
    ]);

    return NextResponse.json({ 
      data: { 
        user: targetUser, 
        orders, 
        stats: stats[0] || { totalOrders: 0, totalSpent: 0, completedOrders: 0 } 
      }, 
      message: "User detailed fetched" 
    });
  } catch (error) {
    console.error("Admin User Detail Error:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
