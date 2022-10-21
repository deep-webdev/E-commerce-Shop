const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI, {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true})
        .then(()=>{
            console.log("MongoDB is connected...")
        }).catch(()=>{
            console.log("Error......")
        })
}

module.exports = connectDatabase;
