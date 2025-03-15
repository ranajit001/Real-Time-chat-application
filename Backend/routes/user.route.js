import express from 'express';

import { protectRoute } from '../middlewares/auth.middleware.js';

import {  register,login,sendResetEmail, newPassget,newPassPost,updateProfileImag } from '../controllers/user.controller.js';

const UserRouter = express.Router();

UserRouter.post('/register',register);
UserRouter.post('/login',login);
UserRouter.post('/forgot_password',sendResetEmail);
UserRouter.get('/reset_password/:token',newPassget);
UserRouter.post('/reset_password/:token',newPassPost);
UserRouter.patch('/update_profile_pic',protectRoute,updateProfileImag);

export default UserRouter