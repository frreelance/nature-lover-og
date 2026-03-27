import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["plant", "service"],
      required: [true, "Product type is required"],
    },
    images: {
      type: [String], // Array of Cloudinary URLs
      required: [true, "At least one image is required"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    // For plants
    size: {
        type: String,
        enum: ["Small", "Moderate", "Large"],
    },
    care: {
        watering: String,
        sunlight: String,
        temperature: String,
    },
    potIncluded: {
        type: Boolean,
        default: false
    },
    // For services
    duration: String, // e.g., "1 hour", "Monthly"
    serviceDetails: [String],
    
    ratings: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: "text", category: "text" });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
