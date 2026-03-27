import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/auth-server';
import cloudinary from '@/lib/cloudinary';

export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });

    return NextResponse.json({ 
      data: products, 
      message: "Products fetched successfully" 
    });
  } catch (error) {
    console.error("Admin Products Fetch Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, price, originalPrice, category, type, images, stock, isAvailable, care, potIncluded, duration, serviceDetails } = body;

    if (!name || !description || !price || !category || !type || !images || images.length === 0) {
      return NextResponse.json({ message: "Required fields missing" }, { status: 400 });
    }

    await connectDB();

    const product = await Product.create({
      name,
      description,
      price,
      originalPrice,
      category,
      type,
      images,
      stock: type === 'plant' ? (stock || 0) : undefined,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      care: type === 'plant' ? care : undefined,
      potIncluded: type === 'plant' ? potIncluded : undefined,
      duration: type === 'service' ? duration : undefined,
      serviceDetails: type === 'service' ? serviceDetails : undefined,
    });

    return NextResponse.json({ 
      data: product, 
      message: "Product added successfully" 
    }, { status: 201 });
  } catch (error) {
    console.error("Admin Product Add Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
