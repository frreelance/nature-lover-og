import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const size = searchParams.get('size');
    const minPrice = parseInt(searchParams.get('minPrice')) || 0;
    const maxPrice = parseInt(searchParams.get('maxPrice')) || 1000000;
    
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;

    await connectDB();
    const query = { isAvailable: true };
    
    if (type) query.type = { $regex: type, $options: 'i' };
    if (category && category !== 'all') query.category = { $regex: category, $options: 'i' };
    if (size && size !== 'all') query.size = { $regex: size, $options: 'i' };
    query.price = { $gte: minPrice, $lte: maxPrice };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ 
      success: true, 
      data: products, 
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit
      },
      message: "Products fetched successfully" 
    });
  } catch (error) {
    console.error("Public Products Fetch Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
