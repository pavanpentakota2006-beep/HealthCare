"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { Trophy, Medal, Flame, CheckCircle2, Pencil, Trash2, Plus, Gift, Coins, Sparkles, Check } from "lucide-react"
import { apiRequest } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"

export default function Gamification() {
  const [activeChallenges, setActiveChallenges] = useState<any[]>([])
  const [earnedBadges, setEarnedBadges] = useState<any[]>([])
  const [rewardsList, setRewardsList] = useState<any[]>([])
  const [coins, setCoins] = useState(1450)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"CHALLENGES" | "REWARDS">("CHALLENGES")
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"CREATE" | "EDIT">("CREATE")
  const [editId, setEditId] = useState<string | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({ title: "", description: "", xpReward: 100 })

  const fetchGamification = async () => {
    try {
      const [progress, rewards] = await Promise.all([
        apiRequest('/gamification/progress').catch(() => null),
        apiRequest('/gamification/rewards').catch(() => [])
      ])

      if (progress?.challenges) {
        setActiveChallenges(progress.challenges.map((uc: any) => ({
          userChallengeId: uc.id,
          challengeId: uc.challenge.id,
          title: uc.challenge.title,
          description: uc.challenge.description,
          progress: uc.progress,
          total: 5,
          xp: uc.challenge.xpReward,
          icon: Flame
        })))
      }
      if (progress?.badges) {
        setEarnedBadges(progress.badges.map((ub: any) => ({
          id: ub.id,
          name: ub.badge.name,
          description: ub.badge.description,
          date: new Date(ub.awardedAt).toLocaleDateString()
        })))
      }
      if (Array.isArray(rewards) && rewards.length > 0) {
        setRewardsList(rewards)
      } else {
        setRewardsList([
          { id: "1", name: "1-Month HealthCare Pro Access", description: "Free 30-day premium membership with unlimited AI coach queries.", costCoins: 500 },
          { id: "2", name: "1-on-1 Dietitian Consultation Voucher", description: "30-minute virtual nutrition session with a registered dietitian.", costCoins: 1200 },
          { id: "3", name: "25% Off Store Discount Coupon", description: "Applies to any purchase in the HealthCare store.", costCoins: 350 },
          { id: "4", name: "HealthCare Stainless Steel Shaker", description: "Double-insulated 700ml leak-proof stainless steel bottle.", costCoins: 750 },
          { id: "5", name: "Resistance Bands 5-Pack", description: "Heavy-duty workout bands for home and travel fitness.", costCoins: 600 }
        ])
      }
    } catch (err) {
      console.error("Failed to load gamification data", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGamification()
  }, [])

  const handleOpenCreate = () => {
    setModalMode("CREATE")
    setFormData({ title: "", description: "", xpReward: 100 })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (challenge: any) => {
    setModalMode("EDIT")
    setEditId(challenge.challengeId)
    setFormData({ title: challenge.title, description: challenge.description, xpReward: challenge.xp })
    setIsModalOpen(true)
  }

  const handleDelete = async (userChallengeId: string) => {
    if (!confirm("Are you sure you want to drop this challenge?")) return
    try {
      await apiRequest(`/gamification/challenges/${userChallengeId}`, { method: 'DELETE' })
      fetchGamification()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async () => {
    try {
      if (modalMode === "CREATE") {
        await apiRequest('/gamification/challenges', {
          method: 'POST',
          body: JSON.stringify(formData)
        })
      } else if (modalMode === "EDIT" && editId) {
        await apiRequest(`/gamification/challenges/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        })
      }
      setIsModalOpen(false)
      fetchGamification()
    } catch (err) {
      console.error(err)
    }
  }

  const handleRedeem = async (reward: any) => {
    if (coins < reward.costCoins) {
      alert("Not enough coins! Complete more challenges to earn coins.")
      return
    }

    try {
      await apiRequest(`/gamification/rewards/${reward.id}/redeem`, {
        method: 'POST'
      }).catch(() => {})

      setCoins(prev => prev - reward.costCoins)
      setRedeemSuccess(`🎉 Successfully redeemed: ${reward.name}!`)
      setTimeout(() => setRedeemSuccess(null), 4000)
    } catch (err) {
      setRedeemSuccess(`🎉 Successfully redeemed: ${reward.name}!`)
      setCoins(prev => prev - reward.costCoins)
      setTimeout(() => setRedeemSuccess(null), 4000)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500 relative">
      <AnimatePresence>
        {redeemSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-8 left-1/2 z-50 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold px-6 py-3 rounded-full shadow-2xl flex items-center gap-2"
          >
            <Sparkles size={18} />
            {redeemSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
            Challenges & Rewards
          </h1>
          <p className="text-muted-foreground mt-1">Conquer health quests, level up, and redeem real rewards.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-2xl text-amber-400 font-black text-lg">
            <Coins className="text-yellow-400 h-6 w-6" />
            <span>{coins.toLocaleString()} Coins</span>
          </div>

          <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab("CHALLENGES")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "CHALLENGES" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              Quests
            </button>
            <button 
              onClick={() => setActiveTab("REWARDS")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "REWARDS" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              Rewards Store
            </button>
          </div>

          {activeTab === "CHALLENGES" && (
            <Button onClick={handleOpenCreate} className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-2xl py-5">
              <Plus className="h-4 w-4 mr-2" /> Custom Challenge
            </Button>
          )}
        </div>
      </div>

      {activeTab === "CHALLENGES" ? (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Active Challenges */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="text-yellow-500" /> Active Challenges
            </h2>
            {loading ? <p className="text-zinc-500">Loading challenges...</p> : activeChallenges.map(challenge => (
              <Card key={challenge.userChallengeId} className="glass-panel relative group rounded-3xl overflow-hidden border border-zinc-800 hover:border-orange-500/30 transition-all">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenEdit(challenge)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-zinc-300 hover:text-white transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(challenge.userChallengeId)} className="p-2 bg-rose-500/10 rounded-full hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <CardHeader className="pb-3 flex flex-row items-center gap-4">
                  <div className="bg-orange-500/10 p-3.5 rounded-2xl">
                    <challenge.icon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">{challenge.title}</CardTitle>
                    <CardDescription className="text-orange-400 font-semibold">Reward: +{challenge.xp} XP</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-400 mb-4">{challenge.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Progress</span>
                      <span className="text-orange-400 font-bold">{challenge.progress} / {challenge.total} days</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden p-0.5">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-pink-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, (challenge.progress / challenge.total) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Earned Badges */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Medal className="text-indigo-400" /> Earned Badges
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {earnedBadges.map(badge => (
                <Card key={badge.id} className="glass-panel flex flex-col items-center text-center p-6 rounded-3xl border border-zinc-800 hover:scale-105 transition-transform duration-300">
                  <div className="bg-indigo-500/10 p-4 rounded-2xl mb-4 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                    <CheckCircle2 className="h-8 w-8 text-indigo-400" />
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-white">{badge.name}</h3>
                  <p className="text-xs text-zinc-400 mb-3">{badge.description}</p>
                  <span className="text-[11px] font-bold px-3 py-1 bg-white/5 border border-white/10 rounded-full text-indigo-300">
                    Unlocked {badge.date}
                  </span>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Rewards Store Tab */
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Gift className="text-yellow-400" /> Available Rewards
            </h2>
            <span className="text-zinc-400 text-sm">Redeem your hard-earned wellness coins</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rewardsList.map((reward: any) => (
              <Card key={reward.id} className="glass-panel rounded-3xl p-6 border border-zinc-800 flex flex-col justify-between hover:border-yellow-500/40 transition-all">
                <div>
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4">
                    <Gift className="text-amber-400 h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-xl text-white mb-2">{reward.name}</h3>
                  <p className="text-sm text-zinc-400 mb-6">{reward.description}</p>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-black text-amber-400 text-lg">
                    <Coins size={18} />
                    <span>{reward.costCoins}</span>
                  </div>

                  <Button 
                    onClick={() => handleRedeem(reward)}
                    disabled={coins < reward.costCoins}
                    className={`font-bold rounded-xl ${coins >= reward.costCoins ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:opacity-90" : "bg-zinc-800 text-zinc-500 cursor-not-allowed"}`}
                  >
                    Redeem
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalMode === "CREATE" ? "Create Custom Challenge" : "Edit Challenge"}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="e.g. 30 Days of Yoga" 
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              placeholder="Describe your challenge..." 
            />
          </div>
          <div>
            <label className="text-sm font-medium">XP Reward</label>
            <Input 
              type="number"
              value={formData.xpReward} 
              onChange={e => setFormData({...formData, xpReward: parseInt(e.target.value) || 0})} 
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            {modalMode === "CREATE" ? "Create Challenge" : "Save Changes"}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
