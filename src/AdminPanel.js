import React, { useState, useEffect } from "react";
import {
  Lock,
  LogOut,
  LayoutDashboard,
  PackagePlus,
  FolderPlus,
  Users,
  MessageCircle,
  TrendingUp,
  Trash2,
  Image as ImageIcon,
  KeyRound,
  UploadCloud
} from "lucide-react";
import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  updatePassword
} from "firebase/auth";

export default function AdminPanel() {
  // Authentication State
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Change Password State inside Dashboard
  const [newPassword, setNewPassword] = useState("");

  // Dynamic State connected to Firestore
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [newCategory, setNewCategory] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "Cement",
    imageUrl: "",
  });

  // Track Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 1. Fetch Categories in Realtime
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      const catList = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      if (catList.length === 0) {
        const defaultCats = [
          "Cement",
          "Concrete & Sand",
          "Sariya & Iron",
          "Hardware",
          "Plumbing",
        ];
        setCategories(defaultCats.map((name) => ({ id: name, name })));
      } else {
        setCategories(catList);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Products in Realtime
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const prodList = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setProducts(prodList);
    });
    return () => unsubscribe();
  }, []);

  const stats = {
    visitors: 1248,
    inquiries: 86,
    activeProducts: products.length,
  };

  // Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert("Login Failed: " + err.message + "\n(Note: Make sure your email & password are correct)");
    }
  };

  // Forgot Password Handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your registered Email address!");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      alert(`Password reset link sent to ${email}! Please check your Inbox / Spam folder.`);
    } catch (err) {
      alert("Error sending reset link: " + err.message);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    signOut(auth);
  };

  // Change Password Handler inside Dashboard
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        alert("Password updated successfully!");
        setNewPassword("");
      }
    } catch (err) {
      alert("Error changing password: " + err.message + " (Try re-logging in and trying again)");
    }
  };

  // Convert Mobile Gallery Image File to Base64 String
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024 * 2) {
        alert("File size is too large! Please choose a photo under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await addDoc(collection(db, "categories"), {
        name: newCategory.trim(),
        createdAt: serverTimestamp(),
      });
      alert(`Category "${newCategory}" added successfully!`);
      setNewCategory("");
    } catch (err) {
      alert("Error adding category: " + err.message);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (catId, catName) => {
    if (window.confirm(`Delete category "${catName}"?`)) {
      try {
        await deleteDoc(doc(db, "categories", catId));
      } catch (err) {
        alert("Error deleting category: " + err.message);
      }
    }
  };

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    try {
      await addDoc(collection(db, "products"), {
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category || (categories[0]?.name || "Cement"),
        imageUrl: newProduct.imageUrl || "",
        createdAt: serverTimestamp(),
      });
      alert(`Product "${newProduct.name}" published!`);
      setNewProduct({
        name: "",
        price: "",
        category: categories[0]?.name || "Cement",
        imageUrl: "",
      });
    } catch (err) {
      alert("Error adding product: " + err.message);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (prodId, prodName) => {
    if (window.confirm(`Delete "${prodName}"?`)) {
      try {
        await deleteDoc(doc(db, "products", prodId));
      } catch (err) {
        alert("Error deleting product: " + err.message);
      }
    }
  };

  // --- LOGIN / FORGOT PASSWORD SCREEN ---
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-emerald-600 p-8 text-center text-white">
            <Lock className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl font-bold mb-1">Owner Portal</h2>
            <p className="text-emerald-100 text-sm">
              Krishna Traders Secure Access
            </p>
          </div>

          {!isForgotPassword ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Owner Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-xs text-emerald-600 hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
              >
                Secure Login
              </button>
            </form>
          ) : (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPassword} className="p-8 space-y-6">
              <h3 className="text-lg font-bold text-slate-800 text-center">
                Reset Your Password
              </h3>
              <p className="text-xs text-slate-500 text-center">
                Enter your registered Email. We will send a password reset code/link to your inbox.
              </p>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Your Registered Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {resetEmailSent && (
                <p className="text-xs text-emerald-600 font-bold text-center">
                  ✅ Reset link sent! Check your Gmail inbox.
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg"
              >
                Send Password Reset Email
              </button>

              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="w-full text-sm text-slate-500 hover:text-slate-800 text-center font-semibold block"
              >
                ← Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- DASHBOARD SCREEN ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Krishna <span className="text-emerald-500">Admin</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Management Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a
            href="#"
            className="flex items-center space-x-3 bg-emerald-600/10 text-emerald-500 px-4 py-3 rounded-xl transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-semibold">Overview</span>
          </a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors w-full px-4 py-3"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          Store Performance
        </h1>

        {/* 1. Analytics Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="bg-blue-500/10 p-4 rounded-xl text-blue-600">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Visitors</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.visitors}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="bg-emerald-500/10 p-4 rounded-xl text-emerald-600">
              <MessageCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">WhatsApp Inquiries</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.inquiries}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="bg-purple-500/10 p-4 rounded-xl text-purple-600">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Active Products</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.activeProducts}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          {/* 2. Add New Product Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <PackagePlus className="text-emerald-500 w-6 h-6" />
              <h2 className="text-xl font-bold text-slate-800">Add New Product</h2>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Asian Paints Apex (20L)"
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Price / Unit
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., ₹3200"
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none"
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gallery Image Upload Picker */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center space-x-2">
                  <UploadCloud className="w-4 h-4 text-emerald-600" />
                  <span>Select Product Photo from Mobile Gallery</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 outline-none text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {newProduct.imageUrl && (
                  <div className="mt-3 flex items-center space-x-3">
                    <img
                      src={newProduct.imageUrl}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border border-slate-200 shadow-sm"
                    />
                    <span className="text-xs text-emerald-600 font-semibold">
                      Photo Selected Successfully!
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Publish Product to Store
              </button>
            </form>
          </div>

          {/* 3. Manage Categories & Change Password */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <FolderPlus className="text-blue-500 w-6 h-6" />
                <h2 className="text-xl font-bold text-slate-800">Add New Category</h2>
              </div>
              <form onSubmit={handleAddCategory} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Electricals, Paints, Tiles..."
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Create Category
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-500 mb-4">
                  Current Active Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md text-sm font-medium flex items-center space
