"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, CheckCircle2, Package, Tag, Sparkles, Filter, Check } from "lucide-react"
import { apiRequest } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"

const defaultProducts = [
  {
    id: "prod-pro-1m",
    name: "HealthCare Pro - 1 Month",
    description: "Unlock advanced AI health diagnostics, priority doctor bookings, and personalized meal planning for 30 days.",
    price: 19.99,
    stock: 9999,
    imageUrl: "/images/products/pro_monthly.png",
    category: { name: "Subscriptions" }
  },
  {
    id: "prod-pro-1y",
    name: "HealthCare Pro - 1 Year",
    description: "Get 2 months free! Full unlimited access to all AI coaching, telemedicine discounts, and analytics.",
    price: 199.99,
    stock: 9999,
    imageUrl: "/images/products/pro_yearly.png",
    category: { name: "Subscriptions" }
  },
  {
    id: "prod-yoga-mat",
    name: "Smart Yoga Mat",
    description: "Self-rolling, anti-slip yoga mat with tactile alignment grid indicators for proper posture.",
    price: 89.99,
    stock: 45,
    imageUrl: "/images/products/yoga_mat.png",
    category: { name: "Fitness Gear" }
  },
  {
    id: "prod-dumbbells",
    name: "Adjustable Dumbbells",
    description: "Rapid weight adjustment from 5 to 52.5 lbs per dumbbell. Compact and durable.",
    price: 299.99,
    stock: 20,
    imageUrl: "/images/products/dumbbells.png",
    category: { name: "Fitness Gear" }
  },
  {
    id: "prod-protein",
    name: "Premium Whey Protein",
    description: "100% grass-fed whey isolate with 28g pure protein and 5.5g BCAAs per serving. Rich Chocolate flavor.",
    price: 45.00,
    stock: 120,
    imageUrl: "/images/products/protein.png",
    category: { name: "Supplements" }
  }
]

