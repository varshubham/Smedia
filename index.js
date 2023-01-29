const connectToMongo = require('./db')
const express = require('express');

connectToMongo();
const app = express()
const port = 5000;
app.use(express.json())

app.use('/users',require('./routes/auth'))

app.listen(port,()=>{
    console.log(`app is listening at http://localhost:${port}`)
})