import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const connectDB = async ()=>{
    await mongoose.connect(process.env.MONGODB_URI)
    .then(res=>console.log("mongoose connected in ",res.connection.host))
    .catch(err=>console.error(err))
}

export default connectDB