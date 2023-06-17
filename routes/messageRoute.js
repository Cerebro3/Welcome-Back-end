import express from "express";
import { receiveMessages, sendMessage } from "../controllers/messageController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router()

//routing 
//Send a message
router.post("/send-msg", requireSignIn , sendMessage);

//receive message
router.post("/receive-msg", requireSignIn, receiveMessages);



export default router ;

