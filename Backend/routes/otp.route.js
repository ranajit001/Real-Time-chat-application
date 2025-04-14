
import { verifyOTP,resendOpt } from "../controllers/otp.controller.js";
import express from "express";


const OTP_router =express.Router();

OTP_router.post('/verify-otp',verifyOTP);
OTP_router.post('/resend-otp',resendOpt)

export{OTP_router}