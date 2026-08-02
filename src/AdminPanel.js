import React, { useState } from "react";
import {
  Lock,
  LogOut,
  LayoutDashboard,
  PackagePlus,
  FolderPlus,
  Users,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

export default function AdminPanel() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  // Inventory & Stats State
  const [categories, setCategories] = useState([
    "Cement",
    "Concrete & Sand",
    "Sariya & Iron",
    "Hardware",
    "Plumbing",
  ]);
  const [newCategory, setNewCategory] = useState("");

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "Cement",
  });

  // Mock Stats for the Dashboard
  const stats = {
    visitors: 1248,
    inquiries: 86,
    activeProducts: 45,
  };

  // Handlers
  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you would verify this against Firebase/Node.js here.
    // For now, we are using a simple mock login.
    if (
      credentials.username === "admin" &&
      credentials.password === "krishna123"
    ) {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials. (Hint: use admin / krishna123)");
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
      alert(`Category "${newCategory}" added successfully!`);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
      // Here you would normally push this to your database
      alert(`Product "${newProduct.name}" added to ${newProduct.category}!`);
      setNewProduct({ name: "", price: "", category: categories[0] });
    }
  };

  // --- LOGIN SCREEN ---
  if (!isLoggedIn) {
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
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder="Enter username"
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder="Enter password"
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
            >
              Secure Login
            </button>
          </form>
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
            onClick={() => setIsLoggedIn(false)}
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
              <p className="text-slate-500 text-sm font-medium">
                Total Visitors
              </p>
              <h3 className="text-2xl font-bold text-slate-800">
                {stats.visitors}
              </h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="bg-emerald-500/10 p-4 rounded-xl text-emerald-600">
              <MessageCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">
                WhatsApp Inquiries
              </p>
              <h3 className="text-2xl font-bold text-slate-800">
                {stats.inquiries}
              </h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="bg-purple-500/10 p-4 rounded-xl text-purple-600">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">
                Active Products
              </p>
              <h3 className="text-2xl font-bold text-slate-800">
                {stats.activeProducts}
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* 2. Add New Product Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <PackagePlus className="text-emerald-500 w-6 h-6" />
              <h2 className="text-xl font-bold text-slate-800">
                Add New Product
              </h2>
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
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Publish Product to Store
              </button>
            </form>
          </div>

          {/* 3. Manage Categories Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 h-fit">
            <div className="flex items-center space-x-3 mb-6">
              <FolderPlus className="text-blue-500 w-6 h-6" />
              <h2 className="text-xl font-bold text-slate-800">
                Add New Category
              </h2>
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
                {categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md text-sm font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
