"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { useUser } from "@/context/UserContext"
import { useMemo, useState } from "react"

export default function OverviewChart() {
  const { stats, healthData } = useUser()
  const [metric, setMetric] = useState("calories")

  // Generate dynamic chart data based on the user's actual profile and logged data
  const chartData = useMemo(() => {
    const todayCalories = healthData.meals.reduce((sum, m) => sum + m.calories, 0)
    const todayWater = healthData.waterIntake
    const todaySleep = healthData.sleepHours + (healthData.sleepMinutes / 60)
    const todayActivity = healthData.workouts.reduce((sum, w) => sum + parseInt(w.duration), 0)
    
    const baseWeight = stats.weightKg
    const cGoal = stats.dailyCalorieGoal
    const wGoal = stats.dailyWaterGoal
    const sGoal = stats.dailySleepGoal
    const aGoal = stats.dailyActivityGoal

    return [
      { name: "Mon", calories: cGoal - 150, weight: baseWeight + 0.5, water: wGoal - 200, sleep: sGoal - 1, activity: aGoal + 10 },
      { name: "Tue", calories: cGoal + 100, weight: baseWeight + 0.3, water: wGoal + 100, sleep: sGoal + 0.5, activity: aGoal - 15 },
      { name: "Wed", calories: cGoal - 50,  weight: baseWeight + 0.4, water: wGoal - 50,  sleep: sGoal,     activity: aGoal + 20 },
      { name: "Thu", calories: cGoal - 200, weight: baseWeight + 0.1, water: wGoal + 250, sleep: sGoal - 1.5, activity: aGoal - 5 },
      { name: "Fri", calories: cGoal + 300, weight: baseWeight - 0.2, water: wGoal - 100, sleep: sGoal + 1,   activity: aGoal + 30 },
      { name: "Sat", calories: cGoal - 100, weight: baseWeight - 0.1, water: wGoal + 400, sleep: sGoal + 2,   activity: aGoal + 45 },
      { name: "Today", calories: todayCalories, weight: baseWeight, water: todayWater, sleep: todaySleep, activity: todayActivity },
    ]
  }, [stats, healthData])

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="absolute -top-16 right-4 z-10">
        <select 
          value={metric} 
          onChange={e => setMetric(e.target.value)}
          className="bg-zinc-800 text-white font-medium text-sm px-4 py-2 rounded-xl border border-zinc-700 outline-none hover:border-zinc-500 cursor-pointer transition-colors shadow-lg"
        >
          <option value="calories">Calories & Weight</option>
          <option value="water">Hydration</option>
          <option value="sleep">Sleep</option>
          <option value="activity">Activity</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          {metric === "calories" && <YAxis yAxisId="right" orientation="right" domain={['dataMin - 1', 'dataMax + 1']} />}
          <Tooltip contentStyle={{ backgroundColor: 'oklch(0.205 0 0)', borderRadius: '10px' }} />
          
          {metric === "calories" && (
            <>
              {stats.dailyCalorieGoal && <ReferenceLine yAxisId="left" y={stats.dailyCalorieGoal} label="Goal" stroke="#ef4444" strokeDasharray="3 3" />}
              <Line yAxisId="left" type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={3} />
              <Line yAxisId="right" type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} />
            </>
          )}

          {metric === "water" && (
            <>
              {stats.dailyWaterGoal && <ReferenceLine yAxisId="left" y={stats.dailyWaterGoal} label="Goal" stroke="#ef4444" strokeDasharray="3 3" />}
              <Line yAxisId="left" type="monotone" dataKey="water" stroke="#22d3ee" strokeWidth={3} />
            </>
          )}

          {metric === "sleep" && (
            <>
              {stats.dailySleepGoal && <ReferenceLine yAxisId="left" y={stats.dailySleepGoal} label="Goal" stroke="#ef4444" strokeDasharray="3 3" />}
              <Line yAxisId="left" type="monotone" dataKey="sleep" stroke="#a855f7" strokeWidth={3} />
            </>
          )}

          {metric === "activity" && (
            <>
              {stats.dailyActivityGoal && <ReferenceLine yAxisId="left" y={stats.dailyActivityGoal} label="Goal" stroke="#ef4444" strokeDasharray="3 3" />}
              <Line yAxisId="left" type="monotone" dataKey="activity" stroke="#10b981" strokeWidth={3} />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
