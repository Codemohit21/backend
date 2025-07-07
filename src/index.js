// require('dotenv').config({path:'./env'})
import dotenv from 'dotenv';
import connectdb from './db/index.js';
import mongoose from 'mongoose';
import { DB_NAME } from './constant.js';

dotenv.config({
    path:'./env'
});








connectdb();




















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