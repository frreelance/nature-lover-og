import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    
    await connectDB();
    const query = { isAvailable: true };
    if (type) query.type = type;
    if (category) query.category = category;

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      data: products, 
      message: "Products fetched successfully" 
    });
  } catch (error) {
    console.error("Public Products Fetch Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
