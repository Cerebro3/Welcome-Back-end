import mongoose from "mongoose";
 
const userSchema = new mongoose.Schema({
  name : {
    type:String, 
    required:true,
    trim:true 
  },
  slug:{
    type:String,
    required:false
  },
  
  email :{
    type:String ,
    required:true ,
    unique:true,

  },
  password:{
    type:String ,
    required:false,

  },
  address:{
    type:String,
    required:true,

  },
  school:{
    type:String,
    required:true,
  },
  question:{
    type:String,
    required:true,
  },
  role:{
    type:Number,
    default:0
  }
}, {timestamps:true})



export default mongoose.model('users', userSchema)