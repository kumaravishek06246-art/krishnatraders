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
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Tailwind CDN Injection */}
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />

      {/* Top Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex justify-between items-center sticky top-0 z-50">
        <span className="font-bold text-emerald-400 text-sm">📍 KRISHNA TRADERS</span>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentPage('store')} 
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currentPage === 'store' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-300'}`}
          >
            Customer View
          </button>
          <button 
            onClick={() => setCurrentPage('admin')} 
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currentPage === 'admin' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-300'}`}
          >
            Owner View
          </button>
        </div>
      </div>

      {currentPage === 'store' ? (
        <div>
          {/* Header Banner */}
          <div className="bg-slate-950 px-6 py-8 text-center border-b border-slate-800 mb-6">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-white">
              KRISHNA <span className="text-emerald-400">TRADERS</span>
            </h1>
            <p className="text-xs text-slate-400 italic mb-3">
              "Sahi Budget, Premium Quality – Aapke Ghar Ki Majboot Buniyaad!"
            </p>
            <div className="max-w-md mx-auto bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1 text-left">
              <p>📍 <b>Address:</b> Pabhera, near Dhanarua, Dist-Patna (Bihar), 804451</p>
              <p>📧 <b>Email:</b> kumaravishek06246@gmail.com</p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 pb-8">
            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((p) => (
                <div key={p.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow flex flex-col justify-between">
                  <div>
                    <img src={p.image} alt={p.name} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <span className="text-[10px] bg-slate-900 text-emerald-400 px-2 py-0.5 rounded font-bold">{p.category}</span>
                      <h3 className="font-bold text-sm text-white mt-2">{p.name}</h3>
                      <p className="text-emerald-400 font-extrabold text-xs mt-1">{p.price}</p>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <button
                      onClick={() => handleWhatsAppInquiry(p.name, p.price)}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow"
                    >
                      💬 Inquire on WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto px-4 py-8">
          {!firebaseUser ? (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
              <h2 className="text-base font-bold text-white mb-1 text-center">Owner Portal Login</h2>
              <p className="text-xs text-slate-400 text-center mb-6">Krishna Traders Admin</p>
              
              {!isForgotPassword ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                    <input 
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-emerald-500"
                      placeholder="Firebase Email"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                    <input 
                      type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-emerald-500"
                      placeholder="Firebase Password"
                    />
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-lg text-xs hover:bg-emerald-500 transition-colors">
                    Login
                  </button>
                  <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs text-emerald-400 hover:underline block text-center w-full">
                    Forgot Password?
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none"
                    placeholder="Registered Email"
                  />
                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-lg text-xs">
                    Send Password Reset Link
                  </button>
                  <button type="button" onClick={() => setIsForgotPassword(false)} className="text-xs text-slate-400 block text-center w-full">
                    ← Back to Login
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
                <span className="text-xs text-emerald-400 font-bold">Logged in: {firebaseUser.email}</span>
                <button onClick={() => signOut(auth)} className="bg-rose-600/30 text-rose-300 text-xs px-3 py-1 rounded-lg font-bold">Sign Out</button>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <h3 className="font-bold text-xs text-white mb-3">📦 Add New Product (Upload Photo)</h3>
                <form onSubmit={handleAddProduct} className="space-y-3">
                  <input type="text" placeholder="Product Name" required className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  <input type="text" placeholder="Price (e.g. ₹500)" required className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                  <select className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white outline-none" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e, true)} className="w-full text-xs text-slate-400" />
                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2 rounded text-xs">Publish Product</button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
