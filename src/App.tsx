// @ts-nocheck
import React, { useState, useEffect } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, updatePassword } from "firebase/auth";

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
  const [whatsappNumber, setWhatsappNumber] = useState('919999999999');
  const [categories, setCategories] = useState(['Cement', 'Sariya & Iron', 'Plumbing', 'Hardware']);
  const [products, setProducts] = useState([
    { id: 1, name: 'UltraTech Cement (50kg)', price: '₹400', category: 'Cement', image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400' }
  ]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Cement', image: '' });

  useEffect(() => { return onAuthStateChanged(auth, (user) => setFirebaseUser(user)); }, []);

  const handleWhatsApp = (p) => window.open(`https://wa.me/${whatsappNumber}?text=Interested in ${p.name}`);
  const addProduct = (e) => { e.preventDefault(); setProducts([...products, { ...newProduct, id: Date.now() }]); };
  const deleteProduct = (id) => setProducts(products.filter(p => p.id !== id));

  return (
    <div style={{ backgroundColor: "#0f172a", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif", paddingBottom: "50px" }}>
      {/* Header */}
      <div style={{ padding: "15px", display: "flex", justifyContent: "space-between", backgroundColor: "#020617" }}>
        <h2 style={{ fontSize: "16px", color: "#34d399" }}>KRISHNA TRADERS</h2>
        <div>
          <button onClick={() => setCurrentPage('store')} style={{ marginRight: "10px", background: currentPage === 'store' ? '#059669' : '#1e293b', border: 'none', padding: '5px', color: '#fff' }}>Store</button>
          <button onClick={() => setCurrentPage('admin')} style={{ background: currentPage === 'admin' ? '#059669' : '#1e293b', border: 'none', padding: '5px', color: '#fff' }}>Owner</button>
        </div>
      </div>

      {currentPage === 'store' ? (
        <div style={{ padding: "20px" }}>
          {products.map(p => (
            <div key={p.id} style={{ background: "#1e293b", padding: "15px", borderRadius: "10px", marginBottom: "15px" }}>
              <img src={p.image} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
              <h3>{p.name}</h3>
              <p>{p.price}</p>
              <button onClick={() => handleWhatsApp(p)} style={{ width: "100%", background: "#059669", padding: "10px", border: 'none', color: '#fff' }}>WhatsApp</button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "20px" }}>
          {!firebaseUser ? (
            <button onClick={() => alert("Login Feature Here")} style={{ width: "100%", padding: "10px" }}>Admin Login</button>
          ) : (
            <div>
              <div style={{ background: "#1e293b", padding: "15px", marginBottom: "15px" }}>
                <h3>Settings</h3>
                <input placeholder="WhatsApp Number" onChange={(e) => setWhatsappNumber(e.target.value)} style={{ width: "100%", padding: "5px" }} />
              </div>
              <div style={{ background: "#1e293b", padding: "15px" }}>
                <h3>Add Product</h3>
                <input placeholder="Name" onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={{ display: "block", width: "100%", marginBottom: "5px" }} />
                <input placeholder="Price" onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={{ display: "block", width: "100%", marginBottom: "5px" }} />
                <button onClick={addProduct} style={{ background: "#059669", color: "#fff", width: "100%", padding: "10px" }}>Add</button>
              </div>
              <h3>Manage Products</h3>
              {products.map(p => (
                <div key={p.id} style={{ background: "#334155", padding: "10px", marginBottom: "5px", display: "flex", justifyContent: "space-between" }}>
                  <span>{p.name}</span>
                  <button onClick={() => deleteProduct(p.id)} style={{ background: "#991b1b", color: "#fff" }}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
