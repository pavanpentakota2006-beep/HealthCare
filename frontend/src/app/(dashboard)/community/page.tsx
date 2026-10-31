"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Send, UserCircle, Sparkles, Trash2 } from "lucide-react"
import { apiRequest } from "@/lib/api"

const initialCommunityPosts = [
  {
    id: "post-seed-1",
    content: "Just finished a 45-minute HIIT interval session! Staying consistent with high hydration and recovery is key. Let's crush this week!",
    user: { profile: { firstName: "Sarah", lastName: "Jenkins" } },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    comments: [
      {
        id: "c-1",
        content: "Awesome work Sarah! Hydration makes a huge difference in muscle recovery.",
        user: { profile: { firstName: "Dr. Priya", lastName: "Sharma" } }
      }
    ],
    _count: { likes: 12, comments: 1 }
  },
  {
    id: "post-seed-2",
    content: "Tip from your dietitian: try pairing complex carbohydrates with healthy fats (like avocado toast + poached eggs) to stabilize blood sugar spikes throughout the morning.",
    user: { profile: { firstName: "Dt. Kavya", lastName: "Nair" } },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    comments: [],
    _count: { likes: 24, comments: 3 }
  }
]

export default function CommunityFeed() {
  const [posts, setPosts] = useState<any[]>(initialCommunityPosts)
  const [newPost, setNewPost] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchPosts = async () => {
    try {
      const data = await apiRequest('/community/posts').catch(() => null)
      if (Array.isArray(data) && data.length > 0) {
        setPosts(data)
      }
    } catch (err) {
      console.error("Failed to load community posts", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
    
    // Poll every 3 seconds to catch AI replies and likes in "real-time"
    const interval = setInterval(() => {
      fetchPosts()
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  const handlePost = async () => {
    if (!newPost.trim()) return
    
    // Optimistic UI update
    const optimisticPost = {
      id: Date.now().toString(),
      content: newPost,
      user: { profile: { firstName: "You" } },
      createdAt: new Date().toISOString(),
      comments: [],
      _count: { likes: 0, comments: 0 }
    }
    setPosts([optimisticPost, ...posts])
    setNewPost("")

    try {
      await apiRequest('/community/posts', {
        method: 'POST',
        body: JSON.stringify({ content: newPost })
      })
      fetchPosts() // refresh to get real ID and trigger AI
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return
    try {
      await apiRequest(`/community/comments/${commentId}`, { method: 'DELETE' })
      fetchPosts()
    } catch (err) {
      console.error("Failed to delete comment", err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Community Feed</h1>
        <p className="text-muted-foreground">Share your progress and cheer on friends!</p>
      </div>

      <Card className="glass mb-8">
        <CardContent className="p-4 flex gap-4">
          <Input 
            placeholder="What's on your mind? Share a workout or milestone!" 
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handlePost()}
          />
          <Button onClick={handlePost} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90">
            <Send className="h-4 w-4 mr-2" /> Post
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {loading && <p>Loading feed...</p>}
        {!loading && posts.length === 0 && (
          <p className="text-muted-foreground text-center py-10">No posts yet. Be the first to share!</p>
        )}
        
        {posts.map(post => (
          <Card key={post.id} className="glass overflow-hidden relative group">
            <button 
              onClick={async () => {
                if (!confirm("Are you sure you want to delete this post?")) return
                try {
                  await apiRequest(`/community/posts/${post.id}`, { method: 'DELETE' })
                  fetchPosts()
                } catch (err) {
                  console.error("Failed to delete post", err)
                }
              }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-rose-400 transition-colors p-2 bg-black/10 rounded-full"
              title="Delete Post"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <CardHeader className="pb-3 flex flex-row items-center gap-4">
              <div className="bg-indigo-500/10 p-3 rounded-full">
                <UserCircle className="h-6 w-6 text-indigo-500" />
              </div>
              <div>
                <CardTitle className="text-lg">{post.user?.profile?.firstName || 'Anonymous Member'}</CardTitle>
                <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-200">{post.content}</p>
            </CardContent>
            <CardFooter className="pt-0 flex flex-col items-start gap-4 text-muted-foreground border-t border-white/5 mt-4 pt-4">
              <div className="flex gap-4 w-full">
                <button className="flex items-center gap-1 hover:text-pink-500 transition-colors">
                  <Heart className={`h-5 w-5 ${post._count?.likes > 0 ? 'fill-pink-500 text-pink-500' : ''}`} /> 
                  <span className={post._count?.likes > 0 ? 'text-pink-500 font-medium' : ''}>{post._count?.likes || 0}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-indigo-400 transition-colors">
                  <MessageCircle className="h-5 w-5" /> {post._count?.comments || 0}
                </button>
              </div>
              
              {/* Render Comments */}
              {post.comments && post.comments.length > 0 && (
                <div className="w-full mt-4 space-y-3 bg-black/20 p-4 rounded-xl">
                  {post.comments.map((comment: any) => (
                    <div key={comment.id} className="flex gap-3 group">
                      <div className="bg-purple-500/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                        {comment.user?.profile?.firstName?.includes("Coach") ? (
                          <Sparkles className="h-4 w-4 text-purple-400" />
                        ) : (
                          <UserCircle className="h-4 w-4 text-purple-400" />
                        )}
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 w-full text-sm relative pr-10">
                        <p className="font-medium text-purple-300 mb-1">
                          {comment.user?.profile?.firstName || 'User'}
                        </p>
                        <p className="text-zinc-300">{comment.content}</p>
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="absolute top-3 right-3 text-rose-400 hover:text-rose-500 transition-colors p-1"
                          title="Delete Comment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
