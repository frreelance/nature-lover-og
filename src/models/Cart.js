import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  items: [{
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['plant', 'service'], required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: String,
    category: String
  }],
  totalAmount: { type: Number, default: 0 },
  totalItems: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Index for better query performance (Already created by unique: true)

cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalAmount = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  next();
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;
