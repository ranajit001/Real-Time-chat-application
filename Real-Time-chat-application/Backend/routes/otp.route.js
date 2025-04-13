
import { verifyOTP } from "../controllers/otp.controller.js";
import express from "express";


const OTP_router =express.Router();

OTP_router.post('/verify-otp',verifyOTP);

export{OTP_router}