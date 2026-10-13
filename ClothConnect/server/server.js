import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import donationRoutes from './routes/donations.js';

const app=express();
app.use(helmet());
app.use(cors({origin:process.env.CLIENT_ORIGIN||'http://localhost:5173'}));
app.use(express.json({limit:'1mb'}));
app.use('/api',rateLimit({windowMs:15*60*1000,limit:300,standardHeaders:true,legacyHeaders:false}));
app.get('/api/health',(req,res)=>res.json({success:true,message:'ClothConnect API is running',database:mongoose.connection.readyState===1?'connected':'disconnected'}));
app.use('/api/donations',donationRoutes);
app.use((req,res)=>res.status(404).json({success:false,message:'Route not found'}));
app.use((err,req,res,next)=>{console.error(err);res.status(err.status||500).json({success:false,message:err.message||'Internal server error'});});
const port=process.env.PORT||5000;
try { if(!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing. Copy .env.example to .env and configure MongoDB.'); await mongoose.connect(process.env.MONGODB_URI); console.log('Connected to MongoDB'); app.listen(port,()=>console.log(`ClothConnect API listening on http://localhost:${port}`)); }
catch(err){console.error('Server startup failed:',err.message);process.exit(1);}
