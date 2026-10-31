"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Apple, Plus, Flame, Clock } from "lucide-react"
import { Modal } from "@/components/ui/modal"

interface Meal {
  id: number
  name: string
  calories: number
  time: string
  type: string
}

import { useUser } from "@/context/UserContext"

export default function MealsPage() {
  const { stats, healthData, updateHealthData } = useUser()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Form state
  const [newMealName, setNewMealName] = useState("")
  const [newMealCalories, setNewMealCalories] = useState("")
  const [newMealType, setNewMealType] = useState("Snack")

  const meals = healthData.meals
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0)
  const calorieGoal = stats.dailyCalorieGoal

  const handleLogMeal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMealName || !newMealCalories) return
    
    const newMeal = {
      id: Date.now(),
      name: newMealName,
      calories: parseInt(newMealCalories),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: newMealType
    }
    
    updateHealthData({ meals: [newMeal, ...meals] })
    setIsModalOpen(false)
    setNewMealName("")
    setNewMealCalories("")
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-orange-400 to-red-500 bg-clip-text text-transparent">Meals & Diet</h1>
          <p className="text-muted-foreground mt-2">Track your nutrition and caloric intake.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-full font-medium shadow-lg hover:scale-105 transition-transform active:scale-95"
        >
          <Plus size={18} />
          <span>Log Meal</span>
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log a Meal" description="Enter the details of what you just ate.">
        <form onSubmit={handleLogMeal} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Meal Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g., Protein Shake"
              value={newMealName}
              onChange={e => setNewMealName(e.target.value)}
              className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Calories</label>
              <input 
                required
                type="number" 
                placeholder="0"
                value={newMealCalories}
                onChange={e => setNewMealCalories(e.target.value)}
                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Type</label>
              <select 
                value={newMealType}
                onChange={e => setNewMealType(e.target.value)}
                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snack</option>
              </select>
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full mt-6 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors"
          >
            Save Meal
          </button>
        </form>
      </Modal>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass md:col-span-1">
          <CardHeader>
            <CardTitle>Daily Summary</CardTitle>
            <CardDescription>Your macros for today</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
              <div className="flex items-center gap-3">
                <Flame className="text-orange-500" />
                <span className="font-semibold">Calories</span>
              </div>
              <div className="flex items-center gap-2 text-xl font-bold">
                <span>{totalCalories} /</span>
                <input 
                  type="number"
                  value={calorieGoal}
                  onChange={e => updateStats({ dailyCalorieGoal: parseInt(e.target.value) || 0 })}
                  className="w-24 p-1 rounded-lg bg-zinc-900/50 border border-zinc-700/50 text-center focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
            {/* Macro bars */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Progress</span><span className="font-medium">{Math.round((totalCalories/calorieGoal)*100)}%</span></div>
              <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${Math.min((totalCalories/calorieGoal)*100, 100)}%` }} 
                  className="h-full bg-orange-500" 
                />
              </div>
            </div>
            
            <a href="/profile" className="text-xs text-center text-orange-500 hover:text-orange-400 mt-2 hover:underline">
              Change Calorie Goal in Profile Settings
            </a>
          </CardContent>
        </Card>

        <Card className="glass-panel md:col-span-2">
          <CardHeader>
            <CardTitle>Today's Log</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
                {meals.map((meal, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={meal.id}
                    className="flex items-center justify-between p-4 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:scale-[1.01] transition-transform"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
                        <Apple size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{meal.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock size={14} /> {meal.time} • {meal.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-bold text-lg">{meal.calories}</span>
                        <span className="text-muted-foreground text-sm ml-1">kcal</span>
                      </div>
                      <button 
                        onClick={() => {
                          updateHealthData({
                            meals: meals.filter(m => m.id !== meal.id)
                          })
                        }}
                        className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Meal"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
                {meals.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No meals logged yet today.</p>
                )}
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
