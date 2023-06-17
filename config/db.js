import mongoose from "mongoose" ;
import colors from "colors" ;
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected To MOngodb Database ${conn.connection.host}` .bgCyan.white);
    } catch (error){
        console.log(`error in Mongodb ${error}`.bgRed.white);

        }
    } ;

    export default connectDB ;
    
 
