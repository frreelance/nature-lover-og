import dbConnect from "@/lib/db";
import User from "@/models/User";
import sendEmail from "@/lib/email";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.NEXT_PUBLIC_API_URL}/reset-password/${resetToken}`;

    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #2e7d32; text-align: center;">Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>You are receiving this email because you (or someone else) have requested the reset of a password.</p>
        <p>Please click on the button below to reset your password. This link is valid for 15 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2e7d32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888; text-align: center;">Nature Lover Team</p>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Nature Lover - Password Reset Request",
        message,
      });

      return NextResponse.json({
        success: true,
        message: `Email sent to ${user.email}`,
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return NextResponse.json(
        { success: false, message: "Email could not be sent" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
