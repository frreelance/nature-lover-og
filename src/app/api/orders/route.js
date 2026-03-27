import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import { getAuthUser } from '@/lib/auth-server';
import sendEmail from '@/lib/email';

export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    
    await connectDB();
    const query = { user: user._id };
    if (status) query.status = status;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ 
      success: true, 
      data: { orders }, 
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit
      },
      message: "Orders retrieved" 
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { deliveryAddress, contactInfo, notes } = await req.json();

    await connectDB();
    const cart = await Cart.findOne({ user: user._id });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
    }

    // Pincode validation: 6 digits
    if (!deliveryAddress?.pincode || !/^\d{6}$/.test(deliveryAddress.pincode)) {
      return NextResponse.json({ success: false, message: "Please provide a valid 6-digit pincode" }, { status: 400 });
    }

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 4);

    const order = await Order.create({
      user: user._id,
      items: cart.items,
      totalAmount: cart.totalAmount,
      totalItems: cart.totalItems,
      status: 'pending',
      deliveryAddress,
      contactInfo,
      notes,
      estimatedDeliveryDate
    });

    cart.items = [];
    cart.totalAmount = 0;
    cart.totalItems = 0;
    await cart.save();

    // Send Emails in background
    const itemsHtml = order.items.map(i => `
      <div style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 15px;">
        <div>
          <p style="margin: 0; font-weight: bold; color: #333; font-size: 14px;">${i.name}</p>
          <p style="margin: 4px 0 0; font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px;">
            ${i.type === 'plant' ? `Size: ${i.size || 'Standard'}` : `Duration: ${i.duration || 'Session'}`} | ${i.category || ''}
          </p>
          <p style="margin: 4px 0 0; font-weight: bold; color: #000; font-size: 13px;">${i.quantity} x ₹${i.price}</p>
        </div>
      </div>
    `).join('');

    const emailMessage = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; padding: 40px; border-radius: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin: 0; font-size: 28px; letter-spacing: -1px;">Order Confirmed</h1>
          <p style="color: #999; font-size: 12px; text-transform: uppercase; tracking: 2px; margin-top: 10px;">Thank you for your purchase!</p>
        </div>

        <div style="background: #fafafa; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
          <table width="100%">
            <tr>
              <td><span style="color: #999; font-size: 11px; text-transform: uppercase;">Order Number</span><br/><b>#${order._id.toString().slice(-8).toUpperCase()}</b></td>
              <td align="right"><span style="color: #999; font-size: 11px; text-transform: uppercase;">Date</span><br/><b>${new Date().toLocaleDateString()}</b></td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #16a34a; padding-bottom: 10px; display: inline-block;">Items Ordered</h3>
          ${itemsHtml}
          <div style="text-align: right; padding-top: 20px;">
            <p style="margin: 0; color: #999; font-size: 12px;">Total Amount</p>
            <p style="margin: 5px 0 0; font-size: 24px; font-weight: bold; color: #16a34a;">₹${order.totalAmount}</p>
          </div>
        </div>

        <div style="margin-bottom: 40px;">
          <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #16a34a; padding-bottom: 10px; display: inline-block;">Shipping Address</h3>
          <div style="margin-top: 15px; color: #666; line-height: 1.6; font-size: 14px;">
            <p style="margin: 0; font-weight: bold; color: #333;">${user.fullName}</p>
            <p style="margin: 2px 0;">${order.deliveryAddress.street}</p>
            <p style="margin: 2px 0;">${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pincode}</p>
            <p style="margin: 5px 0 0;"><b>Phone:</b> ${order.contactInfo.phone}</p>
          </div>
        </div>

        <div style="text-align: center; border-top: 1px solid #eee; padding-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://nature-lovers-official.vercel.app'}/account" style="background: #000; color: #fff; padding: 15px 35px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Manage your Order</a>
          <p style="margin-top: 25px; color: #999; font-size: 11px;">If you have any questions, reply to this email or contact us at <b>+91 9110750796</b></p>
        </div>
      </div>
    `;

    // Send Emails and wait for completion to avoid serverless timeout
    try {
        await Promise.all([
            sendEmail({
                to: order.contactInfo.email,
                subject: `Order Recieved - Nature Lovers #${order._id.toString().slice(-6)}`,
                message: emailMessage
            }),
            sendEmail({
                to: process.env.SMTP_MAIL,
                subject: `New Order from ${user.fullName}!`,
                message: emailMessage
            })
        ]);
    } catch (err) {
        console.error("New Order Notification Error:", err);
    }

    return NextResponse.json({ 
      success: true, 
      data: order, 
      message: "Order placed successfully! Order status: PENDING. For help, contact +91 9110750796" 
    }, { status: 201 });
  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
