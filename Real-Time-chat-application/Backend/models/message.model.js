import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
      sender_username:String,
      reciver_username:String,
      text:String,
      image:String,
  },
  { timestamps: true }
);
const messageModel =  mongoose.model("Message", messageSchema);
export default messageModel;


