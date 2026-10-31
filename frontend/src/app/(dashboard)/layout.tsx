"use client"
import Link from "next/link"
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { Home, Activity, Droplet, Moon, Apple, Calendar, Bot, Stethoscope, Trophy, Sparkles, UserCircle, ShoppingCart, LogOut } from "lucide-react"
import { useUser } from "@/context/UserContext"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useUser()

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-hidden bg-transparent">
        <Sidebar className="border-none bg-transparent">
          <SidebarContent className="p-4 h-full">
            <div className="glass-panel h-full rounded-3xl overflow-hidden flex flex-col relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-indigo-500/10 before:to-transparent before:pointer-events-none shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)]">
              
              <div className="p-6 flex items-center gap-3">
                <h2 className="text-xl font-black tracking-tight flex items-center gap-1 whitespace-nowrap">
                  <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">HealthVerse AI</span>
                  <span className="text-white drop-shadow-sm">🩺🤖</span>
                </h2>
              </div>

              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-bold uppercase tracking-widest text-zinc-400/80 mb-2 px-6">Health & Analytics</SidebarGroupLabel>
                <SidebarGroupContent className="px-4">
                  <SidebarMenu className="space-y-1">
                    <SidebarMenuItem>
                      <Link href="/profile" className="block">
                        <SidebarMenuButton className="py-6 rounded-2xl hover:bg-white/5 dark:hover:bg-white/10 transition-all duration-300 group">
                          <UserCircle className="text-rose-400 group-hover:scale-110 group-hover:text-rose-300 transition-transform" /> 
                          <span className="font-semibold text-zinc-300 group-hover:text-white ml-2 text-base">Profile and Settings</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link href="/" className="block">
                        <SidebarMenuButton className="py-6 rounded-2xl hover:bg-white/5 dark:hover:bg-white/10 transition-all duration-300 group">
                          <Home className="text-indigo-400 group-hover:scale-110 group-hover:text-indigo-300 transition-transform" /> 
                          <span className="font-semibold text-zinc-300 group-hover:text-white ml-2 text-base">Dashboard</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link href="/meals" className="block">
                        <SidebarMenuButton className="py-6 rounded-2xl hover:bg-white/5 dark:hover:bg-white/10 transition-all duration-300 group">
                          <Apple className="text-pink-400 group-hover:scale-110 group-hover:text-pink-300 transition-transform" /> 
                          <span className="font-semibold text-zinc-300 group-hover:text-white ml-2 text-base">Meals & Diet</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link href="/workouts" className="block">
                        <SidebarMenuButton className="py-6 rounded-2xl hover:bg-white/5 dark:hover:bg-white/10 transition-all duration-300 group">
                          <Activity className="text-emerald-400 group-hover:scale-110 group-hover:text-emerald-300 transition-transform" /> 
                          <span className="font-semibold text-zinc-300 group-hover:text-white ml-2 text-base">Workouts</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link href="/water" className="block">
                        <SidebarMenuButton className="py-6 rounded-2xl hover:bg-white/5 dark:hover:bg-white/10 transition-all duration-300 group">
                          <Droplet className="text-cyan-400 group-hover:scale-110 group-hover:text-cyan-300 transition-transform" /> 
                          <span className="font-semibold text-zinc-300 group-hover:text-white ml-2 text-base">Hydration</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link href="/sleep" className="block">
                        <SidebarMenuButton className="py-6 rounded-2xl hover:bg-white/5 dark:hover:bg-white/10 transition-all duration-300 group">
                          <Moon className="text-purple-400 group-hover:scale-110 group-hover:text-purple-300 transition-transform" /> 
                          <span className="font-semibold text-zinc-300 group-hover:text-white ml-2 text-base">Sleep</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link href="/directory" className="block">
                        <SidebarMenuButton className="py-6 rounded-2xl hover:bg-white/5 dark:hover:bg-white/10 transition-all duration-300 group">
                          <Stethoscope className="text-yellow-400 group-hover:scale-110 group-hover:text-yellow-300 transition-transform" /> 
                          <span className="font-semibold text-zinc-300 group-hover:text-white ml-2 text-base">Find a Doctor</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link href="/challenges" className="block">
                        <SidebarMenuButton className="py-6 rounded-2xl hover:bg-white/5 dark:hover:bg-white/10 transition-all duration-300 group">
                          <Trophy className="text-amber-500 group-hover:scale-110 group-hover:text-amber-400 transition-transform" /> 
                          <span className="font-semibold text-zinc-300 group-hover:text-white ml-2 text-base">Challenges</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link href="/community" className="block">
                        <SidebarMenuButton className="py-6 rounded-2xl hover:bg-white/5 dark:hover:bg-white/10 transition-all duration-300 group">
                          <Sparkles className="text-fuchsia-400 group-hover:scale-110 group-hover:text-fuchsia-300 transition-transform" /> 
                          <span className="font-semibold text-zinc-300 group-hover:text-white ml-2 text-base">Community</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link href="/store" className="block">
                        <SidebarMenuButton className="py-6 rounded-2xl hover:bg-white/5 dark:hover:bg-white/10 transition-all duration-300 group">
                          <ShoppingCart className="text-blue-400 group-hover:scale-110 group-hover:text-blue-300 transition-transform" /> 
                          <span className="font-semibold text-zinc-300 group-hover:text-white ml-2 text-base">Store & Pro</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <div className="mt-auto p-4 space-y-2">
                <Link href="/ai-nutritionist" className="block w-full">
                  <button className="w-full relative group overflow-hidden rounded-2xl p-px">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center justify-center gap-2 bg-zinc-950 px-4 py-4 rounded-2xl transition-colors">
                      <Bot className="text-purple-300" />
                      <span className="font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">AI Assistant</span>
                    </div>
                  </button>
                </Link>
                
                <button 
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold px-4 py-3 rounded-2xl transition-colors border border-red-500/20"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pt-6">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
