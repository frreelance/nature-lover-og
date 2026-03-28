import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [{
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['plant', 'service'], required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: String,
    category: String,
    size: String,
    duration: String
  }],
  totalAmount: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    addressType: { type: String, enum: ['home', 'office', 'other'], default: 'home' },
    country: { type: String, default: 'India' }
  },
  contactInfo: {
    phone: String,
    email: String
  },
  notes: String,
  paymentMethod: {
    type: String,
    enum: ['cod', 'razorpay'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  whatsappSent: { type: Boolean, default: false },
  whatsappMessageId: String,
  emailSent: { type: Boolean, default: false },
  estimatedDeliveryDate: Date,
  adminNotes: String
}, {
  timestamps: true
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

// Force schema update in Next.js development environment by checking if fields exist
if (mongoose.models.Order && !mongoose.models.Order.schema.paths['paymentMethod']) {
  delete mongoose.models.Order;
}

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
