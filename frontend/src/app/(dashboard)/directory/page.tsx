"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, Stethoscope, Star, CalendarDays, Check, MapPin } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { useUser } from "@/context/UserContext"
import { apiRequest } from "@/lib/api"

const fallbackDoctors = [
  { id: "mock-1", name: "Dr. Priya Sharma", specialty: "Cardiologist", rating: 4.9, location: "New York, NY", price: "$150/hr", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-t-rose-500", glow: "shadow-[0_0_15px_rgba(244,63,94,0.5)]" },
  { id: "mock-2", name: "Dr. Arjun Mehta", specialty: "Orthopedic Surgeon", rating: 4.8, location: "San Francisco, CA", price: "$140/hr", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-t-emerald-400", glow: "shadow-[0_0_15px_rgba(52,211,153,0.5)]" },
  { id: "mock-3", name: "Dr. Meera Reddy", specialty: "Neurologist", rating: 4.8, location: "Boston, MA", price: "$160/hr", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-t-indigo-500", glow: "shadow-[0_0_15px_rgba(99,102,241,0.5)]" },
  { id: "mock-4", name: "Dt. Kavya Nair", specialty: "Clinical Dietitian", rating: 4.9, location: "Online Virtual Clinic", price: "$100/hr", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-t-cyan-400", glow: "shadow-[0_0_15px_rgba(34,211,238,0.5)]" },
]

const colorPalettes = [
  { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-t-rose-500", glow: "shadow-[0_0_15px_rgba(244,63,94,0.5)]" },
  { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-t-emerald-400", glow: "shadow-[0_0_15px_rgba(52,211,153,0.5)]" },
  { color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-t-indigo-500", glow: "shadow-[0_0_15px_rgba(99,102,241,0.5)]" },
  { color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-t-cyan-400", glow: "shadow-[0_0_15px_rgba(34,211,238,0.5)]" },
  { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-t-amber-400", glow: "shadow-[0_0_15px_rgba(245,158,11,0.5)]" },
  { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-t-purple-400", glow: "shadow-[0_0_15px_rgba(168,85,247,0.5)]" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120 } }
}

export default function Directory() {
  const { healthData, updateHealthData } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [doctorsList, setDoctorsList] = useState(fallbackDoctors)
  const [bookingDoctor, setBookingDoctor] = useState<any | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("09:00 AM")

  useEffect(() => {
    apiRequest('/telemedicine/doctors')
      .then(apiDocs => {
        if (Array.isArray(apiDocs) && apiDocs.length > 0) {
          const mapped = apiDocs.map((doc: any, i: number) => {
            const profile = doc.profile || {}
            const docProf = doc.doctorProfile || doc.dietitianProfile || {}
            const palette = colorPalettes[i % colorPalettes.length]
            
            let displayName = ""
            if (profile.firstName) {
              displayName = `${profile.firstName} ${profile.lastName || ''}`.trim()
            } else {
              const prefix = doc.email.split('@')[0].replace('.', ' ')
              displayName = prefix.charAt(0).toUpperCase() + prefix.slice(1)
            }
            if (!displayName.toLowerCase().startsWith('dr.') && !displayName.toLowerCase().startsWith('dt.')) {
              displayName = (doc.role === 'DIETITIAN' ? 'Dt. ' : 'Dr. ') + displayName
            }

            const specialty = docProf.specialization || docProf.certifications || (doc.role === 'DIETITIAN' ? 'Clinical Dietitian' : 'Specialist Physician')
            const fee = docProf.consultationFee ? `$${Math.round(docProf.consultationFee / 10)}/hr` : "$120/hr"

            return {
              id: doc.id,
              name: displayName,
              specialty,
              rating: (4.7 + ((i % 3) * 0.1)).toFixed(1),
              location: "Online Consultation",
              price: fee,
              ...palette
            }
          })
          setDoctorsList(mapped)
        }
      })
      .catch(() => {
        // Fallback already in place
      })
  }, [])

  const filteredDoctors = doctorsList.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (bookingDoctor) {
      const newApt = {
        id: Date.now().toString(),
        doctorName: bookingDoctor.name,
        specialty: bookingDoctor.specialty,
        date: date,
        time: time,
        status: "Confirmed"
      }
      updateHealthData({ appointments: [...healthData.appointments, newApt] })

      // Also attempt backend booking if user is logged in
      const scheduledDateTime = new Date(`${date}T10:00:00Z`)
      if (!isNaN(scheduledDateTime.getTime()) && !String(bookingDoctor.id).startsWith('mock-')) {
        apiRequest('/telemedicine/book', {
          method: 'POST',
          body: JSON.stringify({ doctorId: bookingDoctor.id, scheduledAt: scheduledDateTime })
        }).catch(() => {})
      }
    }
    setBookingDoctor(null)
    setDate("")
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
            Appointment successfully booked!
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10"
      >
        <div>
          <h1 className="text-5xl font-black tracking-tight mb-2">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent drop-shadow-sm">Find a Doctor</span>
          </h1>
          <p className="text-lg text-zinc-400 font-medium">Book top-rated specialists instantly.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-4 h-5 w-5 text-zinc-500" />
          <input 
            placeholder="Search specialties or names..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-900/50 border border-zinc-700/50 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all text-white font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative z-10"
      >
        {filteredDoctors.map((doctor: any) => (
          <motion.div variants={itemVariants} key={doctor.id}>
            <Card className={`glass-panel glow-hover h-full border-t-4 ${doctor.border} rounded-3xl overflow-hidden relative flex flex-col`}>
              <div className={`absolute top-0 right-0 p-8 ${doctor.bg} rounded-bl-full w-24 h-24 -z-10`} />
              
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-2xl ${doctor.bg} ${doctor.glow} flex items-center justify-center mb-4`}>
                  <Stethoscope className={`h-6 w-6 ${doctor.color}`} />
                </div>
                <CardTitle className="text-xl font-bold">{doctor.name}</CardTitle>
                <CardDescription className={`font-semibold ${doctor.color} uppercase tracking-wider text-xs mt-1`}>{doctor.specialty}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-zinc-300 font-medium">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> {doctor.rating} / 5.0
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    <MapPin className="h-4 w-4" /> {doctor.location}
                  </div>
                  <div className="font-bold text-white text-lg">
                    {doctor.price}
                  </div>
                </div>

                <button 
                  onClick={() => setBookingDoctor(doctor)}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <CalendarDays size={18} />
                  Book Now
                </button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {filteredDoctors.length === 0 && (
        <div className="text-center py-20 text-zinc-500 font-medium">
          No healthcare professionals found matching your search.
        </div>
      )}

      {/* Booking Modal */}
      <Modal 
        isOpen={!!bookingDoctor} 
        onClose={() => setBookingDoctor(null)} 
        title={`Book Appointment`} 
        description={bookingDoctor ? `Schedule a consultation with ${bookingDoctor.name}` : ""}
      >
        <form onSubmit={handleBook} className="space-y-6 mt-4">
          <div>
            <label className="block text-sm font-bold text-zinc-300 uppercase tracking-wide mb-2">Select Date</label>
            <input 
              required
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full p-4 rounded-2xl bg-zinc-900/50 border border-zinc-700/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-zinc-300 uppercase tracking-wide mb-2">Select Time</label>
            <select 
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full p-4 rounded-2xl bg-zinc-900/50 border border-zinc-700/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-white"
            >
              <option>09:00 AM</option>
              <option>10:30 AM</option>
              <option>05:00 PM</option>
              <option>06:00 PM</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all active:scale-[0.98]"
          >
            Confirm Booking
          </button>
        </form>
      </Modal>
    </div>
  )
}
