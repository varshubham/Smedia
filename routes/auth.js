const express = require('express')
const User = require('../models/User')
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const SECRET_KEY = "thisisasecretkey"
const fetchuser = require("../middleware/fetchuser")

router.post('/',async(req,res)=>{
    try {
        let success = false;
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            success=false;
            return res.status(400).json({ error: "sorry user with this email already exist" })
        }
        let usern = await User.findOne({ username: req.body.username })
        if (usern) {
            success=false;
            return res.status(400).json({ error: "sorry user with this username already exist" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: secPass
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, SECRET_KEY);

        
        success=true;
        res.json({success, authtoken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured")
    }
})
router.get('/:user',async(req,res)=>{
    try {
        const username = req.params.user;
        const user = await User.find({username:username}).select("-password")
        res.send(user)
    } catch (error) {
        res.status(500).send("Internal server error")
    }
})
router.get('/:user/followers',async(req,res)=>{
    try {
        const username = req.params.user;
        const user = await User.find({username:username}).select("followers")
        res.send(user)
    } catch (error) {
        res.status(500).send("Internal server error")
    }
})
router.get('/:user/following',async(req,res)=>{
    try {
        const username = req.params.user;
        const user = await User.find({username:username}).select("following")
        res.send(user)
    } catch (error) {
        res.status(500).send("Internal server error")
    }
})
router.post('/:user/follow',fetchuser,async(req,res)=>{
    try {
        const username = req.params.user;
        const user = await User.find({username:username});
        const myuser = await User.findById(req.user.id).select("-password")
        if(user)
        {
            
            const newfollowers = user[0].followers;
            newfollowers.push(myuser.username)
            newuser = await User.findOneAndUpdate({username:username},{followers:newfollowers},{new:true})

            const newfollowing = myuser.following;
            newfollowing.push(username);
            newmyuser = await User.findOneAndUpdate({username:myuser.username},{following:newfollowing},{new:true})
            res.json({newuser,newmyuser})
        }
        else{
            res.status(404).send("user not found");
        }
    } catch (error) {
        res.status(500).send("Internal server error")   
    }
})
router.delete('/:user/follow',fetchuser,async(req,res)=>{
    try {
        const username = req.params.user;
        const user = await User.find({username:username});
        const myuser = await User.findById(req.user.id).select("-password");
        if(user)
        {
            const newfollowers = user[0].followers;
            const index = newfollowers.indexOf(myuser.username);
            newfollowers.splice(index,1);
            newuser = await User.findOneAndUpdate({username:username},{followers:newfollowers},{new:true})

            const newfollowing = myuser.following;
            const myindex = newfollowing.indexOf(username);
            newfollowing.splice(myindex,1);
            newmyuser = await User.findOneAndUpdate({username:myuser.username},{following:newfollowing},{new:true})
            res.json({newuser,newmyuser})
        }
        else{
            res.status(404).send("user not found")
        }
    } catch (error) {
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router