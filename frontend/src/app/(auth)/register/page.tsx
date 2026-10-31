"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useUser } from "@/context/UserContext"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useUser()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("USER") // USER, DOCTOR, DIETITIAN
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await register(email, password, role)
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Failed to register")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 bg-cyan-500/10 rounded-bl-full w-32 h-32 -z-10" />
          
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-zinc-300 mb-2">HealthVerse AI 🩺🤖</h2>
            <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Create Account</h1>
            <p className="text-zinc-400 font-medium">Join the ultimate health platform.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white font-medium"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-white font-medium"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {['USER', 'DOCTOR', 'DIETITIAN'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all ${role === r ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:bg-zinc-800'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center text-zinc-500 text-sm font-medium">
            Already have an account? <button onClick={() => router.push('/login')} className="text-cyan-400 hover:text-cyan-300 transition-colors">Log in</button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
