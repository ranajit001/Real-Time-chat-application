import jwt from 'jsonwebtoken';
import cors from 'cors';
import {search_user, getUsersForSidebar,getMessagesList,sendNewMessage,update_last_seen } from '../controllers/message.controller.js';

import { Server } from "socket.io"; 


function setupSocket(server) {
  const io = new Server(server, {
      cors: {
          origin: "*", // Allows access from any origin
      }
    });
 
const sender_id_SocketMap = new Map();
const reciver_username_socketMap = new Map();




io.use(async (socket, next) => { 
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
          console.log('token not valid')
            return next(new Error('Authentication error: No token provided'));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('token verified');
        
        socket.user = decoded; // Attach decoded token (with user ID, email, etc.)
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        next(new Error('Authentication error: Invalid token'));
    }


  });



io.on("connection", async(socket) => {




    const my_id = socket.user._id; // Use MongoDB user ID as a sender;
    const my_username = socket.user.username ; // using my username to get messages where i am reciver , which is posible by only username
    const reciver_username = socket.user.username;       //string my username for other senders when i will be reciver..#*** 
    // console.log(`User connected: ${my_id}, socket ID: ${socket.id}`);




    // Store mapping using userId and username
    sender_id_SocketMap.set(my_id, socket.id); //storiing my id as sender
    reciver_username_socketMap.set(reciver_username,socket.id); //storing my username as reciver




    // sending offline online satus based on the username
    io.emit('userOnline', { username: socket.user.username});

  
    //searching user by usename
    socket.emit('loadUsers',await getUsersForSidebar(my_username));

    socket.on("search_user",async(username)=>{
      try{
        const searched_result = await search_user(username);
        console.log(searched_result)
        socket.emit('user_search_results',searched_result)
      }catch(e){
        console.log('error from searchuser backned');
      }
    })




   // uere username comming from frontend direclt no need to check in socket for message history
   socket.on("message_history", async (to) => {
    try {
        console.log(`Fetching message history for: ${my_id} <--> ${to}`);
        const messages = await getMessagesList(my_username, to); //using my username to get mesages hstory where i am reciver
        console.log(messages)
        socket.emit("load_message_history", messages);
    } catch (err) {
        console.error("Error fetching message history:", err);
    }
});



// Server Side: Listening for sent messages from the client
socket.on("sendPrivateMessage", async (messageData) => {
    try {
      console.log('raw data =>',messageData)
      // Save the message (simulate async DB operation)
      const savedMessage = await sendNewMessage(messageData);
      //console.log('processed data =>', savedMessage);
      // Find the recipient's socket ID by username
      const recipientSocketId = reciver_username_socketMap.get(messageData.reciver_username);
  
      if (recipientSocketId) {
        // Send the message to the recipient
        io.to(recipientSocketId).emit("newPrivateMessage", savedMessage);
      } else {
        console.log(`User ${messageData.reciver_username} is not online`);
        //  notify sender that recipient is offline
        socket.emit("userOffline", { username: messageData.reciver_username });
      }
  
      // Also send the message back to the sender
      socket.emit("newPrivateMessage", savedMessage);
    } catch (error) {
      console.error("Error saving and sending message:", error);
    }
  });
  


    socket.on("disconnect", async() => {
        console.log(`User disconnected: ${my_id}, socket ID: ${socket.id}`);
        await update_last_seen(my_id)
        sender_id_SocketMap.delete(my_id);  //deleting my id as sender
        reciver_username_socketMap.delete(reciver_username);  //deleting my username as reciver
        io.emit('userOffline', {  username: socket.user.username });
         });
    });



    return io; 
}

export { setupSocket };








