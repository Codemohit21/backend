// require('dotenv').config({path:'./env'})
import dotenv from 'dotenv';
import connectdb from './db/index.js';
import { app } from './app.js';
import mongoose from 'mongoose';
import { DB_NAME } from './constant.js';

dotenv.config({
    path:'./env'
});








connectdb()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERRR CONNECTING TO SERVER: ",error);
         throw error
        })
    app.listen(process.env.PORT || 8000,()=>{
       console.log(`server is running at port : ${process.env.PORT}`);

        
    })
})
.catch((err) => {
    console.log("MONGO DB CONNECTION FAILED", err);
});





















// import express from 'express';
// const app=express();


// (async ()=>{
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/{DB_NAME}`)
//        app.on("error",(error)=>{
//         console.log("ERRR: ",error);
//         throw error
//        })

//        app.listen(process.env.PORT,()=>{
//         console.log('app is running on port ${process.env.PORT}');
        
//        })

//     } catch (error) {
//         console.log("error",error)
//         throw error
//     }   
// })()