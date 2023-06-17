import express from "express";
import { requireSignIn, 
    isAdmin } from "../middlewares/authMiddleware.js";
import { addComment, deleteComment, getAllPostsWithComments, getComment } from "../controllers/commentController.js";



//router object
const router = express.Router()

//routing 
//GET All posts with comments
router.get("/posts-comments", getAllPostsWithComments);
// GET a post with its comments
router.get("/post-comment/:id",requireSignIn, getComment );

// POST add comment
router.post("/add-comment", requireSignIn, addComment );

// DELETE comment
router.delete(
  "/delete-comment/:comment_id", requireSignIn, deleteComment 
);

export default router;
