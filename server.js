const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const bodyParser = require("body-parser")
const cors = require("cors")
const userRoute = require("./routes/user")

const app = express()

// Middlewares
// app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/auth", userRoute)

// Connect to DB
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    // Listen for requests
    app.listen(process.env.PORT_NUMBER, ()=>{
        console.log('server Connected to', process.env.PORT_NUMBER)
        app.get("/", (req, res)=>{
            res.json({message: `Server connected on ${process.env.PORT_NUMBER}`})
        })
    })
}).catch(err=>{
    console.log(err)
})
