"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Droplet, Plus, GlassWater } from "lucide-react"

import { useUser } from "@/context/UserContext"

export default function WaterPage() {
  const { stats, healthData, updateHealthData } = useUser()
  const goal = stats.dailyWaterGoal // Dynamic ml based on profile weight
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const waterAmount = healthData.waterIntake

  const addWater = (amount: number) => {
    const newAmount = Math.max(0, Math.min(waterAmount + amount, goal * 1.5))
    updateHealthData({ waterIntake: newAmount })
    if (amount > 0) {
      setToastMessage(`Added ${amount}ml of water!`)
    } else {
      setToastMessage(`Removed ${Math.abs(amount)}ml of water!`)
    }
    setTimeout(() => setToastMessage(null), 2500)
  }

  const percentage = Math.min((waterAmount / goal) * 100, 100)

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500 relative">
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-8 left-1/2 z-50 bg-zinc-900 text-white px-6 py-3 rounded-full font-medium shadow-2xl flex items-center gap-2"
          >
            <Droplet size={18} className="text-blue-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">Hydration</h1>
          <p className="text-muted-foreground mt-2">Track your daily water intake.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass md:col-span-1 h-96 flex flex-col justify-center items-center relative overflow-hidden border-blue-500/10 dark:border-blue-500/20">
          {/* Animated Water Background */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500/30 to-blue-400/10 -z-10"
            initial={{ height: "0%" }}
            animate={{ height: `${percentage}%` }}
            transition={{ duration: 1, type: "spring" }}
          />
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <div className="p-6 bg-blue-500/10 rounded-full mb-4 shadow-inner shadow-blue-500/20">
              <Droplet size={64} className="text-blue-500" />
            </div>
            <h2 className="text-6xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">{waterAmount} <span className="text-3xl text-muted-foreground font-semibold">ml</span></h2>
            <p className="text-muted-foreground mt-2 font-medium">Daily Goal: {goal} ml</p>
          </CardContent>
        </Card>

        <div className="space-y-6 md:col-span-1">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Log Water</CardTitle>
              <CardDescription>Add or remove water from your daily intake</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => addWater(250)}
                className="flex flex-col items-center justify-center p-6 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all text-blue-600 dark:text-blue-400 shadow-sm hover:shadow-blue-500/10"
              >
                <GlassWater size={32} className="mb-2" />
                <span className="font-bold text-lg">+ 250 ml</span>
                <span className="text-xs text-muted-foreground font-medium">1 Glass</span>
              </button>
              <button 
                onClick={() => addWater(500)}
                className="flex flex-col items-center justify-center p-6 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all text-blue-600 dark:text-blue-400 shadow-sm hover:shadow-blue-500/10"
              >
                <GlassWater size={36} className="mb-2" />
                <span className="font-bold text-lg">+ 500 ml</span>
                <span className="text-xs text-muted-foreground font-medium">1 Bottle</span>
              </button>
              <button 
                onClick={() => addWater(-250)}
                className="flex flex-col items-center justify-center p-6 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all text-rose-600 dark:text-rose-400 shadow-sm hover:shadow-rose-500/10"
              >
                <span className="font-bold text-lg">- 250 ml</span>
                <span className="text-xs text-muted-foreground font-medium">Remove</span>
              </button>
              <button 
                onClick={() => addWater(-500)}
                className="flex flex-col items-center justify-center p-6 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all text-rose-600 dark:text-rose-400 shadow-sm hover:shadow-rose-500/10"
              >
                <span className="font-bold text-lg">- 500 ml</span>
                <span className="text-xs text-muted-foreground font-medium">Remove</span>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
