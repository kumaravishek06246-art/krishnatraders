import React, { useState, useEffect } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";

// Direct Firebase Config inside App.tsx (No import issue)
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
  
  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Track Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  const [categories, setCategories] = useState(['Cement', 'Concrete & Sand', 'Sariya & Iron', 'Hardware', 'Plumbing']);
  const [newCategory, setNewCategory] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('919999999999');

  const [products, setProducts] = useState([
    { id: 1, name: 'UltraTech Cement (50kg)', price: '₹400', category: 'Cement', image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400' },
    { id: 2, name: 'TATA Tiscon 550SD Sariya (12mm)', price: '₹75/kg', category: 'Sariya & Iron', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400' },
    { id: 3, name: 'River Sand (Per Tractor)', price: 'Ask for Price', category: 'Concrete & Sand', image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=400' },
    { id: 4, name: 'Ashirvad CPVC Pipe (1 inch)', price: '₹350', category: 'Plumbing', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400' },
  ]);

  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Cement', image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400' });
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleWhatsAppInquiry = (productName: string, price: string) => {
    const msg = `Hello Krishna Traders! I am interested in ${productName} (${price}). Please share details.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Firebase Login Handler
  const handleFirebaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Safalta-poorvak Login ho gaya!");
    } catch (err: unknown) {
      const error = err as Error;
      alert("Login Fail ho gaya! Kripya wohi Email aur Password daalein jo aapne Firebase Console me banaya tha.\nDetails: " + error.message);
    }
  };

  // Firebase Forgot Password Handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Kripya apna registered Email daalein!");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      alert(`Password reset link ${email} par bhej diya gaya hai. Gmail Inbox check karein!`);
    } catch (err: unknown) {
      const error = err as Error;
      alert("Error: " + error.message);
    }
  };

  // Firebase Logout Handler
  const handleLogout = () => {
    signOut(auth);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
      alert('Category jod di gayi hai!');
    }
  };

  // Gallery se photo uthane ke liye handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean, productId: number | null = null) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (isNew) {
          setNewProduct({ ...newProduct, image: result });
        } else if (productId !== null) {
          setProducts(products.map(p => p.id === productId ? { ...p, image: result } : p));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
      const newItem = {
        id: Date.now(),
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category,
        image: newProduct.image
      };
      setProducts([...products, newItem]);
      setNewProduct({ name: '', price: '', category: categories[0], image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400' });
      alert(`Product "${newItem.name}" safalta-poorvak jud gaya hai!`);
    }
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Kya aap sach mein is product ko hatana chahte hain?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex justify-between items-center sticky top-0 z-50">
        <span className="font-bold text-emerald-400 text-xs md:text-sm">📍 Krishna Traders</span>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentPage('store')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentPage === 'store' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300'}`}
          >
            Customer View
          </button>
          <button 
            onClick={() => setCurrentPage('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentPage === 'admin' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300'}`}
          >
            Owner Panel
          </button>
        </div>
      </div>

      {currentPage === 'store' ? (
        <div>
          <div className="relative bg-gradient-to-b from-slate-950 to-slate-900 px-6 py-10 text-center border-b border-slate-800">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-white">
              KRISHNA <span className="text-emerald-400">TRADERS</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300 italic mb-4">
              "Sahi Budget, Premium Quality – Aapke Ghar Ki Majboot Buniyaad!"
            </p>
            <div className="max-w-md mx-auto bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1 text-left">
              <p>📍 <b>Address:</b> Pabhera, near Dhanarua, Dist-Patna (Bihar), 804451</p>
              <p>📧 <b>Email:</b> kumaravishek06246@gmail.com</p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">Building Materials & Hardware</h2>
              <span className="text-[11px] text-emerald-400 font-medium">💬 WhatsApp Inquiry</span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProducts.map((p) => (
                <div key={p.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-md flex flex-col">
                  <div className="h-32 bg-slate-900 relative">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-90" />
                    <span className="absolute top-2 left-2 bg-slate-950/80 text-[10px] text-emerald-400 px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-3.5 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-bold text-xs text-white mb-1">{p.name}</h3>
                      <p className="text-emerald-400 font-extrabold text-xs mb-3">{p.price}</p>
                    </div>
                    <button
                      onClick={() => handleWhatsAppInquiry(p.name, p.price)}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-md"
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
        <div className="max-w-xl mx-auto px-4 py-8">
          {!firebaseUser ? (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-1 text-center">Owner Portal Login</h2>
              <p className="text-xs text-slate-400 text-center mb-6">Krishna Traders Admin (Firebase Auth)</p>
              
              {!isForgotPassword ? (
                <form onSubmit={handleFirebaseLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Owner Email</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      placeholder="Enter Firebase Email"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-emerald-500"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-300">Password</label>
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="text-[11px] text-emerald-400 hover:underline font-medium"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <input 
                      type="password" 
                      required
                      value={password}
                      placeholder="Enter Firebase Password"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-emerald-500"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-lg text-xs hover:bg-emerald-500 transition-colors shadow-lg">
                    Login to Dashboard
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-xs text-slate-300 text-center">
                    Registered Email daalein. Password reset link aapke Gmail par bhej diya jayega.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Registered Email</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-emerald-500"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {resetSent && (
                    <p className="text-xs text-emerald-400 text-center font-bold">
                      ✅ Reset link sent! Check your email inbox.
                    </p>
                  )}
                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-lg text-xs hover:bg-emerald-500 transition-colors shadow-lg">
                    Send Password Reset Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="w-full text-xs text-slate-400 hover:text-white text-center font-semibold block pt-2"
                  >
                    ← Back to Login
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div>
                  <h2 className="font-bold text-white text-xs">Welcome, Owner</h2>
                  <p className="text-[10px] text-emerald-400">Logged in as {firebaseUser?.email || "Owner"}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-rose-600/20 text-rose-400 border border-rose-600/30 text-xs px-3 py-1.5 rounded-lg font-semibold"
                >
                  Sign Out
                </button>
              </div>

              {/* Edit WhatsApp Number Form */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <h3 className="font-bold text-xs text-white mb-3">📱 Edit WhatsApp Inquiry Number</h3>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Enter WhatsApp Number (e.g. 919999999999)"
                    value={whatsappNumber} 
                    onChange={e => setWhatsappNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Add New Product with Gallery Upload */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <h3 className="font-bold text-xs text-white mb-3">📦 Add New Product (Upload from Gallery)</h3>
                <form onSubmit={handleAddProduct} className="space-y-3">
                  <input 
                    type="text" placeholder="Product Name" required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white outline-none"
                    value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" placeholder="Price (e.g. ₹500)" required
                      className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white outline-none"
                      value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    />
                    <select 
                      className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white outline-none"
                      value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Select Photo from Gallery/Files (Only Owner):</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer"
                    />
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2 rounded text-xs">
                    Publish Product
                  </button>
                </form>
              </div>

              {/* Manage Products & Change Photos via Gallery */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <h3 className="font-bold text-xs text-white mb-3">🛠️ Manage Products (Delete & Change Photos)</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {products.map((p) => (
                    <div key={p.id} className="bg-slate-900 p-3 rounded-lg border border-slate-700 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <img src={p.image} alt="" className="w-10 h-10 object-cover rounded border border-slate-700" />
                          <div>
                            <p className="text-xs font-bold text-white">{p.name}</p>
                            <p className="text-[10px] text-emerald-400">{p.price} • {p.category}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="bg-rose-600/20 text-rose-400 border border-rose-600/30 text-[10px] px-2.5 py-1 rounded font-semibold whitespace-nowrap"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                      <div className="pt-1">
                        <label className="block text-[10px] text-slate-400 mb-1">Change photo from Gallery:</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, false, p.id)}
                          className="w-full text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600 cursor-pointer"
                 
