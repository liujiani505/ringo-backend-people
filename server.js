//////////////////////////////
// Depedencies
//////////////////////////////
// get .env variables
require("dotenv").config()
// pull PORT and DATABASE_URL from .env. give a default value of 3000
const {PORT = 3000, DATABASE_URL} = process.env
// import express
const express = require("express")
// create application object
const app = express()
// import mongoose
const mongoose = require("mongoose")
// import middleware
const cors = require("cors")
const morgan = require("morgan")

//////////////////////////////
// Database connection
//////////////////////////////
// Establish connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})

// Connection events
mongoose.connection
.on("open", ()=>{console.log("Connected to mongoose")})
.on("close", ()=>{console.log("Disconnected to mongoose")})
.on("error", (error)=>{console.log(error)})


//////////////////////////////
// Models
//////////////////////////////
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
})
const People = mongoose.model("People", PeopleSchema)


//////////////////////////////
// Middleware
//////////////////////////////
app.use(cors()) // to prevent cors errors, open access to all origins
app.use(morgan("dev")) // logging
app.use(express.json()) // parse json bodies


//////////////////////////////
// Routes
//////////////////////////////
app.get("/", (req, res) =>{
    res.send("hello world")
})

// Index Route - get request to /people
// get us all the peoples
app.get("/people", async (req, res) => {
    try {
        // send all the peoples
        res.json(await People.find({}))
    } catch (error) {
        // send error
        res.status(400).json({error})
    }
})

// Create route
app.post("/people", async(req, res) =>{
    try{
        res.json(await People.create(req.body))
    } catch (error) {
        res.status(400).json({error})
    }
})

// Update route
// update a specified person
app.put("/people/:id", async(req, res)=>{
    try{
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    }catch(error){
        res.status(400).json(error)
    }
})


// Destroy route
// delete a specific people
app.delete("/people/:id",  async(req, res)=>{
    try{
        res.json(await People.findByIdAndRemove(req.params.id))
    }catch (error){
        res.status(400).json({error})
    }
})


//////////////////////////////
// Listener
//////////////////////////////
app.listen(PORT, () => {console.log(`Listening on PORT ${PORT}`)})




