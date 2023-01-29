const mongoose = require('mongoose')
const {Schema} = mongoose;

const UserSchema = new Schema({
    username:{
        type : String,
        required : true,
        unique : true
    },
    email:{
        type : String,
        requred : true,
        unique : true
    },
    password :{
        type : String,
        required:true
    },
    date:{
        type : Date,
        default : Date.now
    },
    followers : [
        {type: String, ref: "user", required: true}
    ],
    following : [
        {type : String , ref :"user",required : true}
    ]
})

const User = mongoose.model('user',UserSchema)
module.exports = User
