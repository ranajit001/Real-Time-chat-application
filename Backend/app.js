import http from 'http';
import express from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from "./configs/mongodb.config.js";
import UserRouter from "./routes/user.route.js";
import { OTP_router } from './routes/otp.route.js';
import Upload_router from './routes/upload.route.js';
//setup server and Socket.io
import { setupSocket } from './routes/message.socket.js';
const app = express();
const server = http.createServer(app);
setupSocket(server);


app.use(express.json());
app.use(cors())



app.use('/users',UserRouter);
app.use('/verify',OTP_router)
app.use('/upload',Upload_router)






const PORT = process.env.PORT || 5000;


server.listen(+PORT,async () => {
    await connectDB();
    console.log('server started...');
    
})


