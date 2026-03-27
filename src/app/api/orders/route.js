import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import { getAuthUser } from '@/lib/auth-server';

export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    
    await connectDB();
    const query = { user: user._id };
    if (status) query.status = status;

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: { orders }, message: "Orders retrieved" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { deliveryAddress, contactInfo, notes } = await req.json();

    await connectDB();
    const cart = await Cart.findOne({ user: user._id });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
    }

    // Pincode validation: 6 digits
    if (!deliveryAddress?.pincode || !/^\d{6}$/.test(deliveryAddress.pincode)) {
      return NextResponse.json({ success: false, message: "Please provide a valid 6-digit pincode" }, { status: 400 });
    }

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 4);

    const order = await Order.create({
      user: user._id,
      items: cart.items,
      totalAmount: cart.totalAmount,
      totalItems: cart.totalItems,
      status: 'pending',
      deliveryAddress,
      contactInfo,
      notes,
      estimatedDeliveryDate
    });

    cart.items = [];
    cart.totalAmount = 0;
    cart.totalItems = 0;
    await cart.save();

    return NextResponse.json({ 
      success: true, 
      data: order, 
      message: "Order placed successfully! Your order will be delivered in 3-5 days. For help, contact +91 9110750796" 
    }, { status: 201 });
  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
