import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', timeout: 2500 });
const KEY = 'clothconnect_demo_donations_v1';
const starter = [
 { _id:'demo-1', donorName:'Ananya Rao', itemName:'Winter jackets', category:'Winter Wear', quantity:12, condition:'Like New', city:'Hyderabad', status:'Approved', createdAt:new Date().toISOString(), description:'Clean jackets, ready for distribution.' },
 { _id:'demo-2', donorName:'Rahul K', itemName:'Kids clothing bundle', category:'Kids Wear', quantity:24, condition:'Good', city:'Secunderabad', status:'Submitted', createdAt:new Date().toISOString(), description:'Mixed sizes for children ages 4–10.' },
 { _id:'demo-3', donorName:'Meera S', itemName:'Everyday shirts', category:'Men’s Wear', quantity:8, condition:'Good', city:'Hyderabad', status:'Collected', createdAt:new Date().toISOString(), description:'Freshly washed cotton shirts.' }
];
let demoMode = false;
function readDemo(){ try { const x=localStorage.getItem(KEY); if(x) return JSON.parse(x); localStorage.setItem(KEY,JSON.stringify(starter)); return starter; } catch { return starter; } }
function writeDemo(items){ try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} }
export function isDemoMode(){ return demoMode; }
export async function listDonations(filters={}) {
 try { const {data}=await api.get('/donations',{params:filters}); demoMode=false; return data.data || data; }
 catch { demoMode=true; const q=(filters.search||'').toLowerCase(); return readDemo().filter(d=>(!filters.category||d.category===filters.category)&&(!filters.status||d.status===filters.status)&&(!q||`${d.itemName} ${d.city} ${d.category}`.toLowerCase().includes(q))); }
}
export async function createDonation(payload) {
 if(!demoMode){ try { const {data}=await api.post('/donations',payload); return data.data || data; } catch { demoMode=true; } }
 const items=readDemo(); const item={...payload,_id:`local-${Date.now()}`,donationId:`CC-${Math.random().toString(36).slice(2,8).toUpperCase()}`,status:'Submitted',createdAt:new Date().toISOString()}; writeDemo([item,...items]); return item;
}
export async function updateDonation(id,payload) {
 if(!String(id).startsWith('local-')&&!String(id).startsWith('demo-')) { try { const {data}=await api.put(`/donations/${id}`,payload); return data.data || data; } catch { demoMode=true; } }
 const items=readDemo().map(d=>d._id===id?{...d,...payload}:d); writeDemo(items); return items.find(d=>d._id===id);
}
export async function deleteDonation(id) {
 if(!String(id).startsWith('local-')&&!String(id).startsWith('demo-')) { try { await api.delete(`/donations/${id}`); return true; } catch { demoMode=true; } }
 writeDemo(readDemo().filter(d=>d._id!==id)); return true;
}