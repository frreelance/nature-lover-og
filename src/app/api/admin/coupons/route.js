import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Coupon from '@/models/Coupon';
import { getAuthUser } from '@/lib/auth-server';

export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: coupons });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { code, discountPercentage, targetType, isActive } = await req.json();

    if (!code || !discountPercentage) {
      return NextResponse.json({ success: false, message: "Code and discount percentage are required" }, { status: 400 });
    }

    await connectDB();
    const exist = await Coupon.findOne({ code: code.toUpperCase() });
    if (exist) {
      return NextResponse.json({ success: false, message: "Coupon code already exists" }, { status: 400 });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountPercentage,
      targetType: targetType || 'all',
      isActive: isActive !== undefined ? isActive : true
    });

    return NextResponse.json({ success: true, data: coupon, message: "Coupon created successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}
