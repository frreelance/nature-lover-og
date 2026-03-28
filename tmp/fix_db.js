const mongoose = require('mongoose');
const MONGO_URI = "mongodb+srv://nature-lover:nature-lover@cluster0.zficgty.mongodb.net/?appName=Cluster0";
const orderSchema = new mongoose.Schema({
  paymentMethod: String,
  paymentStatus: String,
  status: String
}, { strict: false });
const Order = mongoose.model('Order', orderSchema);
async function fix() {
  try {
    await mongoose.connect(MONGO_URI);
    const result = await Order.updateMany(
      { paymentMethod: { $exists: false } },
      { $set: { paymentMethod: 'cod', paymentStatus: 'pending' } }
    );
    console.log('Fixed:', result);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
fix();
