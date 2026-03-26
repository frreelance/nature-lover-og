import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, phone } = await req.json();

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email or phone number already in use" }, { status: 400 });
    }

    const newUser = await User.create({ name, email, password, phone });
    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();
    
    newUser.refreshToken = refreshToken;
    await newUser.save();

    const response = NextResponse.json({
      success: true,
      message: "User created successfully",
      accessToken,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: "user",
      }
    }, { status: 201 });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, 
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
