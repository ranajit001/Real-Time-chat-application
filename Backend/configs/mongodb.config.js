import mongoose from "mongoose";

let connection = null; // Store first connection

async function connectDB() {
    if (!connection) {
        connection = await mongoose.connect('mongodb://127.0.0.1:27017/hiiiiiiiii', {
        });
        console.log("✅ Connected to MongoDB");
    }
    return connection;
}


export default connectDB;
