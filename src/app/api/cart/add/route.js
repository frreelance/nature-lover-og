import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import { getAuthUser } from '@/lib/auth-server';

export async function POST(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { itemId, name, type, price, quantity = 1, image, category, size, duration } = await req.json();

    await connectDB();
    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = new Cart({ user: user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(i => i.itemId === itemId && i.type === type);
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += (quantity || 1);
      // Update metadata in case it changed
      cart.items[existingIndex].size = size;
      cart.items[existingIndex].duration = duration;
      cart.items[existingIndex].category = category;
    } else {
      cart.items.push({ itemId, name, type, price, quantity, image, category, size, duration });
    }

    await cart.save();
    return NextResponse.json({ success: true, data: cart, message: "Added to cart" });
  } catch (error) {
    console.error("Cart Add Error:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}
