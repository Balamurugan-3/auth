import bcrypt from "bcryptjs"
import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken"
import transporter from "../config/nodemailer.js"

//register
export const register = async (req, res) => {
    const {name, email, password } = req.body
    // console.log("req",req.body)
    if (!name || !email || !password) {
        return res.json({ success: false, message: "input values are required!" })
    }

    try {
        const existUser = await userModel.findOne({ email })
        if (existUser) {
            return res.json({ success: false, message: "Email is already exist" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)


        const user = await new userModel({ name, email, password: hashedPassword })
        await user.save()

        //cookie 
        const token = await jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn: "10d" })
        res.cookie("authToken",token ,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge:10 * 24 *60*60*1000
        })

        //email
       
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Hello ${name} ✔  Welcome to MERN stack developer Community`,
            text: `<h2>thanks for joing the program . We will make a large community</h2>`,
        }

        await transporter.sendMail(mailOption)

        return res.status(201).json({ success: true, message: "User Created Successfully" })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

//login
export const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.json({ success: false, message: "input values are required!" })
    }
    try {

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User not Found" })
        }

        const isPasswordCompare = await bcrypt.compare(password, user.password)
        if (!isPasswordCompare) {
            return res.json({ success: false, message: "Password Invalid ! " })
        }

        //cookie 

        const token = await jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn: "10d" })
        res.cookie("authToken",token , {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge:10 * 24 *60*60*1000
        })

        return res.status(200).json({ success: true, message: "User Logged in Successfully" })


    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

//logout
export const logout = async (req, res) => {

    try {
        //cookie 
        res.clearCookie("authToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })

        return res.status(200).json({ success: true, message: "User Logged in Successfully" })


    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


//send email verify otp
export const verifyEmailOtp = async (req, res) => {
    const { userId } = req.body
       try {
        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: "User Not Found" })
        }

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Email is Already Verified !" })
        }

        //otp
        const otp = String(100000 + Math.floor(Math.random() * 900000))

        //store the otp in DB
        user.verifyEmailOtp = otp
        user.verifyEmailOtpExpireAt = Date.now() + 30 * 60 * 1000

        await user.save()

        //email

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: `Hello ${user.name} ✔ This is your Email Verify OTP `,
            text: `<h2>Your OTP is ${otp} Please Verify The Email</h2>`,
        }

        await transporter.sendMail(mailOption)


        return res.status(201).json({ success: true, message: "Email Verify OTP  Sended Successfully" })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

//verify Email
export const verifyEmail = async (req, res) => {

    const { userId, otp } = req.body
    if (!otp) {
        return res.json({ success: false, message: "OTP is Required" })
    }
    try {

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: "User Not Found" })
        }


        //check otp
        if (user.verifyEmailOtp === "" && user.verifyEmailOtp !== otp) {
            return res.json({ success: false, message: "Incorrect OTP !" })
        }

        if (user.verifyEmailOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP is Expired !" })
        }

        user.isAccountVerified = true
        user.verifyEmailOtp = ""
        user.verifyEmailOtpExpireAt = 0

        await user.save()

        return res.status(201).json({ success: true, message: "User Email Verified Successfully" })


    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


//reset password otp
export const resetPasswordOtp = async (req, res) => {

    const { email } = req.body
    try {

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User Not Found" })
        }

        //otp
        const otp = String(100000 + Math.floor(Math.random() * 900000))

        //store the otp in DB
        user.resetPasswordOtp = otp
        user.resetPasswordOtpExpireAt = Date.now() + 30 * 60 * 1000

        await user.save()

        //email
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: `Hello ${user.name} ✔ This is your Password Reset OTP </h2>`,
            text: `<h2>Your OTP is ${otp} to Reset Your Password</h2>`,
        }

        await transporter.sendMail(mailOption)


        return res.status(201).json({ success: true, message: "Password Reset OTP Sended Successfully" })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


//reset password verify  --------------------pending
export const resetPassword = async (req, res) => {

    const { userId, otp } = req.body
    if (!otp) {
        return res.json({ success: false, message: "OTP is Required" })
    }
    try {

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: "User Not Found" })
        }


        //check otp
        if (user.verifyEmailOtp === "" && user.verifyEmailOtp !== otp) {
            return res.json({ success: false, message: "Incorrect OTP !" })
        }

        if (user.verifyEmailOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP is Expired !" })
        }

        user.isAccountVerified = true
        user.verifyEmailOtp = ""
        user.verifyEmailOtpExpireAt = 0

        await user.save()

        return res.status(201).json({ success: true, message: "User Email Verified Successfully" })


    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


//is authenticated

export const isAuthenticated = async(req,res)=>{
    try {
        return res.status(200).json({success:true,message:"Valid User"})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}




//get getUserData

export const getUserData = async(req,res)=>{
    const {userId} = req.body
    try {
        const user = await userModel.findById(userId)
        return res.status(200).json({success:true,userData:{name:user.name,email:user.email,isAccountVerified:user.isAccountVerified}})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}


