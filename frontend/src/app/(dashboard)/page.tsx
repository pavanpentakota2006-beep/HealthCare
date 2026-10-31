"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Apple, Droplet, Moon, Sparkles, TrendingUp, Plus, Check } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUser } from "@/context/UserContext"

const OverviewChart = dynamic(() => import("@/components/OverviewChart"), { ssr: false })

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: "spring", stiffness: 120, damping: 20 } 
  }
}

export default function DashboardOverview() {
  const { stats, healthData, updateHealthData } = useUser()
  const [quickToast, setQuickToast] = useState<string | null>(null)

  const showFeedback = (msg: string) => {
    setQuickToast(msg)
    setTimeout(() => setQuickToast(null), 2500)
  }

  // Calculate dynamic KPIs from Context
  const loggedCalories = healthData.meals.reduce((sum, m) => sum + m.calories, 0)
  const difference = stats.dailyCalorieGoal - loggedCalories
  
  const waterLiters = (healthData.waterIntake / 1000).toFixed(1)
  const waterPercent = Math.min(Math.round((healthData.waterIntake / stats.dailyWaterGoal) * 100), 100)
  
  const activeMinutes = healthData.workouts.reduce((sum, w) => sum + (parseInt(w.duration) || 0), 0)

  const deleteAppointment = (id: any) => {
    updateHealthData({ appointments: healthData.appointments.filter(apt => apt.id !== id) })
    showFeedback("Appointment removed")
  }

  // Quick Action Handlers
  const addWater = (amount: number) => {
    updateHealthData({ waterIntake: healthData.waterIntake + amount })
    showFeedback(`+${amount}ml Hydration Logged!`)
  }

  const addQuickCalories = (cals: number, label: string) => {
    const newMeal = {
      id: Date.now(),
      name: label,
      calories: cals,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "Snack"
    }
    updateHealthData({ meals: [newMeal, ...healthData.meals] })
    showFeedback(`+${cals} kcal Logged (${label})`)
  }

  const addQuickActivity = (mins: number, label: string, cals: number) => {
    const newWorkout = {
      id: Date.now(),
      name: label,
      duration: mins.toString(),
      intensity: "Medium",
      caloriesBurned: cals
    }
    updateHealthData({ workouts: [newWorkout, ...healthData.workouts] })
    showFeedback(`+${mins}m Activity Logged!`)
  }

  const addQuickRest = (mins: number) => {
    const totalMins = healthData.sleepHours * 60 + healthData.sleepMinutes + mins
    updateHealthData({ 
      sleepHours: Math.floor(totalMins / 60),
      sleepMinutes: totalMins % 60
    })
    showFeedback(`+${mins}m Rest Logged!`)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 relative">
      <AnimatePresence>
        {quickToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-8 left-1/2 z-50 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2.5 rounded-full font-bold shadow-2xl flex items-center gap-2 text-sm"
          >
            <Check size={16} />
            {quickToast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/15 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-pink-500/15 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex justify-between items-center relative z-10"
      >
        <div>
          <h1 className="text-5xl font-black tracking-tight mb-2 flex items-center gap-3">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
              HealthVerse AI
            </span>
            <span className="text-3xl">🩺🤖</span>
          </h1>
          <p className="text-base text-zinc-400 font-medium flex items-center gap-2">
            <Sparkles className="text-yellow-400" size={16} /> Live health telemetry & daily performance summary
          </p>
        </div>
      </motion.div>

      {/* KPI Cards with Quick Actions */}
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative z-10"
      >
        {/* Calories Card */}
        <motion.div variants={itemVariants}>
          <Card className="glass-panel h-full border-t-4 border-t-pink-500 rounded-3xl overflow-hidden relative flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 bg-pink-500/10 rounded-bl-full w-24 h-24 -z-10" />
            <div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-pink-400 tracking-wider uppercase">Calories</CardTitle>
                <div className="p-2 bg-pink-500/20 rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.4)]"><Apple className="h-4 w-4 text-pink-400" /></div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-3xl font-black text-white tracking-tight mt-1">{loggedCalories} <span className="text-lg text-zinc-500 font-semibold">/ {stats.dailyCalorieGoal}</span></div>
                <p className="text-xs text-pink-400/80 mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp size={12}/> {difference > 0 ? `${difference} kcal remaining` : `${Math.abs(difference)} kcal over goal`}
                </p>
              </CardContent>
            </div>
            <div className="px-6 pb-4 pt-1 flex gap-2 border-t border-white/5">
              <button 
                onClick={() => addQuickCalories(150, "Energy Snack")}
                className="flex-1 py-1.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 text-xs font-bold transition-all active:scale-95 border border-pink-500/20"
              >
                +150 kcal
              </button>
              <button 
                onClick={() => addQuickCalories(350, "Protein Meal")}
                className="flex-1 py-1.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 text-xs font-bold transition-all active:scale-95 border border-pink-500/20"
              >
                +350 kcal
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Hydration Card */}
        <motion.div variants={itemVariants}>
          <Card className="glass-panel h-full border-t-4 border-t-cyan-400 rounded-3xl overflow-hidden relative flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 bg-cyan-400/10 rounded-bl-full w-24 h-24 -z-10" />
            <div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-cyan-400 tracking-wider uppercase">Hydration</CardTitle>
                <div className="p-2 bg-cyan-400/20 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.4)]"><Droplet className="h-4 w-4 text-cyan-400" /></div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-3xl font-black text-white tracking-tight mt-1">{waterLiters} <span className="text-lg text-zinc-500 font-semibold">/ {(stats.dailyWaterGoal / 1000).toFixed(1)} L</span></div>
                <p className="text-xs text-cyan-400/80 mt-1 flex items-center gap-1 font-medium">
                  <TrendingUp size={12}/> {waterPercent}% of daily target
                </p>
              </CardContent>
            </div>
            <div className="px-6 pb-4 pt-1 flex gap-2 border-t border-white/5">
              <button 
                onClick={() => addWater(250)}
                className="flex-1 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold transition-all active:scale-95 border border-cyan-500/20"
              >
                +250ml
              </button>
              <button 
                onClick={() => addWater(500)}
                className="flex-1 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold transition-all active:scale-95 border border-cyan-500/20"
              >
                +500ml
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Sleep Card */}
        <motion.div variants={itemVariants}>
          <Card className="glass-panel h-full border-t-4 border-t-purple-500 rounded-3xl overflow-hidden relative flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 bg-purple-500/10 rounded-bl-full w-24 h-24 -z-10" />
            <div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-purple-400 tracking-wider uppercase">Sleep</CardTitle>
                <div className="p-2 bg-purple-500/20 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)]"><Moon className="h-4 w-4 text-purple-400" /></div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-3xl font-black text-white tracking-tight mt-1">{healthData.sleepHours}h {healthData.sleepMinutes}m</div>
                <p className="text-xs text-purple-400/80 mt-1 font-medium">Goal: {stats.dailySleepGoal} hours</p>
              </CardContent>
            </div>
            <div className="px-6 pb-4 pt-1 flex gap-2 border-t border-white/5">
              <button 
                onClick={() => addQuickRest(30)}
                className="flex-1 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-bold transition-all active:scale-95 border border-purple-500/20"
              >
                +30m Rest
              </button>
              <button 
                onClick={() => addQuickRest(60)}
                className="flex-1 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-bold transition-all active:scale-95 border border-purple-500/20"
              >
                +1h Sleep
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Activity Card */}
        <motion.div variants={itemVariants}>
          <Card className="glass-panel h-full border-t-4 border-t-emerald-400 rounded-3xl overflow-hidden relative flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 bg-emerald-400/10 rounded-bl-full w-24 h-24 -z-10" />
            <div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-emerald-400 tracking-wider uppercase">Activity</CardTitle>
                <div className="p-2 bg-emerald-400/20 rounded-xl shadow-[0_0_15px_rgba(52,211,153,0.4)]"><Activity className="h-4 w-4 text-emerald-400" /></div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-3xl font-black text-white tracking-tight mt-1">{activeMinutes} <span className="text-lg text-zinc-500 font-semibold">/ {stats.dailyActivityGoal} mins</span></div>
                <p className="text-xs text-emerald-400/80 mt-1 font-medium">{healthData.workouts.length} Workouts completed</p>
              </CardContent>
            </div>
            <div className="px-6 pb-4 pt-1 flex gap-2 border-t border-white/5">
              <button 
                onClick={() => addQuickActivity(15, "Power Walk", 80)}
                className="flex-1 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold transition-all active:scale-95 border border-emerald-500/20"
              >
                +15m Walk
              </button>
              <button 
                onClick={() => addQuickActivity(30, "Cardio Circuit", 220)}
                className="flex-1 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold transition-all active:scale-95 border border-emerald-500/20"
              >
                +30m Workout
              </button>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Main Chart and Appointments */}
      <div className="grid gap-6 lg:grid-cols-3 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="lg:col-span-2"
        >
          <Card className="glass-panel rounded-3xl overflow-hidden border-zinc-700/50 shadow-2xl relative h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-bold">Progress Analytics</CardTitle>
              <CardDescription className="text-sm">Interactive weekly trends benchmarked against your optimal goals</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <OverviewChart />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="lg:col-span-1"
        >
          <Card className="glass-panel rounded-3xl overflow-hidden border-zinc-700/50 shadow-2xl relative h-full flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none" />
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center justify-between">
                <span>Appointments</span>
                <span className="text-xs px-2.5 py-1 bg-yellow-500/10 text-yellow-400 rounded-full font-bold">
                  {healthData.appointments?.length || 0} Scheduled
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto max-h-[350px]">
              {healthData.appointments && healthData.appointments.length > 0 ? (
                <div className="space-y-3">
                  {healthData.appointments.map(apt => (
                    <div key={apt.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2 relative overflow-hidden group hover:border-yellow-500/30 transition-all">
                      <div className="absolute top-0 right-0 p-4 bg-yellow-500/10 rounded-bl-3xl -z-10" />
                      <button 
                        onClick={() => deleteAppointment(apt.id)}
                        className="absolute top-3 right-3 text-zinc-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all bg-zinc-900/80 p-1.5 rounded-full"
                        title="Cancel Appointment"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      </button>
                      <div className="flex justify-between items-start pr-6">
                        <div>
                          <h4 className="font-bold text-base text-white">{apt.doctorName}</h4>
                          <p className="text-xs font-semibold text-yellow-400">{apt.specialty}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-xs text-zinc-400">
                        <span className="flex items-center gap-1 font-medium">📅 {apt.date} at {apt.time}</span>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-wider">{apt.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 font-medium text-center py-8">No upcoming appointments scheduled.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
