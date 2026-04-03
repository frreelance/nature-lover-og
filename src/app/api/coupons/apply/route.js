import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Coupon from '@/models/Coupon';
import Cart from '@/models/Cart';
import { getAuthUser } from '@/lib/auth-server';

export async function POST(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { code } = await req.json();
    if (!code) return NextResponse.json({ success: false, message: "Coupon code is required" }, { status: 400 });

    await connectDB();
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    
    if (!coupon) {
      return NextResponse.json({ success: false, message: "Invalid or inactive coupon" }, { status: 404 });
    }

    if (coupon.usedBy.includes(user._id)) {
      return NextResponse.json({ success: false, message: "You have already used this coupon" }, { status: 400 });
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
    }

    let discountAmount = 0;
    cart.items.forEach(item => {
      if (coupon.targetType === 'all' || coupon.targetType === item.type) {
        discountAmount += (item.price * item.quantity) * (coupon.discountPercentage / 100);
      }
    });

    if (discountAmount === 0) {
      return NextResponse.json({ success: false, message: "This coupon is not applicable to any items in your cart" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        discountAmount
      },
      message: "Coupon applied successfully"
    });
  } catch (error) {
    console.error("Apply Coupon Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