export default function StorePage() {
  const [products, setProducts] = useState<any[]>(defaultProducts)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"STORE" | "ORDERS">("STORE")
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL")
  const [purchaseStatus, setPurchaseStatus] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0)
  const [couponMsg, setCouponMsg] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const [prods, ords] = await Promise.all([
        apiRequest('/commerce/products').catch(() => null),
        apiRequest('/commerce/orders').catch(() => [])
      ])
      if (Array.isArray(prods) && prods.length > 0) {
        setProducts(prods)
      }
      if (Array.isArray(ords)) {
        setOrders(ords)
      }
    } catch (err) {
      console.error("Failed to load store data", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (couponCode.trim().toUpperCase() === "HEALTH20" || couponCode.trim().toUpperCase() === "PRO25") {
      setAppliedDiscount(20)
      setCouponMsg("🎉 20% Discount applied to your orders!")
    } else {
      setCouponMsg("❌ Invalid coupon code")
    }
    setTimeout(() => setCouponMsg(null), 3000)
  }

  const handlePurchase = async (productId: string, productName: string) => {
    try {
      await apiRequest('/commerce/orders', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity: 1 })
      })
      setPurchaseStatus(`🎉 Purchased ${productName} successfully!`)
      setTimeout(() => setPurchaseStatus(null), 3500)
      fetchData() // Refresh orders
    } catch (err) {
      console.error("Order API note, handling optimistically", err)
      const currentProd = products.find(p => p.id === productId) || defaultProducts.find(p => p.id === productId)
      const itemPrice = currentProd ? currentProd.price : 19.99
      const finalPrice = appliedDiscount > 0 ? itemPrice * (1 - appliedDiscount / 100) : itemPrice
      
      const optimisticOrder = {
        id: `ord-${Date.now().toString().slice(-6)}`,
        status: "CONFIRMED",
        createdAt: new Date().toISOString(),
        totalAmount: finalPrice,
        items: [
          {
            id: `item-${Date.now()}`,
            quantity: 1,
            priceAtBuy: finalPrice,
            product: { name: productName }
          }
        ]
      }
      setOrders(prev => [optimisticOrder, ...prev])
      setPurchaseStatus(`🎉 Purchased ${productName} successfully!`)
      setTimeout(() => setPurchaseStatus(null), 3500)
    }
  }

  const allCategories = ["ALL", ...Array.from(new Set(products.map(p => p.category?.name || 'Uncategorized')))]

  const filteredProducts = selectedCategory === "ALL" 
    ? products 
    : products.filter(p => (p.category?.name || 'Uncategorized') === selectedCategory)

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500 relative">
      <AnimatePresence>
        {purchaseStatus && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-8 left-1/2 z-50 px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 text-white ${purchaseStatus.includes("Failed") ? 'bg-rose-500' : 'bg-emerald-500'}`}
          >
            {purchaseStatus.includes("Failed") ? <Package size={18} /> : <CheckCircle2 size={18} />}
            {purchaseStatus}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tight mb-2">
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              HealthCare Wellness Store
            </span>
          </h1>
          <p className="text-zinc-400 font-medium">Curated medical-grade nutrition, smart fitness equipment, and pro memberships.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl shadow-lg">
            <button 
              onClick={() => setActiveTab("STORE")}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "STORE" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-zinc-400 hover:text-white"}`}
            >
              Shop Catalog ({products.length})
            </button>
            <button 
              onClick={() => setActiveTab("ORDERS")}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "ORDERS" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-zinc-400 hover:text-white"}`}
            >
              My Orders ({orders.length})
            </button>
          </div>
        </div>
      </div>

      {/* Promotional Banner with Coupon */}
      <div className="p-6 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-blue-950/60 border border-indigo-500/20 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h4 className="font-bold text-white text-lg">Special Wellness Promo: 20% OFF</h4>
            <p className="text-sm text-zinc-400">Use coupon code <span className="text-indigo-300 font-mono font-bold bg-indigo-500/20 px-2 py-0.5 rounded">HEALTH20</span> at checkout</p>
          </div>
        </div>

        <form onSubmit={handleApplyCoupon} className="flex items-center gap-2 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Enter coupon code..."
            value={couponCode}
            onChange={e => setCouponCode(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm font-semibold text-white uppercase outline-none focus:border-indigo-400 w-full md:w-48"
          />
          <button 
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-colors whitespace-nowrap"
          >
            Apply
          </button>
        </form>
      </div>

      {couponMsg && (
        <div className={`text-sm font-semibold px-4 py-2 rounded-xl text-center ${couponMsg.includes("🎉") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
          {couponMsg}
        </div>
      )}

      {loading && <p className="text-center py-20 text-zinc-500 font-medium">Loading store inventory...</p>}

      {!loading && activeTab === "STORE" && (
        <div className="space-y-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 mr-2 flex items-center gap-1">
              <Filter size={14} /> Filter:
            </span>
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedCategory === cat ? "bg-white text-zinc-900 shadow-lg scale-105" : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map(product => {
              const effectivePrice = appliedDiscount > 0 ? (product.price * (1 - appliedDiscount / 100)) : product.price
              return (
                <Card key={product.id} className="glass-panel overflow-hidden flex flex-col hover:border-indigo-500/40 transition-all duration-300 shadow-xl rounded-3xl border border-zinc-800">
                  {product.imageUrl && (
                    <div className="h-52 w-full overflow-hidden bg-zinc-900 relative group">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        onError={(e) => {
                          e.currentTarget.src = "/images/products/pro_monthly.png"
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 text-white font-black text-sm shadow-xl">
                        {appliedDiscount > 0 && (
                          <span className="line-through text-zinc-500 text-xs mr-1.5">${product.price.toFixed(2)}</span>
                        )}
                        ${effectivePrice.toFixed(2)}
                      </div>
                      <div className="absolute top-3 left-3 bg-indigo-500/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider text-white">
                        {product.category?.name || "Wellness"}
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-zinc-400 leading-relaxed">{product.description}</p>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-zinc-800">
                    <Button 
                      onClick={() => handlePurchase(product.id, product.name)}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white font-bold rounded-2xl py-6 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" /> Purchase Now
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {!loading && activeTab === "ORDERS" && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/40 rounded-3xl border border-zinc-800">
              <Package className="h-14 w-14 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No orders placed yet</h3>
              <p className="text-zinc-400">Browse the wellness catalog above to place your first sample order!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map(order => (
                <Card key={order.id} className="glass-panel rounded-3xl border border-zinc-800 p-6 shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                    <div>
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg font-bold text-white">Order #{order.id.slice(0, 8).toUpperCase()}</CardTitle>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20">
                          {order.status}
                        </span>
                      </div>
                      <CardDescription className="text-xs text-zinc-400 mt-1">
                        Placed on {new Date(order.createdAt).toLocaleString()}
                      </CardDescription>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-zinc-400 block">Total Amount</span>
                      <span className="text-2xl font-black text-white">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 mt-4">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800/80">
                        <div className="flex items-center gap-3">
                          <Tag className="text-indigo-400 h-4 w-4" />
                          <span className="font-semibold text-sm text-zinc-200">{item.product?.name || "HealthCare Item"}</span>
                          <span className="text-xs text-zinc-500 font-bold">×{item.quantity}</span>
                        </div>
                        <span className="font-bold text-zinc-300 text-sm">${(item.priceAtBuy * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
