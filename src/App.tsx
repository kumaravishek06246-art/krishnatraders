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
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  onSnapshot
} from "firebase/firestore";

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
const db = getFirestore(app);

export default function App() {
  const [currentPage, setCurrentPage] = useState("store");
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const [whatsappNumber, setWhatsappNumber] = useState('919999999999');
  const [categories, setCategories] = useState(['Cement', 'Sariya & Iron', 'Plumbing', 'Hardware']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [newCategory, setNewCategory] = useState('');

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Cement', description: '', image: '' });

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, "settings", "storeInfo"), (docSnap) => {
      if (docSnap.exists()) {
        setWhatsappNumber(docSnap.data().whatsapp || '919999999999');
        setCategories(docSnap.data().categories || ['Cement', 'Sariya & Iron', 'Plumbing', 'Hardware']);
      }
    });
    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const prodsList = [];
      snapshot.forEach((d) => prodsList.push({ id: d.id, ...d.data() }));
      setProducts(prodsList);
    });
    return () => { unsubSettings(); unsubProducts(); };
  }, []);

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
      setIsForgotPassword(false);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return;
    try {
      await updatePassword(auth.currentUser, newPassword);
      alert("Password successfully change ho gaya hai!");
      setNewPassword('');
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const saveSettingsToFirestore = async (wa, cats) => {
    try {
      await setDoc(doc(db, "settings", "storeInfo"), { whatsapp: wa, categories: cats });
    } catch (err) {
      alert("Database error!");
    }
  };

  const handleUpdateWhatsApp = () => {
    saveSettingsToFirestore(whatsappNumber, categories);
    alert("WhatsApp Number Update ho gaya!");
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      const updatedCats = [...categories, newCategory];
      saveSettingsToFirestore(whatsappNumber, updatedCats);
      setNewCategory('');
      alert("New Category Add ho gayi!");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewProduct({ ...newProduct, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return alert("Product ka Naam aur Daam daalna jaruri hai!");
    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), newProduct);
        alert("Product Update ho gaya!");
        setEditingId(null);
      } else {
        await addDoc(collection(db, "products"), newProduct);
        alert("Naya Product jud gaya!");
      }
      setNewProduct({ name: '', price: '', category: categories[0] || 'Cement', description: '', image: '' });
    } catch (err) {
      alert("Error saving product: " + err.message);
    }
  };

  const handleEditClick = (p) => {
    setEditingId(p.id);
    setNewProduct({ name: p.name, price: p.price, category: p.category, description: p.description || '', image: p.image || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Aap sach mein is product ko delete karna chahte hain?")) {
      await deleteDoc(doc(db, "products", id));
    }
  };

  const filteredProducts = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);

  return (
    <div style={{ backgroundColor: "#0f172a", color: "#ffffff", minHeight: "100vh", fontFamily: "sans-serif", paddingBottom: "20px" }}>
      <div style={{ backgroundColor: "#020617", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", position: "sticky", top: 0, zIndex: 50 }}>
        <span style={{ color: "#34d399", fontWeight: "bold", fontSize: "14px" }}>📍 KRISHNA TRADERS</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setCurrentPage('store')} style={{ backgroundColor: currentPage === 'store' ? '#059669' : '#1e293b', color: '#ffffff', padding: "6px 12px", borderRadius: "8px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>Customer</button>
          <button onClick={() => setCurrentPage('admin')} style={{ backgroundColor: currentPage === 'admin' ? '#059669' : '#1e293b', color: '#ffffff', padding: "6px 12px", borderRadius: "8px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>Owner</button>
        </div>
      </div>

      {currentPage === 'store' ? (
        <div>
          <div style={{ backgroundColor: "#020617", padding: "24px 16px", textAlign: "center", borderBottom: "1px solid #1e293b", marginBottom: "20px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#ffffff", margin: "0 0 8px 0" }}>KRISHNA <span style={{ color: "#34d399" }}>TRADERS</span></h1>
            <p style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic", margin: "0 0 12px 0" }}>"Sahi Budget, Premium Quality!"</p>
          </div>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 16px" }}>
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "20px" }}>
              {['All', ...categories].map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{ backgroundColor: activeCategory === cat ? '#10b981' : '#1e293b', color: activeCategory === cat ? '#020617' : '#cbd5e1', padding: "6px 14px", borderRadius: "20px", border: "1px solid #334155", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>{cat}</button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              {filteredProducts.map((p) => (
                <div key={p.id} style={{ backgroundColor: "#1e293b", borderRadius: "12px", overflow: "hidden", border: "1px solid #334155" }}>
                  {p.image && <img src={p.image} alt={p.name} style={{ width: "100%", height: "140px", objectFit: "cover" }} />}
                  <div style={{ padding: "12px" }}>
                    <span style={{ fontSize: "10px", backgroundColor: "#020617", color: "#34d399", padding: "2px 6px", borderRadius: "4px" }}>{p.category}</span>
                    <h3 style={{ fontSize: "13px", fontWeight: "bold", color: "#ffffff", marginTop: "8px" }}>{p.name}</h3>
                    <p style={{ color: "#34d399", fontWeight: "800", fontSize: "13px" }}>{p.price}</p>
                    {p.description && <p style={{ fontSize: "11px", color: "#cbd5e1", marginTop: "6px" }}>{p.description}</p>}
                    <button onClick={() => handleWhatsAppInquiry(p.name, p.price)} style={{ width: "100%", backgroundColor: "#059669", color: "#ffffff", border: "none", fontSize: "12px", marginTop: "10px", padding: "10px", borderRadius: "8px", cursor: "pointer" }}>💬 Inquire</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: "450px", margin: "30px auto", padding: "0 16px" }}>
           {!firebaseUser ? (
             <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "16px" }}>
                <h2 style={{ textAlign: "center", color: "#fff" }}>Owner Login</h2>
                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} style={{ padding: "8px", backgroundColor: "#020617", border: "1px solid #334155", color: "#fff" }} />
                  <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} style={{ padding: "8px", backgroundColor: "#020617", border: "1px solid #334155", color: "#fff" }} />
                  <button type="submit" style={{ backgroundColor: "#059669", color: "#fff", padding: "10px", border: "none" }}>Login</button>
                </form>
             </div>
           ) : (
             <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <button onClick={() => signOut(auth)} style={{ backgroundColor: "#991b1b", color: "#fff", padding: "8px" }}>Sign Out</button>
                <div style={{ backgroundColor: "#1e293b", padding: "16px", borderRadius: "10px" }}>
                  <h3 style={{ color: "#fff" }}>⚙️ Settings</h3>
                  <input type="text" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} style={{ width: "100%", padding: "8px", backgroundColor: "#020617", border: "1px solid #334155", color: "#fff" }} />
                  <button onClick={handleUpdateWhatsApp} style={{ marginTop: "8px", backgroundColor: "#059669", color: "#fff", padding: "8px" }}>Update WhatsApp</button>
                </div>
                <div style={{ backgroundColor: "#1e293b", padding: "16px", borderRadius: "10px" }}>
                  <h3 style={{ color: "#34d399" }}>{editingId ? "Edit" : "Add"} Product</h3>
                  <form onSubmit={handleAddOrUpdateProduct} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <input type="text" placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={{ padding: "8px", backgroundColor: "#020617", border: "1px solid #334155", color: "#fff" }} />
                    <input type="text" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={{ padding: "8px", backgroundColor: "#020617", border: "1px solid #334155", color: "#fff" }} />
                    <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} style={{ padding: "8px", backgroundColor: "#020617", border: "1px solid #334155", color: "#fff" }}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} style={{ padding: "8px", backgroundColor: "#020617", border: "1px solid #334155", color: "#fff" }} />
                    <input type="file" onChange={handleImageUpload} />
                    <button type="submit" style={{ backgroundColor: "#059669", color: "#fff", padding: "8px" }}>Save Product</button>
                  </form>
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
      }
                    
