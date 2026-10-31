"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { apiRequest } from "@/lib/api"
import { useRouter } from "next/navigation"

export interface Meal {
  id: number | string
  name: string
  calories: number
  time: string
  type: string
}

export interface Workout {
  id: number | string
  name: string
  duration: string
  intensity: string
  caloriesBurned: number
}

interface UserStats {
  heightCm: number
  weightKg: number
  age: number
  foodPreference: string
  dailyCalorieGoal: number
  dailyWaterGoal: number
  dailySleepGoal: number
  dailyActivityGoal: number
}

interface Appointment {
  id: string
  doctorName: string
  specialty: string
  date: string
  time: string
  status: string
}

interface HealthData {
  meals: Meal[]
  workouts: Workout[]
  waterIntake: number
  sleepHours: number
  sleepMinutes: number
  appointments: Appointment[]
}

interface User {
  id: string
  email: string
  role: string
}

interface UserContextType {
  user: User | null
  token: string | null
  stats: UserStats
  healthData: HealthData
  updateStats: (newStats: Partial<UserStats>) => void
  updateHealthData: (newData: Partial<HealthData>) => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, role: string) => Promise<void>
  logout: () => void
}

const defaultStats: UserStats = {
  heightCm: 178,
  weightKg: 71.5,
  age: 29,
  foodPreference: "Balanced Nutrition",
  dailyCalorieGoal: 2200,
  dailyWaterGoal: 2500,
  dailySleepGoal: 8,
  dailyActivityGoal: 60
}

const defaultHealthData: HealthData = {
  meals: [
    { id: "m-1", name: "Herb-Roasted Chicken Breast & Asparagus", calories: 530, time: "07:30 PM", type: "Dinner" },
    { id: "m-2", name: "Greek Yogurt with Blueberries & Chia", calories: 210, time: "04:15 PM", type: "Snack" },
    { id: "m-3", name: "Mediterranean Salmon & Quinoa Bowl", calories: 650, time: "01:00 PM", type: "Lunch" },
    { id: "m-4", name: "Avocado Toast & Poached Eggs", calories: 420, time: "08:15 AM", type: "Breakfast" }
  ],
  workouts: [
    { id: "w-1", name: "Morning HIIT & Core Interval", duration: "45", intensity: "High", caloriesBurned: 380 },
    { id: "w-2", name: "Evening Vinyasa Yoga & Mobility", duration: "30", intensity: "Medium", caloriesBurned: 130 }
  ],
  waterIntake: 2100,
  sleepHours: 7,
  sleepMinutes: 45,
  appointments: [
    { id: "apt-1", doctorName: "Dr. Priya Sharma", specialty: "Cardiologist", date: "2026-11-03", time: "10:00 AM", status: "SCHEDULED" },
    { id: "apt-2", doctorName: "Dt. Kavya Nair", specialty: "Clinical Dietitian", date: "2026-11-06", time: "04:30 PM", status: "SCHEDULED" }
  ]
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [stats, setStats] = useState<UserStats>(defaultStats)
  const [healthData, setHealthData] = useState<HealthData>(defaultHealthData)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  const login = async (email: string, password: string) => {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      
      if (data?.access_token) {
        setToken(data.access_token)
        setUser(data.user)
        localStorage.setItem('auth_token', data.access_token)
        localStorage.setItem('auth_user', JSON.stringify(data.user))
      }
    } catch (err) {
      console.error("Auto-auth error:", err)
    }
  }

  const register = async (email: string, password: string, role: string) => {
    await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role })
    })
    await login(email, password)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setStats(defaultStats)
    setHealthData(defaultHealthData)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    router.push('/login')
  }

  useEffect(() => {
    setIsMounted(true)
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {}
    } else {
      // Auto-authenticate as pre-seeded demo user so all live backend endpoints connect seamlessly!
      login('demo@healthcare.ai', 'Health1234!')
    }
  }, [])

  // Sync with live backend whenever token is active
  useEffect(() => {
    if (token) {
      apiRequest('/health/sync')
        .then(data => {
          if (data?.stats) setStats(prev => ({ ...prev, ...data.stats }))
          if (data?.healthData) setHealthData(prev => ({ ...prev, ...data.healthData }))
        })
        .catch(err => console.error("Failed to sync health data", err))
    }
  }, [token])

  // Dynamic goal recalculation
  useEffect(() => {
    if (!isMounted) return

    const bmr = (10 * stats.weightKg) + (6.25 * stats.heightCm) - (5 * stats.age) + 5
    const tdee = Math.round(bmr * 1.2)
    const waterTarget = Math.round(stats.weightKg * 35)
    
    let sleepTarget = 8
    if (stats.age < 18) sleepTarget = 9
    if (stats.age > 65) sleepTarget = 7

    const activityTarget = stats.dailyActivityGoal || 60

    if (tdee !== stats.dailyCalorieGoal || waterTarget !== stats.dailyWaterGoal || sleepTarget !== stats.dailySleepGoal || activityTarget !== stats.dailyActivityGoal) {
      setStats(prev => {
        const updated = { 
          ...prev, 
          dailyCalorieGoal: tdee,
          dailyWaterGoal: waterTarget,
          dailySleepGoal: sleepTarget,
          dailyActivityGoal: activityTarget
        }
        if (token) {
          apiRequest('/health/sync', {
            method: 'POST',
            body: JSON.stringify({ stats: updated, healthData })
          }).catch(console.error)
        }
        return updated
      })
    }
  }, [stats.weightKg, stats.heightCm, stats.age, stats.dailyActivityGoal, isMounted, token])

  const updateStats = (newStats: Partial<UserStats>) => {
    setStats(prev => {
      const updated = { ...prev, ...newStats }
      if (token) {
        apiRequest('/health/sync', {
          method: 'POST',
          body: JSON.stringify({ stats: updated, healthData })
        }).catch(console.error)
      }
      return updated
    })
  }

  const updateHealthData = (newData: Partial<HealthData>) => {
    setHealthData(prev => {
      const updated = { ...prev, ...newData }
      if (token) {
        apiRequest('/health/sync', {
          method: 'POST',
          body: JSON.stringify({ stats, healthData: updated })
        }).catch(console.error)
      }
      return updated
    })
  }

  return (
    <UserContext.Provider value={{ user, token, stats, healthData, updateStats, updateHealthData, login, register, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
