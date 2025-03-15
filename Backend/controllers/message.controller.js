
import { UserModel } from "../models/user.model.js";
import messageModel from "../models/message.model.js";

const testMessageRoute = (req,res)=> res.send('message route online...')



const search_user = async (text) => {
    try {
        const users = await UserModel.find({
            username: { $regex: text, $options: "i" } 
        }).select('-password');
        // console.log(text,users)
        return users; 
    } catch (e) {
        console.error("Error searching users:", e);
        throw e;
    }
};


search_user('li')




const getUsersForSidebar = async (my_username) => {
    try {
        // const my_username= req.body.username
       const already_chatted_users = await messageModel.aggregate([
            {
                $match: {
                    $or: [
                        { sender_username: my_username },  // Messages where 'sumon' is the sender
                        { reciver_username: my_username }  // Messages where 'sumon' is the receiver
                    ]
                }
            },
            {
                $group: {
                    _id: { 
                        $cond: { 
                            if: { $eq: ["$sender_username", my_username] }, 
                            then: "$reciver_username", 
                            else: "$sender_username" 
                        } 
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "username",
                    as: "userData"
                }
            },
            {
                $unwind: "$userData"
            },
            {
                $project: {
                    _id: 0,
                    username: "$userData.username",
                    email: "$userData.email",
                    profilePic: "$userData.profilePic",
                    last_seen: "$userData.last_seen"
                }
            }
        ]);
        // console.log(already_chatted_users,'already_chattend users .............');
        // res.send(already_chatted_users)
        return already_chatted_users
        
    } catch (error) {
        console.log('error in message route=> get usersidebar function ', error);
        return'server error';
    }
};

// getUsersForSidebar('sumon')

const getMessagesList = async (my_username,others_username) => {
    try {
        const messages = await messageModel.find({
            $or: [
                { sender_username   : my_username  , reciver_username :  others_username }, 
                {  sender_username  : others_username  ,  reciver_username :  my_username } 
            ]
        });
          return messages      
    }
    catch (e) {
        console.log(' error from getMessagesList function', e);
        return'server error from  get message history' 
    }
};



const sendNewMessage = async(message)=>{
    try {

        const newMessage = await messageModel.create(message);
       return newMessage

    } catch (e) {
                console.log(' error from send Message function', e);
        return'server error from send message'
    }
};

const update_last_seen = async (my_id) => {
    try {
        await UserModel.findByIdAndUpdate(my_id, { last_seen: Date.now() });
    } catch (error) {
        console.log('Error from last seen update function:', error);
    }
};

export {search_user,testMessageRoute, getUsersForSidebar, getMessagesList,sendNewMessage,update_last_seen };