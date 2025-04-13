import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: [true, "Name is required."], 
        trim: true, 
        minlength: [4, "Name must be at least 4 characters."], 
        maxlength: [50, "Name cannot exceed 50 characters."]
    },

    username: { 
        type: String, 
        required: [true, "Username is required."], 
        unique: true, 
        trim: true, 
        minlength: [3, "Username must be at least 3 characters."], 
        maxlength: [30, "Username cannot exceed 30 characters."], 
        match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."]
    },

    email: { 
        type: String, 
        required: [true, "Email is required."], 
        unique: true, 
        trim: true, 
        lowercase: true, 
        match: [/^\S+@\S+\.\S+$/, "Enter a valid email address (e.g., user@example.com)."]
    },

    password: { 
        type: String, 
        required: [true, "Password is required."], 
        trim: true, 
        minlength: [5, "Password must be at least 5 characters."]
    },

    profilePic: { 
        type: String, 
        default: "", 
        trim: true 
    },
    files:[
        {type:String,trim:true}
    ],

    last_seen: { 
        type: Date, 
        default: Date.now 
    }
},
{ timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);
