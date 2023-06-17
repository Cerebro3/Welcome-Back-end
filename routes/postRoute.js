import express from "express";
import { requireSignIn, 
    isAdmin } from "../middlewares/authMiddleware.js";
import { createPost, deletePost, getAllPosts, getPost, updatePost } from "../controllers/postController.js";


//router object
const router = express.Router()

//routing 
// GET retrieve all posts
router.get("/", requireSignIn, getAllPosts );

// GET a post by user
router.get("/posts-user/:slug", requireSignIn, getPost);

// POST create post
router.post("/create-post", requireSignIn, createPost );

// PUT update post
router.put("/update-post/:post_id", requireSignIn, updatePost );

// DELETE delete post
router.delete(
  "/delete-post/:post_id", requireSignIn, deletePost
);

export default router;
