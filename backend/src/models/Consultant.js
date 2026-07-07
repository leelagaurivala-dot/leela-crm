import mongoose from 'mongoose';

const consultantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a consultant name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
    },
  },
  {
    timestamps: true,
  }
);

const Consultant = mongoose.model('Consultant', consultantSchema);
export default Consultant;
