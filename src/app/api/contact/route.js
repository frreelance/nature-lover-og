import { NextResponse } from 'next/server';
import sendEmail from '@/lib/email';

export async function POST(req) {
  try {
    const { firstName, lastName, email, phone, message } = await req.json();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ message: "First name, last name, email, and message are required" }, { status: 400 });
    }

    const emailSubject = `New Contact Form Submission - ${firstName} ${lastName}`;
    const emailMessage = `
        <div style="font-family: Arial, sans-serif;">
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Message:</strong> ${message}</p>
        </div>
    `;

    // We use try-catch for individual emails to ensure at least one succeeds or we log errors
    try {
      await sendEmail({
        to: 'yaswantsoni2004@gmail.com',
        subject: emailSubject,
        message: emailMessage
      });
    } catch (err) {
      console.error("Admin Email Error:", err);
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!'
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ message: "Failed to send message" }, { status: 500 });
  }
}
