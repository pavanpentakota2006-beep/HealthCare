"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, Plus, Timer, Zap } from "lucide-react"
import { Modal } from "@/components/ui/modal"

interface Workout {
  id: number
  name: string
  duration: string
  intensity: string
  caloriesBurned: number
}

import { useUser } from "@/context/UserContext"

export default function WorkoutsPage() {
  const { stats, healthData, updateHealthData } = useUser()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form state
  const [newName, setNewName] = useState("")
  const [newDuration, setNewDuration] = useState("")
  const [newIntensity, setNewIntensity] = useState("Medium")

  const workouts = healthData.workouts
  const totalMinutes = workouts.reduce((sum, w) => sum + parseInt(w.duration), 0)

  const handleLogWorkout = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newDuration) return
    
    // Simple heuristic for demo
    const multiplier = newIntensity === "High" ? 10 : newIntensity === "Medium" ? 7 : 4;
    const calories = parseInt(newDuration) * multiplier;

    const newWorkout = {
      id: Date.now(),
      name: newName,
      duration: newDuration,
      intensity: newIntensity,
      caloriesBurned: calories
    }
    
    updateHealthData({ workouts: [newWorkout, ...workouts] })
    setIsModalOpen(false)
    setNewName("")
    setNewDuration("")
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-emerald-500 to-emerald-700 dark:from-emerald-300 dark:to-emerald-500 bg-clip-text text-transparent">Workouts</h1>
          <p className="text-muted-foreground mt-2">Log your exercises and stay active.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-full font-medium shadow-lg hover:scale-105 transition-transform active:scale-95"
        >
          <Plus size={18} />
          <span>New Workout</span>
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log a Workout" description="Record your physical activity.">
        <form onSubmit={handleLogWorkout} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Workout Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g., Evening Yoga"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Duration (mins)</label>
              <input 
                required
                type="number" 
                placeholder="0"
                value={newDuration}
                onChange={e => setNewDuration(e.target.value)}
                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Intensity</label>
              <select 
                value={newIntensity}
                onChange={e => setNewIntensity(e.target.value)}
                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full mt-6 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors"
          >
            Save Workout
          </button>
        </form>
      </Modal>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass md:col-span-1">
          <CardHeader>
            <CardTitle>Activity Ring</CardTitle>
            <CardDescription>Your movement today</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="relative flex items-center justify-center w-48 h-48 rounded-full bg-secondary/50 border-[12px] border-emerald-500/10 dark:border-emerald-500/20">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="84" className="stroke-emerald-500 transition-all duration-1000 ease-out" strokeWidth="12" fill="none" strokeDasharray="528" strokeDashoffset={528 - (528 * Math.min(totalMinutes / stats.dailyActivityGoal, 1))} strokeLinecap="round" />
              </svg>
              <div className="text-center z-10">
                <Activity size={32} className="text-emerald-500 mx-auto mb-2" />
                <div className="text-4xl font-black">{totalMinutes}</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">/ {stats.dailyActivityGoal} Mins</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
                {workouts.map((workout, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, type: "spring" }}
                    key={workout.id}
                    className="flex items-center justify-between p-4 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:scale-[1.01] transition-transform"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                        <Activity size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{workout.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Timer size={14} /> {workout.duration} mins</span>
                          <span className="flex items-center gap-1"><Zap size={14} /> {workout.intensity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">{workout.caloriesBurned}</span>
                      <span className="text-muted-foreground text-sm ml-1">kcal</span>
                    </div>
                  </motion.div>
                ))}
                {workouts.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No workouts logged yet.</p>
                )}
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
