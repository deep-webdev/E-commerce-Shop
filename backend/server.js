const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

// Handling Uncaught Exception Like (console.log(deep) --- where deep is not defined)
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);

    process.exit(1);
})

// Config Path
dotenv.config({path: "backend/config/config.env"});

// Connect to Db
connectDatabase();

const server = app.listen(process.env.PORT, ()=>{
    console.log(">>>>>>>>>>> Server is Working >>>>>>>>>>>>")
});


// Unhandled Promises Rejection (If some change occured in config.env file)
process.on("unhandledRejection", err=>{
    console.log(`Error: ${err.messsage}`);
    console.log(`Shutting down the server due to Unhandled Promises Rejection.`);

    server.close(()=>{
        process.exit(1);
    });
});

