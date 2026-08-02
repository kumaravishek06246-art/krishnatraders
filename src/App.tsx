// @ts-nocheck
import React, { useState, useEffect } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBDz6iDnpD0c_K-ike1f0t6aS6KezBaYKs",
  authDomain: "krishna-traders-a8849.firebaseapp.com",
  projectId: "krishna-traders-a8849",
  storageBucket: "krishna-traders-a8849.firebasestorage.app",
  messagingSenderId: "115202514278",
  appId: "1:115202514278:web:33e39bba7cca132b8e3ca7"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export default function App() {
  const [currentPage, setCurrentPage] = useState("store");
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('919999999999');
  const [categories, setCategories] = useState(['Cement', 'Sariya & Iron', 'Plumbing', 'Hardware']);
  const [activeCategory, setActiveCategory] = useState('All');

  const [products, setProducts] = useState([
    { id: 1, name: 'UltraTech Cement (50kg)', price: '₹400', category: 'Cement', image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400' },
    { id: 2, name: 'TATA Tiscon 550SD Sariya (12mm)', price: '₹75/kg', category: 'Sariya & Iron', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400' }
  ]);

  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Cement', image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400' });

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => setFirebaseUser(user));
  }, []);

  const handleWhatsAppInquiry = (pName, pPrice) => {
    const msg = `Hello Krishna Traders! I am interested in ${pName} (${pPrice}).`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Successful!");
    } catch (err) {
      alert("Login Error: " + err.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) return alert("Registered Email daalein!");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link aapke Email par bhej diya gaya hai!");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleImageUpload = (e, isNew, pId = null) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isNew) setNewProduct({ ...newProduct, image: reader.result });
        else setProducts(products.map(p => p.id === pId ? { ...p, image: reader.result } : p));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
      setProducts([...products, { ...newProduct, id: Date.now() }]);
      setNewProduct({ name: '', price: '', category: categories[0], image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400' });
      alert("Product jud gaya hai!");
    }
  };

  const filteredProducts = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-4">
      <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg mb-6 border border-slate-800 max-w-4xl mx-auto">
        <h1 className="font-bold text-emerald-400 text-sm">📍 KRISHNA TRADERS</h1>
        <div className="flex gap-2">
          <button onClick={() => setCurrentPage('store')} className={`px-3 py-1 rounded text-xs font-bold ${currentPage === 'store' ? 'bg-emerald-600' : 'bg-slate-800'}`}>Customer View</button>
          <button onClick={() => setCurrentPage('admin')} className={`px-3 py-1 rounded text-xs font-bold ${currentPage === 'admin' ? 'bg-emerald-600' : 'bg-slate-800'}`}>Owner View</button>
        </div>
      </div>

      {currentPage === 'store' ? (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h2 className="text-xl font-bold text-emerald-400">KRISHNA TRADERS</h2>
            <p className="text-xs text-slate-300 mt-1">📍 Pabhera, near Dhanarua, Dist-Patna (Bihar), 804451</p>
            <p className="text-xs text-slate-400">📧 kumaravishek06246@gmail.com</p>
          </div>
          <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
            {['All', ...categories].map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${activeCategory === cat ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-300'}`}>{cat}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map(p => (
              <div key={p.id} className="bg-slate-800 rounded-lg p-3 border border-slate-700 flex flex-col justify-between">
                <img src={p.image} alt={p.name} className="w-full h-36 object-cover rounded mb-2" />
                <div>
                  <h3 className="font-bold text-xs text-white">{p.name}</h3>
                  <p className="text-emerald-400 text-xs font-bold mb-3">{p.price}</p>
                </div>
                <button onClick={() => handleWhatsAppInquiry(p.name, p.price)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-xs py-2 rounded font-bold transition-colors">💬 WhatsApp Inquiry</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-slate-800 p-6 rounded-xl border border-slate-700">
          {!firebaseUser ? (
            <div>
              <h2 className="text-sm font-bold mb-4 text-center text-white">Owner Portal Login</h2>
              {!isForgotPassword ? (
                <form onSubmit={handleLogin} className="space-y-3">
                  <input type="email" placeholder="Firebase Email" required className="w-full p-2 bg-slate-900 text-xs rounded border border-slate-700 text-white" value={email} onChange={e => setEmail(e.target.value)} />
                  <input type="password" placeholder="Firebase Password" required className="w-full p-2 bg-slate-900 text-xs rounded border border-slate-700 text-white" value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="submit" className="w-full bg-emerald-600 text-xs py-2 rounded font-bold text-white">Login</button>
                  <button type="button" onClick={() => setIsForgotPassword(true)} className="text-[11px] text-emerald-400 block mx-auto pt-1">Forgot Password?</button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-3">
                  <input type="email" placeholder="Registered Email" required className="w-full p-2 bg-slate-900 text-xs rounded border border-slate-700 text-white" value={email} onChange={e => setEmail(e.target.value)} />
                  <button type="submit" className="w-full bg-emerald-600 text-xs py-2 rounded font-bold text-white">Send Password Reset Link</button>
                  <button type="button" onClick={() => setIsForgotPassword(false)} className="text-[11px] text-slate-400 block mx-auto pt-1">Back to Login</button>
                </form>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-700">
                <span className="text-[11px] text-emerald-400">Logged in: {firebaseUser.email}</span>
                <button onClick={() => signOut(auth)} className="bg-rose-600/30 text-rose-300 text-xs px-2 py-1 rounded font-bold">Logout</button>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white">Add Product (Upload Photo)</h3>
                <form onSubmit={handleAddProduct} className="space-y-2">
                  <input type="text" placeholder="Product Name" required className="w-full p-2 bg-slate-900 text-xs rounded border border-slate-700 text-white" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  <input type="text" placeholder="Price (e.g. ₹500)" required className="w-full p-2 bg-slate-900 text-xs rounded border border-slate-700 text-white" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                  <select className="w-full p-2 bg-slate-900 text-xs rounded border border-slate-700 text-white" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e, true)} className="text-xs text-slate-400" />
                  <button type="submit" className="w-full bg-emerald-600 text-xs py-2 rounded font-bold text-white">Publish Product</button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
                  }
