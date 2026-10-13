import jwt from 'jsonwebtoken';
export function authenticate(req,res,next){
 const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
 if(!token)return res.status(401).json({success:false,message:'Authentication required'});
 try{req.user=jwt.verify(token,process.env.JWT_SECRET);next();}catch{return res.status(401).json({success:false,message:'Invalid or expired token'});}
}
export function allowRoles(...roles){return (req,res,next)=>{if(!req.user||!roles.includes(req.user.role))return res.status(403).json({success:false,message:'You do not have permission to perform this action'});next();};}
