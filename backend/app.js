import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import connectDB from "./config/connectDatabase.js"

import authRouter from "./routes/authRoute.js"

const allowedOrigins = ["http://localhost:5173"]

const app = express()
connectDB()

dotenv.config()
app.use(express.json())
app.use(cookieParser())
app.use(cors())


//routers
app.use("/api/auth",authRouter)

app.listen(process.env.PORT,()=>{
    console.log(`server listening from ${process.env.PORT} in ${process.env.NODE_ENV}`)
})
