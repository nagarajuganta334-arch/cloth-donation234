import {Router} from 'express';
import Donation from '../models/Donation.js';
const router=Router();
const asyncRoute=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
router.get('/',asyncRoute(async(req,res)=>{
 const {search,category,status}=req.query;const filter={};
 if(category)filter.category=category;if(status)filter.status=status;
 if(search){const regex=new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i');filter.$or=[{itemName:regex},{city:regex},{category:regex},{donorName:regex}];}
 const page=Math.max(1,Number.parseInt(req.query.page||'1',10));const limit=Math.min(100,Math.max(1,Number.parseInt(req.query.limit||'50',10)));
 const [data,total]=await Promise.all([Donation.find(filter).sort({createdAt:-1}).skip((page-1)*limit).limit(limit).lean(),Donation.countDocuments(filter)]);
 res.json({success:true,data,pagination:{page,limit,total}});
}));
router.post('/',asyncRoute(async(req,res)=>{const allowed=['donorName','phone','itemName','category','quantity','condition','city','description','pickupDate'];const payload=Object.fromEntries(allowed.filter(k=>req.body[k]!==undefined).map(k=>[k,req.body[k]]));const item=await Donation.create(payload);res.status(201).json({success:true,data:item});}));
router.get('/:id',asyncRoute(async(req,res)=>{const item=await Donation.findById(req.params.id);if(!item)return res.status(404).json({success:false,message:'Donation not found'});res.json({success:true,data:item});}));
router.put('/:id',asyncRoute(async(req,res)=>{const allowed=['donorName','phone','itemName','category','quantity','condition','city','description','pickupDate'];const payload=Object.fromEntries(allowed.filter(k=>req.body[k]!==undefined).map(k=>[k,req.body[k]]));const item=await Donation.findOneAndUpdate({_id:req.params.id,status:{$in:['Submitted','Under Review']}},payload,{new:true,runValidators:true});if(!item)return res.status(404).json({success:false,message:'Donation not found or no longer editable'});res.json({success:true,data:item});}));
router.delete('/:id',asyncRoute(async(req,res)=>{const item=await Donation.findOneAndDelete({_id:req.params.id,status:{$in:['Submitted','Under Review']}});if(!item)return res.status(404).json({success:false,message:'Donation not found or no longer cancellable'});res.json({success:true,message:'Donation deleted'});}));
export default router;
