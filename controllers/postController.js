import { body, validationResult } from "express-validator";
import multer from "multer";
import path from "path";
import fs from "fs";
import userModel from "../models/userModel.js";
import postModel from "../models/postModel.js";
import slugify from "slugify";



export const getAllPosts = async (req, res) => {
    try{
        const posts = await postModel.find({}).limit(100).sort({ createdAt: -1});
        res.status(200).send({
            TotalPosts: posts.length,
            success:true,
            message:"Here is a list of all posts",
            posts,
        });
} catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:"There was an error in getting all posts",
        error,
    })
}
};

export const getPost = async (req, res) => {
    try {
        const user = await userModel.findOne({slug:req.params.slug});
        const posts = await postModel.find({user}).populate('user');
        res.status(200).send({
            success:true,
            user,
            posts,
        });
    
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"There was an error in getting this post",
            error,
        })
    }
};

export const createPost = async (req, res) => {
    try {
        const {content, User, slug} = req.body;
        //validation
        switch(true){
            case !content:
                return res.status(500).send({error:"Content is required"});
        }
        
        const post = await postModel.create({
            content: { text: content },
            user: User,
            slug:slugify(content),
          });
        res.status(200).send({
            success:true,
            message:'Post created successfuly',
            post,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'There was an error in creating a post',
            error,
        });
    }
};

export const updatePost = async  (req, res) => {
    try {
        const {content, slug, user} = req.body;
        
        //validation
        switch(true){
            case !content:
                return res.status(500).send({error:"Name is required"});
        }
        const post = await postModel.findByIdAndUpdate(
            req.params.post_id,{
            content: { text: content } || post.content, 
            slug: slugify(content) || post.slug
            },{new:true}
            );
            await post.save();
            res.status(200).send({
                success:true,
                message:'Post updated successfuly',
               post,
            });
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'There was an error in updating a post',
            error,
        });
    }

};

export const deletePost = async  (req, res) => {
    try {
        await postModel.findByIdAndRemove(req.params.post_id);
        res.status(200).send({
            success:true,
            message:"Post was deleted successfuly",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"There was an error in deleting this post",
            error,
        })
    }
};