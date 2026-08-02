// @ts-nocheck
import React, { useState, useEffect } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword
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
  const [newPassword, setNewPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  // Dynamic Settings
  const [whatsappNumber, setWhatsappNumber] = useState('919999999999');
  const [newWhatsappInput, setNewWhatsappInput] = useState('');
  const [categories, setCategories] = useState(['Cement', 'Sariya & Iron', 'Plumbing', 'Hardware']);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Products List
  const [products, setProducts] = useState([
    { id: 1, name: 'UltraTech Cement (50kg)', price: '₹400', category: 'Cement', image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400' },
    { id: 2, name: 'TATA Tiscon 550SD Sariya (12mm)', price: '₹75/kg', category: 'Sariya & Iron', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400' }
  ]);

  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Cement', image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400' });
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => setFirebaseUser(user));
  }, []);

  // Handlers
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
    if (!email) return alert("Email daalein!");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link aapke Email par bhej diya gaya hai!");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return alert("Naya Password daalein!");
    try {
      await updatePassword(auth.currentUser, newPassword);
      alert("Password kamyabi se badal gaya hai!");
      setNewPassword('');
    } catch (err) {
      alert("Password update error: " + err.message);
    }
  };

  const handleUpdateWhatsApp = (e) => {
    e.preventDefault();
    if (newWhatsappInput.trim()) {
      setWhatsappNumber(newWhatsappInput.trim());
      alert(`WhatsApp Number update ho gaya: ${newWhatsappInput}`);
      setNewWhatsappInput('');
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategoryInput.trim() && !categories.includes(newCategoryInput.trim())) {
      setCategories([...categories, newCategoryInput.trim()]);
      alert(`Nayi Category "${newCategoryInput}" add ho gayi!`);
      setNewCategoryInput('');
    }
  };

  const handleImageUpload = (e, isNew, pId = null) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isNew) {
          setNewProduct({ ...newProduct, image: reader.result });
        } else {
          setProducts(products.map(p => p.id === pId ? { ...p, image: reader.result } : p));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
      setProducts([...products, { ...newProduct, id: Date.now() }]);
      setNewProduct({ name: '', price: '', category: categories[0] || 'General', image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400' });
      alert("Naya Product add ho gaya hai!");
    }
  };

  const handleUpdateProduct = (pId, updatedName, updatedPrice, updatedCategory) => {
    setProducts(products.map(p => p.id === pId ? { ...p, name: updatedName, price: updatedPrice, category: updatedCategory } : p));
    setEditingProductId(null);
    alert("Product update ho gaya!");
  };

  const handleDeleteProduct = (pId) => {
    if (window.confirm("Kya aap is product ko hatana chahte hain?")) {
      setProducts(products.filter(p => p.id !== pId));
    }
  };

  const filteredProducts = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);

  const containerStyle = {
    backgroundColor: "#0f172a",
    color: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    paddingBottom: "40px"
  };

  return (
    <div style={containerStyle}>
      {/* Top Bar */}
      <div style={{ backgroundColor: "#020617", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", sticky: "top", zIndex: 50 }}>
        <span style={{ color: "#34d399", fontWeight: "bold", fontSize: "14px" }}>📍 KRISHNA TRADERS</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button 
            onClick={() => setCurrentPage('store')} 
            style={{ backgroundColor: currentPage === 'store' ? '#059669' : '#1e293b', color: '#ffffff', padding: "6px 12px", borderRadius: "8px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
          >
            Customer View
          </button>
          <button 
            onClick={() => setCurrentPage('admin')} 
            style={{ backgroundColor: currentPage === 'admin' ? '#059669' : '#1e293b', color: '#ffffff', padding: "6px 12px", borderRadius: "8px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
          >
            Owner View
          </button>
        </div>
      </div>

      {currentPage === 'store' ? (
        <div>
          {/* Header */}
          <div style={{ backgroundColor: "#020617", padding: "24px 16px", textAlign: "center", borderBottom: "1px solid #1e293b", marginBottom: "20px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#ffffff", margin: "0 0 8px 0" }}>
              KRISHNA <span style={{ color: "#34d399" }}>TRADERS</span>
            </h1>
            <p style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic", margin: "0 0 12px 0" }}>
              "Sahi Budget, Premium Quality – Aapke Ghar Ki Majboot Buniyaad!"
            </p>
            <div style={{ maxWidth: "400px", margin: "0 auto", backgroundColor: "#1e293b", padding: "12px", borderRadius: "10px", border: "1px solid #334155", textAlign: "left", fontSize: "11px", color: "#cbd5e1" }}>
              <p style={{ margin: "2px 0" }}>📍 <b>Address:</b> Pabhera, near Dhanarua, Dist-Patna (Bihar), 804451</p>
              <p style={{ margin: "2px 0" }}>📧 <b>Email:</b> kumaravishek06246@gmail.com</p>
              <p style={{ margin: "2px 0" }}>📱 <b>WhatsApp:</b> +{whatsappNumber}</p>
            </div>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 16px" }}>
            {/* Category Filter */}
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "20px" }}>
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    backgroundColor: activeCategory === cat ? '#10b981' : '#1e293b',
                    color: activeCategory === cat ? '#020617' : '#cbd5e1',
                    padding: "6px 14px",
                    borderRadius: "20px",
                    border: "1px solid #334155",
                    fontSize: "12px",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    cursor: "pointer"
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              {filteredProducts.map((p) => (
                <div key={p.id} style={{ backgroundColor: "#1e293b", borderRadius: "12px", overflow: "hidden", border: "1px solid #334155", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <img src={p.image} alt={p.name} style={{ width: "100%", height: "140px", objectFit: "cover" }} />
                    <div style={{ padding: "12px" }}>
                      <span style={{ fontSize: "10px", backgroundColor: "#020617", color: "#34d399", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>{p.category}</span>
                      <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#ffffff", marginTop: "8px", marginBottom: "4px" }}>{p.name}</h3>
                      <p style={{ color: "#34d399", fontWeight: "800", fontSize: "14px" }}>{p.price}</p>
                    </div>
                  </div>
                  <div style={{ padding: "12px", paddingTop: "0" }}>
                    <button
                      onClick={() => handleWhatsAppInquiry(p.name, p.price)}
                      style={{ width: "100%", backgroundColor: "#059669", color: "#ffffff", border: "none", fontSize: "12px", fontWeight: "bold", padding: "10px", borderRadius: "8px", cursor: "pointer" }}
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
        /* OWNER PANEL */
        <div style={{ maxWidth: "500px", margin: "20px auto", padding: "0 16px" }}>
          {!firebaseUser ? (
            <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "16px", padding: "20px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#ffffff", textAlign: "center", marginBottom: "4px" }}>Owner Portal Login</h2>
              <p style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center", marginBottom: "16px" }}>Krishna Traders Admin</p>
              
              {!isForgotPassword ? (
                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "bold", color: "#cbd5e1", display: "block", marginBottom: "4px" }}>Email</label>
                    <input 
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "#020617", border: "1px solid #334155", color: "#ffffff", fontSize: "12px", boxSizing: "border-box" }}
                      placeholder="Firebase Email"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "bold", color: "#cbd5e1", display: "block", marginBottom: "4px" }}>Password</label>
                    <input 
                      type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "#020617", border: "1px solid #334155", color: "#ffffff", fontSize: "12px", boxSizing: "border-box" }}
                      placeholder="Firebase Password"
                    />
                  </div>
                  <button type="submit" style={{ width: "100%", backgroundColor: "#059669", color: "#ffffff", fontWeight: "bold", padding: "10px", borderRadius: "6px", border: "none", fontSize: "12px", cursor: "pointer" }}>
                    Login
                  </button>
                  <button type="button" onClick={() => setIsForgotPassword(true)} style={{ background: "none", border: "none", color: "#34d399", fontSize: "11px", cursor: "pointer" }}>
                    Forgot Password?
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", backgroundColor: "#020617", border: "1px solid #334155", color: "#ffffff", fontSize: "12px", boxSizing: "border-box" }}
                    placeholder="Registered Email"
                  />
                  <button type="submit" style={{ width: "100%", backgroundColor: "#059669", color: "#ffffff", fontWeight: "bold", padding: "10px", borderRadius: "6px", border: "none", fontSize: "12px", cursor: "pointer" }}>
                    Send Password Reset Link
                  </button>
                  <button type="button" onClick={() => setIsForgotPassword(false)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "11px", cursor: "pointer" }}>
                    ← Back to Login
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* User Info Bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1e293b", padding: "12px 16px", borderRadius: "10px", border: "1px solid #334155" }}>
                <span style={{ fontSize: "11px", color: "#34d399", fontWeight: "bold" }}>👤 {firebaseUser.email}</span>
                <button onClick={() => signOut(auth)} style={{ backgroundColor: "#991b1b", color: "#ffffff", fontSize: "11px", padding: "6px 10px", borderRadius: "6px", border: "none", fontWeight: "bold", cursor: "pointer" }}>Sign Out</button>
              </div>

              {/* 1. Update WhatsApp Number */}
              <div style={{ backgroundColor: "#1e293b", padding: "16px", borderRadius: "12px", border: "1px solid #334155" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff", marginBottom: "8px" }}>📱 WhatsApp Number Setting</h3>
                <p style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "8px" }}>Current: +{whatsappNumber}</p>
                <form onSubmit={handleUpdateWhatsApp} style={{ display: "flex", gap: "8px" }}>
                  <input type="text" placeholder="e.g. 919876543210" value={newWhatsappInput} onChange={e => setNewWhatsappInput(e.target.value)} style={{ flex: 1, padding: "8px", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "6px", color: "#fff", fontSize: "12px" }} />
                  <button type="submit" style={{ backgroundColor: "#059669", color: "#fff", padding: "8px 12px", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>Save</button>
                </form>
              </div>

              {/* 2. Add New Category */}
              <div style={{ backgroundColor: "#1e293b", padding: "16px", borderRadius: "12px", border: "1px solid #334155" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff", marginBottom: "8px" }}>🏷️ Create New Category</h3>
                <form onSubmit={handleAddCategory} style={{ display: "flex", gap: "8px" }}>
                  <input type="text" placeholder="New Category Name" value={newCategoryInput} onChange={e => setNewCategoryInput(e.target.value)} style={{ flex: 1, padding: "8px", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "6px", color: "#fff", fontSize: "12px" }} />
                  <button type="submit" style={{ backgroundColor: "#059669", color: "#fff", padding: "8px 12px", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>Add</button>
                </form>
              </div>

              {/* 3. Add New Product */}
              <div style={{ backgroundColor: "#1e293b", padding: "16px", borderRadius: "12px", border: "1px solid #334155" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff", marginBottom: "12px" }}>📦 Add New Product</h3>
                <form onSubmit={handleAddProduct} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input type="text" placeholder="Product Name" required style={{ width: "100%", padding: "8px", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "6px", color: "#fff", fontSize: "12px", boxSizing: "border-box" }} value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  <input type="text" placeholder="Price (e.g. ₹500)" required style={{ width: "100%", padding: "8px", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "6px", color: "#fff", fontSize: "12px", boxSizing: "border-box" }} value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                  <select style={{ width: "100%", padding: "8px", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "6px", color: "#fff", fontSize: "12px", boxSizing: "border-box" }} value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div>
                    <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Product Photo:</label>
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(e, true)} style={{ fontSize: "11px", color: "#94a3b8" }} />
                  </div>
                  <button type="submit" style={{ width: "100%", backgroundColor: "#059669", color: "#ffffff", fontWeight: "bold", padding: "10px", borderRadius: "6px", border: "none", fontSize: "12px", cursor: "pointer" }}>Publish Product</button>
                </form>
              </div>

              {/* 4. Manage Existing Products (Edit / Delete / Photo Change) */}
              <div style={{ backgroundColor: "#1e293b", padding: "16px", borderRadius: "12px", border: "1px solid #334155" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff", marginBottom: "12px" }}>📝 Manage / Edit Existing Products</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {products.map(p => (
                    <div key={p.id} style={{ backgroundColor: "#020617", padding: "12px", borderRadius: "8px", border: "1px solid #334155" }}>
                      {editingProductId === p.id ? (
                        <div style={{ display: "flex", fle
