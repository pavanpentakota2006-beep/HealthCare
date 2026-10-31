"use client"

import { useUser } from "@/context/UserContext"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { UserCircle, Ruler, Weight, Flame, Salad, Check } from "lucide-react"
import { useState } from "react"
import dynamic from "next/dynamic"

const OverviewChart = dynamic(() => import("@/components/OverviewChart"), { ssr: false })

export default function ProfilePage() {
  const { stats, updateStats, healthData, updateHealthData } = useUser()
  const [showToast, setShowToast] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // stats context is updated via the onChange handlers instantly, 
    // but we can show a nice success toast on form submit.
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 relative">
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-8 left-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-full font-medium shadow-2xl flex items-center gap-2"
          >
            <Check size={18} />
            Profile successfully updated!
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center relative z-10"
      >
        <div>
          <h1 className="text-5xl font-black tracking-tight mb-2">
            <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent drop-shadow-sm">Profile & Settings</span>
          </h1>
          <p className="text-lg text-zinc-400 font-medium flex items-center gap-2">
            <UserCircle className="text-orange-400" size={18} /> Personalize your health journey.
          </p>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3 relative z-10">
        
        {/* Profile Settings Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2"
        >
          <Card className="glass-panel border-t-4 border-t-orange-500 rounded-3xl h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 bg-orange-500/10 rounded-bl-full w-40 h-40 -z-10" />
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Physical Attributes</CardTitle>
              <CardDescription>Your stats determine your daily calorie goals.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-2">
                      <Ruler size={16} className="text-orange-400" /> Height (cm)
                    </label>
                    <input 
                      type="number" 
                      value={stats.heightCm}
                      onChange={e => updateStats({ heightCm: parseInt(e.target.value) || 0 })}
                      className="w-full p-4 rounded-2xl bg-zinc-900/50 border border-zinc-700/50 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-bold text-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-2">
                      <Weight size={16} className="text-orange-400" /> Weight (kg)
                    </label>
                    <input 
                      type="number" 
                      value={stats.weightKg}
                      onChange={e => updateStats({ weightKg: parseInt(e.target.value) || 0 })}
                      className="w-full p-4 rounded-2xl bg-zinc-900/50 border border-zinc-700/50 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-bold text-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-2">
                      <UserCircle size={16} className="text-orange-400" /> Age (Yrs)
                    </label>
                    <input 
                      type="number" 
                      value={stats.age}
                      onChange={e => updateStats({ age: parseInt(e.target.value) || 0 })}
                      className="w-full p-4 rounded-2xl bg-zinc-900/50 border border-zinc-700/50 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-bold text-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-2">
                    <Salad size={16} className="text-orange-400" /> Dietary Preferences
                  </label>
                  <select 
                    value={stats.foodPreference}
                    onChange={e => updateStats({ foodPreference: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-zinc-900/50 border border-zinc-700/50 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all font-bold text-lg"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black text-lg hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all active:scale-[0.98]"
                >
                  Save Profile
                </button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Goal Calculation Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-1"
        >
          <Card className="glass-panel border-t-4 border-t-rose-500 rounded-3xl h-full flex flex-col justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none" />
            <CardContent className="pt-6">
              <div className="mx-auto w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                <Flame size={40} className="text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-zinc-400 uppercase tracking-widest mb-6">Live Targets</h3>
              
              <div className="space-y-6 text-left">
                <div>
                  <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Calories (kcal)</label>
                  <input 
                    type="number"
                    value={stats.dailyCalorieGoal}
                    onChange={e => updateStats({ dailyCalorieGoal: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 rounded-xl bg-zinc-900/80 border border-zinc-700/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all font-black text-3xl text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Hydration (ml)</label>
                  <input 
                    type="number"
                    value={stats.dailyWaterGoal}
                    onChange={e => updateStats({ dailyWaterGoal: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 rounded-xl bg-zinc-900/80 border border-zinc-700/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all font-black text-3xl text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Sleep (hours)</label>
                  <input 
                    type="number"
                    value={stats.dailySleepGoal}
                    onChange={e => updateStats({ dailySleepGoal: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 rounded-xl bg-zinc-900/80 border border-zinc-700/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-black text-3xl text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Activity (mins)</label>
                  <input 
                    type="number"
                    value={stats.dailyActivityGoal}
                    onChange={e => updateStats({ dailyActivityGoal: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 rounded-xl bg-zinc-900/80 border border-zinc-700/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-black text-3xl text-white"
                  />
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800 text-sm text-zinc-400 text-left">
                <strong>How it works:</strong>
                <p className="mt-2">You can manually override these goals above. However, if you change your Physical Attributes, we will automatically recalculate these optimal targets for you!</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="glass-panel border-t-4 border-t-purple-500 rounded-3xl overflow-hidden relative h-full">
            <div className="absolute top-0 right-0 p-8 bg-purple-500/10 rounded-bl-full w-40 h-40 -z-10" />
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Your Progress Graph</CardTitle>
              <CardDescription>See how your profile settings instantly shape your weekly targets.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
               <OverviewChart />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1"
        >
          <Card className="glass-panel border-t-4 border-t-yellow-500 rounded-3xl overflow-hidden relative h-full">
            <div className="absolute top-0 right-0 p-8 bg-yellow-500/10 rounded-bl-full w-32 h-32 -z-10" />
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold">Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {healthData.appointments && healthData.appointments.length > 0 ? (
                <div className="space-y-4">
                  {healthData.appointments.map(apt => (
                    <div key={apt.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2 relative overflow-hidden group">
                      <button 
                        onClick={() => {
                          updateHealthData({ appointments: healthData.appointments.filter(a => a.id !== apt.id) })
                        }}
                        className="absolute top-3 right-3 text-zinc-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all bg-zinc-900/50 p-1.5 rounded-full"
                        title="Cancel Appointment"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      </button>
                      <h4 className="font-bold text-base text-white pr-6">{apt.doctorName}</h4>
                      <p className="text-xs font-medium text-yellow-400">{apt.specialty}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-col gap-1 text-xs text-zinc-400 font-medium">
                          <span>📅 {apt.date}</span>
                          <span>⏰ {apt.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 font-medium text-center py-8">No upcoming appointments.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
