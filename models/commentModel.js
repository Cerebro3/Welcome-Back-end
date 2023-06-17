import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  
    {
        content : {
            text: { type: String, required: true },
          },
    
        user : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
          },
        post : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
          },
        slug:{
            type:String,
            required:true
          },
      },

  { timestamps: true }
);


export default mongoose.model("Comment", commentSchema);