import express from "express";
import { deleteAccountController, forgotPasswordController, getAccountController, getAccountsController, loginController, registerController, updateProfileController } from "../controllers/authController.js";
import { requireSignIn, 
    isAdmin } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router()

//routing 
//REGISTER
router.post('/register', registerController );

//login
router.post('/login', loginController);

//Forgot password
router.post('/forgot-password', forgotPasswordController);

//update profile
router.put('/update-profile', requireSignIn, updateProfileController);

//delete profile
router.delete('/delete-account/:id', requireSignIn, deleteAccountController);

//get accounts
router.get('/get-accounts', isAdmin, requireSignIn, getAccountsController);

//get account by slug
router.get('/get-account/:slug', getAccountController);




export default router ;
