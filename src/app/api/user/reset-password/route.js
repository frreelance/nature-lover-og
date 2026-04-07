import dbConnect from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await dbConnect();
    const { token, password } = await req.json();

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Password reset token is invalid or has expired",
        },
        { status: 400 }
      );
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
