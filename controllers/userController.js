const User = require("../models/userModel")
const jwt = require("jsonwebtoken")

const createToken = (id)=>{
    return jwt.sign({id}, process.env.SECRETE, {expiresIn: "3d"})
}

const loginUser = async (req, res)=>{
    const {email, password} = req.body
    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }

}

const registerUser = async (req, res)=>{
    const {username, email, phone, password, confirmPassword} = req.body
    try {
        const user = await User.register(username, email, phone, password, confirmPassword)
        const token = createToken(user._id)
        res.status(200).json({username, email, phone, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {loginUser, registerUser}