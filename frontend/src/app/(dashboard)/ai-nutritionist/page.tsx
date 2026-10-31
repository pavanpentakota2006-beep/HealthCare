"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Sparkles, RefreshCw, Zap } from "lucide-react"
import { apiRequest } from "@/lib/api"

const SUGGESTED_PROMPTS = [
  "🥑 High-protein breakfast under 500 kcal",
  "💧 Daily hydration strategy for focus",
  "🏋️ 25-minute metabolic HIIT circuit",
  "🥗 Anti-inflammatory dinner meal ideas",
  "🛌 Evidence-based sleep quality tips"
]

export default function AiNutritionist() {
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: "Hello! I am your AI Nutritionist and Health Coach. Ask me anything about macronutrients, personalized meal ideas, workout programming, or wellness optimization!" 
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const sendPrompt = async (textToSend: string) => {
    if (!textToSend.trim()) return

    const userMessage = { role: "user", content: textToSend }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const data = await apiRequest('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: textToSend })
      })
      
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || "I didn't get a response." }])
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I am having trouble connecting to my neural network right now. Please try again later." }])
    } finally {
      setLoading(false)
    }
  }

  const handleSend = () => {
    sendPrompt(input)
  }

  const handleClear = () => {
    setMessages([
      { 
        role: "assistant", 
        content: "Conversation reset. How can I assist you with your health & diet today?" 
      }
    ])
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Nutritionist & Coach
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-1.5">
            <Sparkles size={16} className="text-yellow-400" />
            24/7 intelligent diet, fitness, and metabolic guidance
          </p>
        </div>

        <button 
          onClick={handleClear}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors"
          title="Clear Conversation"
        >
          <RefreshCw size={13} /> Clear
        </button>
      </div>

      {/* Suggested Prompts Pills */}
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => sendPrompt(prompt)}
            disabled={loading}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      <Card className="glass-panel border border-zinc-800 rounded-3xl h-[620px] flex flex-col overflow-hidden shadow-2xl">
        <CardHeader className="py-4 border-b border-zinc-800/80 bg-zinc-950/40">
          <CardTitle className="text-lg font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-indigo-400" />
              </div>
              <span>Coach Assistant</span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto space-y-4 p-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`p-2.5 rounded-2xl flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-zinc-800 text-purple-300'}`}>
                  {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div className={`p-4 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-zinc-900/90 text-zinc-200 border border-zinc-800 rounded-tl-none shadow-sm'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3 max-w-[85%]">
                <div className="p-2.5 rounded-2xl bg-zinc-800 text-purple-300">
                  <Bot className="h-5 w-5 animate-spin" />
                </div>
                <div className="p-4 rounded-3xl bg-zinc-900/90 text-zinc-400 border border-zinc-800 rounded-tl-none text-sm animate-pulse flex items-center gap-2">
                  <Zap size={14} className="text-yellow-400" /> Formulating nutritional advice...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <CardFooter className="p-4 border-t border-zinc-800 bg-zinc-950/40">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="flex w-full items-center gap-3"
          >
            <Input 
              placeholder="Ask about calories, macros, workouts, or meal suggestions..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 rounded-2xl py-6 bg-zinc-900/70 border-zinc-700/60 focus:border-indigo-500 text-white"
            />
            <Button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="rounded-2xl px-6 py-6 bg-gradient-to-r from-indigo-500 to-purple-500 font-bold hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all"
            >
              <Send className="h-4 w-4 mr-1.5" />
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
