// @ts-nocheck
import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBDz6iDnpD0c_K-ike1f0t6aS6KezBaYKs",
  authDomain: "krishna-traders-a8849.firebaseapp.com",
  projectId: "krishna-traders-a8849",
  storageBucket: "krishna-traders-a8849.firebasestorage.app",
  messagingSenderId: "115202514278",
  appId: "1:115202514278:web:33e39bba7cca132b8e3ca7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function App() {
  const [page, setPage] = useState("store");
  const [user, setUser] = useState(null);
  const [whatsapp, setWhatsapp] = useState("919999999999");
  const [products, setProducts] = useState([
    { id: 1, name: "UltraTech Cement", price: "₹400", category: "Cement" }
  ]);
  const [newProd, setNewProd] = useState({ name: "", price: "", category: "Cement" });

  useEffect(() => { onAuthStateChanged(auth, setUser); }, []);

  const handleWA = (p) => window.open(`https://wa.me/${whatsapp}?text=I want ${p.name}`);
  const addProd = (e) => { e.preventDefault(); setProducts([...products, { ...newProd, id: Date.now() }]); };
  const delProd = (id) => setProducts(products.filter(p => p.id !== id));

  return (
    <div style={{ background: "#0f172a", color: "#fff", minHeight: "100vh", padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "20px", color: "#34d399" }}>KRISHNA TRADERS</h1>
        <div>
          <button onClick={() => setPage("store")} style={{ background: "#1e293b", border: "none", color: "#fff", padding: "5px 10px" }}>Store</button>
          <button onClick={() => setPage("admin")} style={{ background: "#059669", border: "none", color: "#fff", padding: "5px 10px", marginLeft: "5px" }}>Owner</button>
        </div>
      </div>

      {page === "store" ? (
        <div>
          {products.map(p => (
            <div key={p.id} style={{ background: "#1e293b", padding: "15px", marginBottom: "10px", borderRadius: "8px" }}>
              <h3>{p.name}</h3>
              <p>{p.price}</p>
              <button onClick={() => handleWA(p)} style={{ width: "100%", background: "#059669", border: "none", color: "#fff", padding: "10px" }}>Order on WhatsApp</button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {!user ? (
            <button onClick={() => alert("Requires Firebase Login Logic")} style={{ background: "#059669", width: "100%", padding: "10px" }}>Admin Login</button>
          ) : (
            <div>
              <div style={{ background: "#1e293b", padding: "15px", marginBottom: "20px" }}>
                <h3>Settings</h3>
                <input placeholder="WhatsApp Number" onChange={e => setWhatsapp(e.target.value)} style={{ width: "100%", padding: "8px" }} />
              </div>
              <div style={{ background: "#1e293b", padding: "15px" }}>
                <h3>Add New Product</h3>
                <input placeholder="Name" onChange={e => setNewProd({...newProd, name: e.target.value})} style={{ width: "100%", marginBottom: "5px", padding: "8px" }} />
                <input placeholder="Price" onChange={e => setNewProd({...newProd, price: e.target.value})} style={{ width: "100%", marginBottom: "5px", padding: "8px" }} />
                <button onClick={addProd} style={{ width: "100%", background: "#059669", padding: "10px" }}>Add</button>
              </div>
              <h3>Current Products</h3>
              {products.map(p => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", background: "#334155", padding: "10px", marginTop: "5px" }}>
                  {p.name} <button onClick={() => delProd(p.id)} style={{ background: "red" }}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
