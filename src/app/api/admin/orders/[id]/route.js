import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { getAuthUser } from '@/lib/auth-server';
import sendEmail from '@/lib/email';

export async function GET(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const order = await Order.findById(id).populate('user', 'name email phone');
    if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

    return NextResponse.json({ data: order, message: "Order details fetched" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, adminNotes } = body;

    await connectDB();
    const order = await Order.findByIdAndUpdate(id, { status, adminNotes }, { new: true }).populate('user', 'fullName email');
    if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

    // Status notification email
    const getStatusText = (s) => s === 'shipped' ? "is now on the Move!" : (s === 'delivered' ? "has been Delivered!" : `status updated to ${s.toUpperCase()}`);
    
    const itemsHtml = order.items.map(i => `
      <div style="padding: 10px 0; border-bottom: 1px dotted #eee; font-size: 13px;">
        <b>${i.name}</b> x ${i.quantity}
      </div>
    `).join('');

    const emailMessage = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; border: 1px solid #f0f0f0; padding: 40px; border-radius: 20px; max-width: 600px; margin: auto; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
           <div style="display: inline-block; padding: 8px 15px; background: #f0fdf4; color: #16a34a; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Shipment Update</div>
           <h2 style="color: #111; font-size: 24px; margin: 0; letter-spacing: -0.5px;">Your Order ${getStatusText(status)}</h2>
        </div>

        <div style="background: #fafafa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
          <p style="margin: 0 0 10px; font-size: 14px;">Hello <b>${order.user?.fullName || 'Customer'}</b>,</p>
          <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.6;">
            Your shipment with Nature Lovers (<b>Order #${order._id.toString().slice(-8).toUpperCase()}</b>) has moved to the <b style="color: #000;">${status.toUpperCase()}</b> phase.
          </p>
        </div>

        <div style="margin-bottom: 30px;">
           <h3 style="font-size: 12px; text-transform: uppercase; color: #999; letter-spacing: 1px; margin-bottom: 15px;">Shipment Summary</h3>
           ${itemsHtml}
        </div>

        <div style="text-align: center; margin-top: 40px;">
           <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://nature-lovers-official.vercel.app'}/account" style="background: #000; color: #fff; padding: 15px 35px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Track Shipment</a>
           <p style="margin-top: 25px; color: #999; font-size: 11px;">Questions? Call us at +91 9110750796</p>
        </div>
      </div>
    `;

    // Notification to User
    try {
        await sendEmail({
            to: order.user?.email || order.contactInfo?.email,
            subject: `Order Update: #${order._id.toString().slice(-6)} is ${status.toUpperCase()}`,
            message: emailMessage
        });
    } catch (err) {
        console.error("Admin Update Email Error:", err);
    }

    return NextResponse.json({ data: order, message: "Order updated Successfully and Notification has been sent!" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const order = await Order.findByIdAndDelete(id);
    if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

    return NextResponse.json({ message: "Order deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
