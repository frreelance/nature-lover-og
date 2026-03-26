import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/models/Cart';
import { getAuthUser } from '@/lib/auth-server';

export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await connectDB();
    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = await Cart.create({ user: user._id, items: [] });
    }

    return NextResponse.json({ success: true, data: cart, message: "Cart retrieved" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { itemId, name, type, price, quantity = 1, image, category } = await req.json();

    await connectDB();
    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = new Cart({ user: user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(i => i.itemId === itemId && i.type === type);
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({ itemId, name, type, price, quantity, image, category });
    }

    await cart.save();
    return NextResponse.json({ success: true, data: cart, message: "Added to cart" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { itemId, type, quantity } = await req.json();

    await connectDB();
    const cart = await Cart.findOne({ user: user._id });
    if (!cart) return NextResponse.json({ success: false, message: "Cart not found" }, { status: 404 });

    const index = cart.items.findIndex(i => i.itemId === itemId && i.type === type);
    if (index === -1) return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });

    if (quantity <= 0) {
      cart.items.splice(index, 1);
    } else {
      cart.items[index].quantity = quantity;
    }

    await cart.save();
    return NextResponse.json({ success: true, data: cart, message: "Cart updated" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await connectDB();
    const cart = await Cart.findOne({ user: user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return NextResponse.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}
