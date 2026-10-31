"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Moon, Star, Clock, CloudMoon, Plus } from "lucide-react"
import { Modal } from "@/components/ui/modal"

import { useUser } from "@/context/UserContext"

export default function SleepPage() {
  const { stats, healthData, updateHealthData } = useUser()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sleepHoursInput, setSleepHoursInput] = useState("")
  const [sleepMinutesInput, setSleepMinutesInput] = useState("")

  const handleLogSleep = (e: React.FormEvent) => {
    e.preventDefault()
    updateHealthData({ 
      sleepHours: parseInt(sleepHoursInput) || 0,
      sleepMinutes: parseInt(sleepMinutesInput) || 0
    })
    setIsModalOpen(false)
  }

  const totalSleep = healthData.sleepHours + (healthData.sleepMinutes / 60)
  
  let qualityText = "Insufficient"
  let qualityColor = "text-rose-400"
  let qualityBg = "bg-rose-500/20"
  let qualityBorder = "border-rose-500/30"
  
  // Use dynamic sleep goal from profile stats
  if (totalSleep >= stats.dailySleepGoal) {
    qualityText = "Excellent Quality"
    qualityColor = "text-yellow-400"
    qualityBg = "bg-indigo-500/20"
    qualityBorder = "border-indigo-500/30"
  } else if (totalSleep >= stats.dailySleepGoal - 1) {
    qualityText = "Good Quality"
    qualityColor = "text-emerald-400"
    qualityBg = "bg-emerald-500/20"
    qualityBorder = "border-emerald-500/30"
  } else if (totalSleep >= stats.dailySleepGoal - 3) {
    qualityText = "Average Quality"
    qualityColor = "text-orange-400"
    qualityBg = "bg-orange-500/20"
    qualityBorder = "border-orange-500/30"
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-indigo-400 to-purple-600 bg-clip-text text-transparent">Sleep & Recovery</h1>
          <p className="text-muted-foreground mt-2">Monitor your sleep quality and cycles.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-500 text-white px-5 py-2.5 rounded-full font-medium shadow-lg hover:bg-indigo-600 hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>Log Sleep</span>
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Sleep" description="How much did you sleep last night?">
        <form onSubmit={handleLogSleep} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Hours</label>
              <input 
                required
                type="number" 
                min="0"
                max="24"
                value={sleepHoursInput}
                onChange={e => setSleepHoursInput(e.target.value)}
                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Minutes</label>
              <input 
                required
                type="number" 
                min="0"
                max="59"
                value={sleepMinutesInput}
                onChange={e => setSleepMinutesInput(e.target.value)}
                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full mt-6 py-3 rounded-xl bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition-colors"
          >
            Save Sleep Log
          </button>
        </form>
      </Modal>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass md:col-span-1 bg-gradient-to-br from-indigo-950/80 to-slate-900/90 backdrop-blur-2xl text-slate-100 border-indigo-500/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-indigo-200">Last Night</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
            <Moon size={48} className="text-indigo-400" />
            <div className="text-5xl font-black">{healthData.sleepHours}<span className="text-2xl text-indigo-300">h</span> {healthData.sleepMinutes}<span className="text-2xl text-indigo-300">m</span></div>
            <div className={`flex items-center gap-2 ${qualityColor} ${qualityBg} px-3 py-1 rounded-full border ${qualityBorder}`}>
              <Star size={16} />
              <span className="font-medium text-sm">{qualityText}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel md:col-span-2">
          <CardHeader>
            <CardTitle>Sleep Stages</CardTitle>
            <CardDescription>Breakdown of your night</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between font-medium">
                <span className="flex items-center gap-2 text-indigo-500"><CloudMoon size={18} /> Deep Sleep</span>
                <span>2h 10m</span>
              </div>
              <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "30%" }} transition={{ duration: 1 }} className="h-full bg-indigo-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between font-medium">
                <span className="flex items-center gap-2 text-blue-500"><Clock size={18} /> Light Sleep</span>
                <span>4h 30m</span>
              </div>
              <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "60%" }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-blue-500" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-medium">
                <span className="flex items-center gap-2 text-purple-500"><Star size={18} /> REM Sleep</span>
                <span>35m</span>
              </div>
              <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "10%" }} transition={{ duration: 1, delay: 0.4 }} className="h-full bg-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
