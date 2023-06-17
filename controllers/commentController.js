import userModel from "../models/userModel.js";
import postModel from "../models/postModel.js";
import commentModel from "../models/commentModel.js";
import slugify from "slugify";
import mongoose from "mongoose";

export const getAllPostsWithComments = async (req, res) => {
    try {
        const posts = await postModel
          .find({})
          .lean()
          .sort({ createdAt: -1 });
          
        const postComments = await Promise.all(
          posts.map(async (post) => {
            // get all comments for each post
            const comments = await commentModel
              .find({ post: post._id })
              .lean();
            // merge the post and its comments into a single object
            return { post, comments };
          })
        );
    
        res.status(200).send({
          success: true,
          postComments,
        });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error in retrieving posts',
        error,
      });
    }
  };

export const getComment = async (req, res) => {
    
        const postId = req.params.id;

        // Check if postId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(postId)) {
          return res.status(400).json({ error: 'Invalid postId' });
        }
      
        try {
          const post = await postModel.findById(postId);
          if (!post) {
            return res.status(404).json({ error: 'Post not found' });
          }
      
          const comments = await commentModel.find({ post: postId });
      
          res.status(200).json({
            success: true,
            post,
            comments,
          });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'There was an error in getting this comment',
        error,
      });
    }
  };
  

export const addComment = async (req, res) => {
    try {
        const {content, User, Post, slug} = req.body;
        //validation
        switch(true){
            case !content:
                return res.status(500).send({error:"Content is required"});
            case !User:
                return res.status(500).send({error:"User is required"});
            case !Post:
                return res.status(500).send({error:"Post is required"});
        }
        
        const comment = await commentModel.create({
            content: { text: content },
            user: User,
            post: Post,
            slug: slugify(content),
          });
        res.status(200).send({
            success:true,
            message:'Comment created successfuly',
            comment,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'There was an error in creating a comment',
            error,
        });
    }
};

export const deleteComment = async  (req, res) => {
    try {
        const commentId = req.params.comment_id;

        // Check if the post exists
        const comment = await commentModel.findByIdAndRemove(commentId);
        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"There was an error in deleting this comment",
            error,
        })
    }
};