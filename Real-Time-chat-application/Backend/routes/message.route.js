import { testMessageRoute,getUsersForSidebar} from '../controllers/message.controller.js';
import express from 'express';

const MessageRouter = express.Router();

MessageRouter.get('/',testMessageRoute);


export{MessageRouter};