import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a lead name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
    },
    whatsapp: {
      type: String,
      default: '',
    },
    dob: {
      type: String,
      default: '',
    },
    tob: {
      type: String,
      default: '',
    },
    pob: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    occupation: {
      type: String,
      default: '',
    },
    concern: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    consultant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Consultant',
      default: null,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Converted', 'Lost'],
      default: 'New',
    },
    convertedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',
      default: null,
    },
    shopifyData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ createdAt: -1 });
leadSchema.index({ status: 1 });
leadSchema.index({ consultant: 1 });

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
