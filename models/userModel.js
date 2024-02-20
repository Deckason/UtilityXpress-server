const mongoose = require("mongoose")
const Schema = mongoose.Schema
const validator = require("validator")
const bcrypt = require("bcrypt")

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
})

// Static signup Method
userSchema.statics.register = async function(username, email, phone, password, confirmPassword) {
    if (!username) {
        throw Error("Username is required!")
    }
    if (!email) {
        throw Error("Email is empty!")
    }
    if (!phone) {
        throw Error("Phone is required!")
    }
    if (!password) {
        throw Error("Password is required!")
    }
    if (confirmPassword !== password) {
        throw Error("Passwords do not match!")
    }
    if (!validator.isEmail(email)) {
        throw Error("Invalid email format!")
    }
    if (!validator.isStrongPassword(password)) {
        throw Error("Password is not strong enough!")
    }

    const emailExist = await this.findOne({email})
    if (emailExist) {
        throw Error("Email already exist!")
    }
    const phoneExist = await this.findOne({phone})
    if (phoneExist) {
        throw Error("Phone already exist!")
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    const user = await this.create({username, email, phone, password: hashPassword})

    return user
}

userSchema.statics.login = async function (email, password) {
    if (!email) {
        throw Error("Email is required!")
    }
    if (!password) {
        throw Error("Password is needed!")
    }

    const user = await this.findOne({email})
    if (!user) {
        throw Error("Wrong credentials!")
    }
    const verifyPassword = await bcrypt.compare(password, user.password)

    if (!verifyPassword) {
        throw Error("Wrong credentials!")
    }

    return user
}





module.exports = mongoose.model("Users", userSchema)