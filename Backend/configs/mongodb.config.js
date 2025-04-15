import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
let connection = null; // Store first connection

async function connectDB() {
    if (!connection) {
        connection = await mongoose.connect(process.env.MONGO_URI, {
        });
        console.log("✅ Connected to MongoDB");
    }
    return connection;
}


export default connectDB;
