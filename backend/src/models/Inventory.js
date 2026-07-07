import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add an item name'],
    },
    sku: {
      type: String,
      required: [true, 'Please add a SKU'],
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please add a quantity'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'General',
    },
    shopifyProductId: {
      type: String,
      default: '',
    },
    shopifyVariantId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

inventorySchema.index({ shopifyProductId: 1 });
inventorySchema.index({ shopifyVariantId: 1 });

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;
