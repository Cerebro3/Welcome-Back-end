import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from './../helpers/authHelper.js';
import  JWT  from "jsonwebtoken";
import fs from "fs";
import slugify from "slugify";

export const registerController = async (req, res) => {
    try {
        // const {name, slug, email, password, school, address, question} = req.body;
        //validation
        console.log(req.body);
        const {name, email,  school, address, question, password} = req.body;
        if(!name){
            return res.send({message: 'Name is required for authentication !'});
        }
        if(!email){
            return res.send({message: 'Email is required for authentication !'});
        }
        if(!password){
            return res.send({message: 'Password is required for authentication !'});
        }
        if(!school){
            return res.send({message: 'School is required for authentication !'});
        }
        if(!address){
            return res.send({message: 'Address is required for authentication !'});
        }
        if(!question){
            return res.send({message: 'Question is required for authentication !'});
        }

        //check if user exist
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:" An account is already registered with this email. Login or try another email",
            });
        }
        //register user
        const hashedPassword = await hashPassword(password);
        //save user
        const user = new userModel({
            name,
            email,
            school,
            address, 
            question,
            slug:slugify(name),
            password: hashedPassword,
        })
        await user.save();
        res.status(200).send({
            success:true,
            message:" Account added successfully ",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message:" An unexpected error happened.. Try again",
            error,
        });
    }
};

//POST LOGIN

export const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email){
            return res.status(404).send({
                success:false,
                message:'Please enter you email',
            });
        }
        if(!password){
            return res.status(404).send({
                success:false,
                message:"Please enter you password",
            });
        }
        //check user existance
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                message:"User doesn't exist, Try another one or register",
            });
        }

        const match = await comparePassword(password, user.password);
        if(!match){
            return res.status(400).send({
                success:false,
                message:"Wrong password!",
            });
        }
        //add token 
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success:true,
            message:"login successfully",
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                school: user.school,
                address: user.address,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message:" An unexpected error happened in login.. Try again",
            error,
        });
    }
};


//forgotPasswordController

export const forgotPasswordController = async (req, res) => {
    try {
        const {email, question, newPassword} = req.body
        if (!email) {
            res.status(400).send({
                message:"Please enter your email first",
            });
        }
        if (!question) {
            res.status(400).send({
                message:"Please enter the question",
            });
        }
        if (!newPassword) {
            res.status(400).send({
                message:"Please enter the new password",
            });
        }
        //check user 
        const user = await userModel.findOne( {email,question} );
        //validation
        if (!user) {
            return res.status(404).send({
                success:false,
                message:"User not found or wrong answer",
            });
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password:hashed });
        res.status(200).send({
            success:true,
            message:"Password reset successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"something went wrong while reseting password",
            error
        })
        
    }
};

//update profile

export const updateProfileController = async (req, res) => {
    try {
        const {name, slug, email, password, address, school} = req.body; 
        const user = await userModel.findById(req.user._id)
        //password
        if(password && password.length < 6){
            return res.json({error:'Password is required and with 6 character long'});
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            slug:slugify(name) || user.slug,
            password: hashedPassword || user.password,
            school: school || user.school,
            address: address ||user.address,
        }, {new:true})
        res.status(200).send({
            success:true,
            message:'Profile updated successfully',
            updatedUser,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:"There was an error in updating the profile",
            error,
        });
    }
};


//get Accounts

export const getAccountsController = async(req, res) => {
    try{
            const accounts = await userModel.find({}).limit(100).sort({ createdAt: -1});
            res.status(200).send({
                TotalAccounts: accounts.length,
                success:true,
                message:"Here is a list of all accounts",
                accounts,
            });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"There was an error in getting all accounts",
            error,
        })
    }
};

//get account by slug

export const getAccountController = async (req, res) => {
    try {
        const account= await userModel.findOne({slug:req.params.slug});
        if(!account){
            res.status(404).send({
                success:false,
                message:"Couldn't find any account matches your search",
            })
        }else{
        res.status(200).send({
            success:true,
            message:"Here is the details of the account",
            account,
        })
    }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"There was an error in getting this account",
            error,
        })
    }
};


//delete account

export const deleteAccountController = async(req, res) => {
    try {
        await userModel.findByIdAndRemove(req.params.id);
        res.status(200).send({
            success:true,
            message:"Account was deleted successfuly",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"There was an error in deleting this account",
            error,
        })
    }
};