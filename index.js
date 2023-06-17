import express from "express";
import colors from "colors" ;
import dotenv from "dotenv" ;
import morgan from "morgan" ;
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from 'cors';
import messageRoutes from "./routes/messageRoute.js" ;
import postRoutes from "./routes/postRoute.js";
import commentRoutes from "./routes/commentRoute.js";
import bodyParser from "body-parser";

//configure env
dotenv.config();

//database config 
connectDB() ;

//rest object
const app = express() ;

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//routes
app.use("/api/welcome/auth",authRoutes);
app.use("/api/welcome/message",messageRoutes);
app.use("/api/welcome/posts", postRoutes);
app.use("/api/welcome/comments" , commentRoutes);

//rst api
app.get('/',(req,res) => {
    res.send({
        message : 'Welcome'
    })
}
)
//PORT
const PORT = process.env.PORT || 8080 ;
const dev = process.env.DEV_MODE ;


//run listen 
app.listen(PORT,() => {
    console.log(`Server Running in ${dev} on ${PORT}`.bgCyan.white);
}

)