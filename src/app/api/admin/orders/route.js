import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { getAuthUser } from '@/lib/auth-server';

export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const query = (status && status !== 'all') ? { status } : {};

    await connectDB();
    const orders = await Order.find(query).populate('user', 'name email phone').sort({ createdAt: -1 });

    return NextResponse.json({ data: { orders }, message: "Orders fetched" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status, adminNotes } = await req.json();

    await connectDB();
    const order = await Order.findByIdAndUpdate(orderId, { status, adminNotes }, { new: true });
    if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

    return NextResponse.json({ data: order, message: "Order updated" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
    try {
      const user = await getAuthUser(req);
      if (!user || user.role !== 'admin') {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
  
      const { searchParams } = new URL(req.url);
      const orderId = searchParams.get('orderId');
  
      await connectDB();
      const order = await Order.findByIdAndDelete(orderId);
      if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });
  
      return NextResponse.json({ message: "Order deleted" });
    } catch (error) {
      return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
