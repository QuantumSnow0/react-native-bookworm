import express from "express"
import User from "../models/User.js"
import jwt from "jsonwebtoken"
const router = express.Router()
const generateToken = async (userId) => {
return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "15d"})
}
router.post("/register", async(req, res) => {
    try {
        const {username, email, password } = req.body
         if(!username || !email || !password ){
            return res.status(400).send({message : "All fields are required"})
         }
         if(password.length < 6){
            return res.status(400).send({message : "Password must be at least 6 characters"})
         }
         if(username.length < 3){
            return res.status(400).send({message : "Username must be at least 3 characters"})
         }
         //check if user already exists
    
        const existingEmail = await User.findOne({email})
        if(existingEmail){
            return res.status(400).json({message: "Email already exists"})
        }
        const existingUsername = await User.findOne({username})
        if(existingUsername){
            return res.status(400).json({message: "Username already exists"})
        }
        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        const user = new User({
            username,
            email,
            password,
            profileImage
        })
        await user.save()
        // get token 
        const token = await generateToken(user._id)
        res.status(201).json(
            {
            token, 
            user: {
            username: user.username,
            id: user._id.name,
            email: user.email,
            profileImage: user.profileImage
            }
        })

    } catch (error) {
        console.log("error in register route:", error);
        res.status(500).json({message: "internal server error"})
    }
})
router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body
        if(!email || !password){
            return res.status(400).send({ message : "All fields are required"})
        }
        //check if user exists
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message: "user not found"})
    
        // check if passowrd is correct
        const isPassword = await user.comparePassword(password)
        if(!isPassword) return res.status(400).json({message: "invalid credentials"})
        const token = await generateToken(user._id);
        res.status(200).json(
            {
                token,
                user: {
                    username: user.username,
                    email: user.password,
                    profileImage: user.profileImage
                }
            }
        )
        
    } catch (error) {
        console.log("Error in login route",error)
        res.status(500).json({message: "internal server error"})
    }
})
export default router;