import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import { getAuthUser } from '@/lib/auth-server';

export async function DELETE(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { itemId, type } = await req.json();

    await connectDB();
    const cart = await Cart.findOne({ user: user._id });
    if (!cart) return NextResponse.json({ success: false, message: "Cart not found" }, { status: 404 });

    const index = cart.items.findIndex(i => i.itemId === itemId && i.type === type);
    if (index === -1) return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });

    cart.items.splice(index, 1);
    await cart.save();
    return NextResponse.json({ success: true, data: cart, message: "Item removed" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}
