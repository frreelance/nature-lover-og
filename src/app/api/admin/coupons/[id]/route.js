import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Coupon from '@/models/Coupon';
import { getAuthUser } from '@/lib/auth-server';

export async function PUT(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    await connectDB();
    const coupon = await Coupon.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!coupon) {
      return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: coupon, message: "Coupon updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error updating coupon" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { isActive } = await req.json();

    await connectDB();
    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!coupon) {
      return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: coupon, message: "Coupon status updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error updating coupon status" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error deleting coupon" }, { status: 500 });
  }
}
