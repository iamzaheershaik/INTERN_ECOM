import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    isDeleted: {
      type: Boolean,
      default: false, // Soft delete flag (PDF: "soft delete preferred")
    },
  },
  {
    timestamps: true,
  }
);

// Exclude soft-deleted products from all find and count queries by default
const excludeDeleted = function () {
  this.where({ isDeleted: { $ne: true } });
};

productSchema.pre(/^find/, excludeDeleted);
productSchema.pre(/^count/, excludeDeleted);

const Product = mongoose.model('Product', productSchema);
export default Product;
