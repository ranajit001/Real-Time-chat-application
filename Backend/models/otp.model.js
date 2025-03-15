import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
   { 
    email: { type: String, trim: true, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 } // Auto-delete after 10 min
   }
);

const OTP_Model = mongoose.model("otp", otpSchema);
export { OTP_Model };
