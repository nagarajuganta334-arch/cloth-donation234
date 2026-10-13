import mongoose from 'mongoose';
const donationSchema=new mongoose.Schema({
 donationId:{type:String,unique:true,index:true},
 donorName:{type:String,required:true,trim:true,maxLength:100},
 phone:{type:String,trim:true,maxLength:25},
 itemName:{type:String,required:true,trim:true,maxLength:120},
 category:{type:String,required:true,enum:['Men’s Wear','Women’s Wear','Kids Wear','Winter Wear','Traditional Wear','Footwear','Other']},
 quantity:{type:Number,required:true,min:1,validate:{validator:Number.isInteger,message:'Quantity must be a whole number'}},
 condition:{type:String,required:true,enum:['New','Like New','Good','Fair']},
 city:{type:String,required:true,trim:true,maxLength:100},
 description:{type:String,trim:true,maxLength:1000,default:''},
 pickupDate:{type:Date},
 status:{type:String,enum:['Submitted','Under Review','Approved','Collected','Distributed','Completed','Rejected','Cancelled'],default:'Submitted'}
},{timestamps:true});
donationSchema.pre('validate',function(next){if(!this.donationId)this.donationId=`CC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;next();});
export default mongoose.model('Donation',donationSchema);
