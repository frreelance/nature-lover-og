import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { getAuthUser } from '@/lib/auth-server';
import sendEmail from '@/lib/email';

export async function PATCH(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { status: newStatus } = await req.json();

    if (newStatus !== 'cancelled') {
        return NextResponse.json({ success: false, message: "Action not permitted" }, { status: 403 });
    }

    await connectDB();
    const order = await Order.findOne({ _id: id, user: user._id });

    if (!order) {
        return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // Business Logic: Only cancel if still pending
    if (order.status !== 'pending') {
        return NextResponse.json({ success: false, message: "Only pending orders can be cancelled!" }, { status: 400 });
    }

    order.status = 'cancelled';
    await order.save();

    // Send notifications
    const itemsHtml = order.items.map(i => `
      <div style="padding: 10px 0; border-bottom: 1px dotted #fecaca; font-size: 13px; color: #7f1d1d;">
        <b>${i.name}</b> x ${i.quantity}
      </div>
    `).join('');

    const emailMessage = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; border: 1px solid #fee2e2; border-radius: 20px; max-width: 600px; margin: auto; background: #fff;">
        <div style="text-align: center; margin-bottom: 30px;">
           <div style="display: inline-block; padding: 8px 15px; background: #fef2f2; color: #dc2626; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Cancellation Confirmed</div>
           <h2 style="color: #111; font-size: 24px; margin: 0; letter-spacing: -0.5px;">Shipment Cancelled</h2>
           <p style="color: #999; font-size: 12px; margin-top: 10px;">Order #${order._id.toString().slice(-8).toUpperCase()}</p>
        </div>

        <div style="background: #fefefe; border: 1px solid #fee2e2; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
          <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.6;">
            Hello <b>${user.fullName}</b>, your shipment cancellation has been processed. Your payment (if any) will be refunded as per our policy.
          </p>
        </div>

        <div style="margin-bottom: 30px;">
           <h3 style="font-size: 12px; text-transform: uppercase; color: #999; letter-spacing: 1px; margin-bottom: 15px;">Cancelled Items</h3>
           ${itemsHtml}
        </div>

        <div style="margin-bottom: 30px; border-top: 1px solid #fee2e2; padding-top: 20px;">
           <h3 style="font-size: 12px; text-transform: uppercase; color: #999; letter-spacing: 1px; margin-bottom: 15px;">Original Destination</h3>
           <p style="font-size: 14px; color: #666; margin: 0;">${order.deliveryAddress?.street}, ${order.deliveryAddress?.city}</p>
        </div>

        <p style="text-align: center; color: #999; font-size: 11px; margin-top: 40px;">If this was a mistake, please reach out immediately at +91 9110750796.</p>
      </div>
    `;

    // Await emails to ensure delivery in serverless env
    try {
        await Promise.all([
            sendEmail({
                to: order.contactInfo?.email || user.email,
                subject: `Nature Lovers: Order #${order._id.toString().slice(-6)} cancelled`,
                message: emailMessage
            }),
            sendEmail({
                to: process.env.SMTP_MAIL,
                subject: `ALERT: ${user.fullName} cancelled their order #${order._id.toString().slice(-6)}`,
                message: emailMessage
            })
        ]);
    } catch (err) {
        console.error("Cancellation Email Error:", err);
    }

    return NextResponse.json({ success: true, message: "Order cancelled successfully!" });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
