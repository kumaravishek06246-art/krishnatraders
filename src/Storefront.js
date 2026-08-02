import React, { useState } from "react";
import { MapPin, Mail, MessageCircle, ArrowRight, Phone } from "lucide-react";

const categories = [
  "All",
  "Cement",
  "Concrete & Sand",
  "Sariya & Iron",
  "Hardware",
  "Plumbing",
];

const initialProducts = [
  {
    id: 1,
    name: "UltraTech Cement (50kg)",
    price: "₹400",
    category: "Cement",
    image: "/api/placeholder/400/300",
  },
  {
    id: 2,
    name: "TATA Tiscon 550SD Sariya (12mm)",
    price: "₹75/kg",
    category: "Sariya & Iron",
    image: "/api/placeholder/400/300",
  },
  {
    id: 3,
    name: "River Sand (Per Tractor)",
    price: "Ask for Price",
    category: "Concrete & Sand",
    image: "/api/placeholder/400/300",
  },
  {
    id: 4,
    name: "Ashirvad CPVC Pipe (1 inch)",
    price: "₹350",
    category: "Plumbing",
    image: "/api/placeholder/400/300",
  },
];

export default function KrishnaTradersStore() {
  const [activeCategory, setActiveCategory] = useState("All");

  // Filters products based on selected category
  const filteredProducts =
    activeCategory === "All"
      ? initialProducts
      : initialProducts.filter((p) => p.category === activeCategory);

  // WhatsApp Integration Logic
  const handleWhatsAppInquiry = (productName) => {
    const phoneNumber = "91XXXXXXXXXX"; // Owner adds their number here
    const message = `Hello Krishna Traders! I am interested in ${productName}. Please share details.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* 1. LUXURY HERO SECTION */}
      <header className="relative bg-slate-900 text-white overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-40 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 flex flex-col justify-center min-h-[70vh]">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
            KRISHNA <span className="text-emerald-500">TRADERS</span>
          </h1>
          <p className="text-xl md:text-3xl font-light text-slate-300 mb-8 italic">
            "Sahi Budget, Premium Quality – Aapke Ghar Ki Majboot Buniyaad!"
          </p>

          <div className="flex flex-col space-y-3 text-sm md:text-base text-slate-400 max-w-lg bg-slate-800/50 p-6 rounded-xl backdrop-blur-sm border border-slate-700">
            <div className="flex items-center space-x-3">
              <MapPin className="text-emerald-500 w-5 h-5 flex-shrink-0" />
              <span>Pabhera, near Dhanarua, Dist-Patna (Bihar), 804451</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="text-emerald-500 w-5 h-5 flex-shrink-0" />
              <span>kumaravishek06246@gmail.com</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. DYNAMIC CATALOG & CATEGORIES */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Our Premium Materials
            </h2>
            <p className="text-slate-500">
              Direct from factory to your construction site.
            </p>
          </div>

          {/* Dukaan App Placeholder Link */}
          <button className="mt-6 md:mt-0 group flex items-center space-x-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-all">
            <span>Visit Our Dukaan App Store</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
                activeCategory === cat
                  ? "bg-emerald-600 text-white shadow-emerald-500/30"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3. PRODUCT GRID WITH WHATSAPP INQUIRY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-all group"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                  {product.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-1">
                  {product.name}
                </h3>
                <p className="text-emerald-600 font-bold mb-4">
                  {product.price}
                </p>
                <button
                  onClick={() => handleWhatsAppInquiry(product.name)}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Inquire on WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
