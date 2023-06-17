import mongoose from "mongoose";


const postSchema =  new mongoose.Schema(
  {
    content : {
        text: { type: String, required: true },
      },

    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      slug:{
        type:String,
        required:true
      },
  },
  { timestamps: true }
);



export default mongoose.model('Post', postSchema)
