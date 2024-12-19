import express from "express"
import { getUserData, isAuthenticated, login, logout, register, resetPassword, resetPasswordOtp, verifyEmail, verifyEmailOtp } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.post("/logout",logout)

router.get("/is-auth",authMiddleware,isAuthenticated)

router.post("/email-verify-otp",authMiddleware,verifyEmailOtp)
router.post("/email-verify",authMiddleware,verifyEmail)
router.post("/password-reset-otp",resetPasswordOtp)
router.post("/password-reset",resetPassword)

router.get("/data",authMiddleware,getUserData)

export default router;