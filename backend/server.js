// const express = require('express');

const app = require('./app');

const dotenv = require('dotenv');

const connectDatabase = require('./config/database');
// Config Path

dotenv.config({path: "backend/config/config.env"});

// Connect to Db
connectDatabase();

app.listen(process.env.PORT, ()=>{
    console.log(">>>>>>>>>>> Server is Working >>>>>>>>>>>>")
})