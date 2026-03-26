import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';
import { getAuthUser } from '@/lib/auth-server';

export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    
    await connectDB();
    const query = search ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      } : {};

    const users = await User.find(query).select('-password -refreshToken').sort({ createdAt: -1 });

    return NextResponse.json({ data: { users }, message: "Users fetched" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// User details with stats
export async function POST(req) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await req.json();

    await connectDB();
    const targetUser = await User.findById(userId).select('-password -refreshToken');
    if (!targetUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).limit(10);
    const stats = await Order.aggregate([
      { $match: { user: targetUser._id } },
      { $group: { _id: null, totalOrders: { $sum: 1 }, totalSpent: { $sum: '$totalAmount' }, completedOrders: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } } } }
    ]);

    return NextResponse.json({ data: { user: targetUser, orders, stats: stats[0] || {} }, message: "User detailed fetched" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
