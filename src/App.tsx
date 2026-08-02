import React, { useState } from "react";

export default function App() {
  const [currentPage, setCurrentPage] = useState("store");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  // Admin Credentials State (Yahan se username/password change hoga)
  const [adminAuth, setAdminAuth] = useState({
    username: "admin",
    password: "krishna123",
  });
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "" });

  const [categories, setCategories] = useState([
    "Cement",
    "Concrete & Sand",
    "Sariya & Iron",
    "Hardware",
    "Plumbing",
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("919999999999");

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "UltraTech Cement (50kg)",
      price: "₹400",
      category: "Cement",
      image:
        "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400",
    },
    {
      id: 2,
      name: "TATA Tiscon 550SD Sariya (12mm)",
      price: "₹75/kg",
      category: "Sariya & Iron",
      image:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400",
    },
    {
      id: 3,
      name: "River Sand (Per Tractor)",
      price: "Ask for Price",
      category: "Concrete & Sand",
      image:
        "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=400",
    },
    {
      id: 4,
      name: "Ashirvad CPVC Pipe (1 inch)",
      price: "₹350",
      category: "Plumbing",
      image:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "Cement",
    image: "",
  });
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleWhatsAppInquiry = (productName: string, price: string) => {
    const msg = `Hello Krishna Traders! I am interested in ${productName} (${price}). Please share details.`;
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      credentials.username === adminAuth.username &&
      credentials.password === adminAuth.password
    ) {
      setIsLoggedIn(true);
    } else {
      alert(
        `Wrong login! Current username is "${adminAuth.username}" and password is "${adminAuth.password}"`
      );
    }
  };

  const handleUpdateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdmin.username && newAdmin.password) {
      setAdminAuth(newAdmin);
      setNewAdmin({ username: "", password: "" });
      alert("Admin username and password updated successfully!");
    } else {
      alert("Please fill both username and password!");
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
      alert("Category added successfully!");
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
        image:
          newProduct.image ||
          "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400",
      };
      setProducts([...products, newItem]);
      setNewProduct({
        name: "",
        price: "",
        category: categories[0],
        image: "",
      });
      alert(`Product "${newItem.name}" added successfully!`);
    }
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Kya aap sach mein is product ko hatana chahte hain?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleUpdateImage = (id: number, newImage: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, image: newImage } : p))
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex justify-between items-center sticky top-0 z-50">
        <span className="font-bold text-emerald-400 text-xs md:text-sm">
          📍 Krishna Traders
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage("store")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentPage === "store"
                ? "bg-emerald-600 text-white shadow-lg"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            Customer View
          </button>
          <button
            onClick={() => setCurrentPage("admin")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentPage === "admin"
                ? "bg-emerald-600 text-white shadow-lg"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            Owner Panel
          </button>
        </div>
      </div>

      {currentPage === "store" ? (
        <div>
          <div className="relative bg-gradient-to-b from-slate-950 to-slate-900 px-6 py-10 text-center border-b border-slate-800">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-white">
              KRISHNA <span className="text-emerald-400">TRADERS</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300 italic mb-4">
              "Sahi Budget, Premium Quality – Aapke Ghar Ki Majboot Buniyaad!"
            </p>
            <div className="max-w-md mx-auto bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1 text-left">
              <p>
                📍 <b>Address:</b> Pabhera, near Dhanarua, Dist-Patna (Bihar),
                804451
              </p>
              <p>
                📧 <b>Email:</b> kumaravishek06246@gmail.com
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">
                Building Materials & Hardware
              </h2>
              <span className="text-[11px] text-emerald-400 font-medium">
                💬 WhatsApp Inquiry
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
              {["All", ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "bg-emerald-500 text-slate-950 font-bold shadow-md"
                      : "bg-slate-800 text-slate-300 border border-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-md flex flex-col"
                >
                  <div className="h-32 bg-slate-900 relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <span className="absolute top-2 left-2 bg-slate-950/80 text-[10px] text-emerald-400 px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-3.5 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-bold text-xs text-white mb-1">
                        {p.name}
                      </h3>
                      <p className="text-emerald-400 font-extrabold text-xs mb-3">
                        {p.price}
                      </p>
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
          {!isLoggedIn ? (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-1 text-center">
                Owner Portal Login
              </h2>
              <p className="text-xs text-slate-400 text-center mb-6">
                Krishna Traders Admin
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Username (Default: admin)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-emerald-500"
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Password (Default: krishna123)
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-emerald-500"
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-lg text-xs hover:bg-emerald-500 transition-colors shadow-lg"
                >
                  Login to Dashboard
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div>
                  <h2 className="font-bold text-white text-xs">
                    Welcome, Owner
                  </h2>
                  <p className="text-[10px] text-emerald-400">Store Active</p>
                </div>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="bg-rose-600/20 text-rose-400 border border-rose-600/30 text-xs px-3 py-1.5 rounded-lg font-semibold"
                >
                  Logout
                </button>
              </div>

              {/* Change Username & Password Form */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <h3 className="font-bold text-xs text-white mb-3">
                  🔐 Change Admin Username & Password
                </h3>
                <form onSubmit={handleUpdateAdmin} className="space-y-3">
                  <input
                    type="text"
                    placeholder="New Username"
                    value={newAdmin.username}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, username: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="New Password"
                    value={newAdmin.password}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, password: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white font-bold py-2 rounded text-xs"
                  >
                    Update Login Details
                  </button>
                </form>
              </div>

              {/* Edit WhatsApp Number Form */}
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <h3 className="font-bold text-xs text-white mb-3">
                  📱 Edit WhatsApp Inquiry Number
                </h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Enter WhatsApp Number (e.g. 919999999999)"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <h3 className="font-bold text-xs text-white mb-3">
                  📦 Add New Product
                </h3>
                <form onSubmit={handleAddProduct} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Product Name"
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white outline-none"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Price (e.g. ₹500)"
                      required
                      className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white outline-none"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                    />
                    <select
                      className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white outline-none"
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value,
                        })
                      }
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Image URL (Optional photo link)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white outline-none"
                    value={newProduct.image}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, image: e.target.value })
                    }
                  />
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white font-bold py-2 rounded text-xs"
                  >
                    Publish Product
                  </button>
                </form>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <h3 className="font-bold text-xs text-white mb-3">
                  🛠️ Manage Products (Delete & Edit Photos)
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="bg-slate-900 p-3 rounded-lg border border-slate-700 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={p.image}
                            alt=""
                            className="w-10 h-10 object-cover rounded border border-slate-700"
                          />
                          <div>
                            <p className="text-xs font-bold text-white">
                              {p.name}
                            </p>
                            <p className="text-[10px] text-emerald-400">
                              {p.price} • {p.category}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="bg-rose-600/20 text-rose-400 border border-rose-600/30 text-[10px] px-2.5 py-1 rounded font-semibold whitespace-nowrap"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Paste new image URL here to change photo"
                          defaultValue={p.image}
                          onBlur={(e) =>
                            handleUpdateImage(p.id, e.target.value)
                          }
                          className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-[11px] text-white outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <h3 className="font-bold text-xs text-white mb-3">
                  📁 Add Category
                </h3>
                <form onSubmit={handleAddCategory} className="space-y-3">
                  <input
                    type="text"
                    placeholder="New Category Name"
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-xs text-white outline-none"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="w-full bg-slate-950 text-white font-bold py-2 rounded text-xs border border-slate-700"
                  >
                    Create Category
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
