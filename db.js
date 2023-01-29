const mongoose = require('mongoose')
const mongoURI = "mongodb://localhost:27017/data";
const connectToMongo = () =>{
    mongoose.connect(mongoURI,()=>{
        console.log("connect to mongo successfully")
    })
}

module.exports = connectToMongo