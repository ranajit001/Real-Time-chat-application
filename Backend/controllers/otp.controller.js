import { OTP_Model } from "../models/otp.model.js";
import { UserModel } from "../models/user.model.js";
import { generate_Credentials } from "./user.controller.js"; //from controller
import nodemailer from 'nodemailer'
const generateToken = (user) => jwt.sign({_id:user._id,username:user.username, email: user.email, role:user.role }, process.env.JWT_SECRET);



const verifyOTP = async(req,res)=>{
    try {
        console.log(req.body)
        const otp = req.body.otp;
        const email =  req.body.email;
        if(!otp || !email)
             return res.status(404).json({ message: "OTP not found for this email" });
        const validatin = await OTP_Model.findOne({otp,email});
        if(!validatin)
                return res.status(400).json({message:'user not found'});
        if(validatin.otp == otp){
            const usernameOrEmail = email;
            const password = 'from_verify_otp'
            const details = await generate_Credentials(usernameOrEmail, password);
            res.status(200).send(details);//for proper correct output
         }else
         res.status(401).json({message:'invalid otp...'}) 
        } catch (e) {
            console.log(e)
            res.status(e.status || 500).json({ message: e.message }); // any error catch here
        }
};

//re-send
const resendOpt = async(req,res)=>{
try {
    console.log(req.body);
    
    if(!req.body.email) res.status(404).json({message:'email not found'})
    const response = await createOtp(req.body.email)
res.status(200).json({message:response})
} catch (e) {
    res.status(500).json({message:'error from resen dotp'})
}
}

const createOtp = async (email) => {
    try {
        const generateOTP = () => Math.floor(Math.random() * 1000000).toString().padStart(6, '9');
        const otp = generateOTP();

        let existed = await OTP_Model.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() }, //  Reset TTL auto document delete timer  expiry time appliedc inside otp model
            { new: true, upsert: true } //  if this user not avail then cretes a new user to create if not found.
        );

        const result = await send_email_with_otp(email, otp); //sneding opt function call
        return result;

    } catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
};




const send_email_with_otp = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.NODE_MAILER_ADMIN_EMAIL,
                pass: process.env.NODE_MAILER_ADMIN_PASS,
            },
        });

        const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        font-family: Arial, sans-serif;
                    }
                    .header {
                        background:rgb(37, 104, 229);
                        color: white;
                        padding: 20px;
                        text-align: center;
                        border-radius: 5px 5px 0 0;
                    }
                    .content {
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 0 0 5px 5px;
                        border: 1px solid #ddd;
                    }
                    .otp-code {
                        font-size: 32px;
                        font-weight: bold;
                        text-align: center;
                        color:rgb(0, 122, 98);
                        padding: 20px;
                        background: white;
                        border-radius: 5px;
                        margin: 20px 0;
                        letter-spacing: 5px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        color: #666;
                        font-size: 12px;
                    }
                    .warning {
                        color: #dc3545;
                        font-size: 14px;
                        margin-top: 15px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Email Verification</h1>
                    </div>
                    <div class="content">
                        <p>Hello,</p>
                        <p>Thank you for signing up! Please use the following OTP to verify your email address:</p>
                        
                        <div class="otp-code">
                            ${otp}
                        </div>
                        
                        <p>This OTP will expire in 10 minutes for security reasons.</p>
                        
                        <div class="warning">
                            ⚠️ Never share this OTP with anyone. Our team will never ask for your OTP.
                        </div>
                    </div>
                    <div class="footer">
                        <p>This is an automated message, please do not reply to this email.</p>
                        <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await transporter.sendMail({
            from: `"👋 Support Team" <${process.env.NODE_MAILER_ADMIN_EMAIL}>`,
            to: email,
            subject: "Verify Your Email Address",
            html: htmlTemplate
        });

        return "OTP sent successfully";
    } catch (error) {
        console.error("Error in sending OTP email:", error.message);
        throw new Error("Failed to send OTP email");
    }
};







export{
    createOtp, // imported to user controller signup function 
    verifyOTP,
    resendOpt
}

