"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, Check, Sparkles, Zap, Target, Palette, Rocket } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LinkedInPostGenerator() {
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("Professional")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentPost, setCurrentPost] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const generatePost = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for your LinkedIn post.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      console.log("Generating post with:", { topic, tone })
      const response = await fetch("https://linkedinpost-z0j1.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, tone }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setCurrentPost(data.post)

      toast({
        title: "Post generated!",
        description: "Your LinkedIn post has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentPost)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied!",
        description: "Post copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const clearPost = () => {
    setCurrentPost("")
    setTopic("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 via-blue-50 to-cyan-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full backdrop-blur-sm shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              LinkedIn Post Generator
            </h1>
          </div>
          <p className="text-xl text-pink-100 max-w-2xl mx-auto leading-relaxed">
            Create engaging, professional LinkedIn posts with AI assistance. Perfect for developers, entrepreneurs, and
            professionals.
          </p>
          <div className="flex items-center justify-center gap-8 mt-8 text-pink-100">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Zap className="h-5 w-5 text-yellow-300" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Target className="h-5 w-5 text-green-300" />
              <span>Professional</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Palette className="h-5 w-5 text-purple-300" />
              <span>Creative</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 -mt-8 relative z-10">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 via-blue-500 to-cyan-500"></div>
          <CardHeader className="text-center pb-8 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
              Generate Your Post
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Enter your topic and select the tone to create compelling LinkedIn content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            {/* Input Form */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label
                  htmlFor="topic"
                  className="text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                  Topic
                </Label>
                <Input
                  id="topic"
                  placeholder="e.g., Remote work productivity tips"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="h-12 text-base border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-200 transition-all duration-200 bg-gradient-to-r from-purple-50 to-pink-50"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="tone"
                  className="text-base font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                >
                  Tone
                </Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="h-12 border-2 border-green-200 focus:border-green-500 bg-gradient-to-r from-green-50 to-blue-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        Professional
                      </div>
                    </SelectItem>
                    <SelectItem value="Casual">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"></div>
                        Casual
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <Button
                onClick={generatePost}
                disabled={isGenerating}
                className="h-16 px-12 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-0"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                    <Rocket className="h-5 w-5 mr-2 animate-bounce" />
                    Generating Your Post...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-6 w-6 mr-3 animate-pulse" />
                    Generate LinkedIn Post
                    <Rocket className="h-5 w-5 ml-3" />
                  </>
                )}
              </Button>
            </div>

            {/* Generated Post Display */}
            {currentPost && (
              <>
                <Separator className="my-8 bg-gradient-to-r from-purple-200 to-pink-200 h-0.5" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        Your Generated Post
                      </h3>
                      <Badge
                        variant="secondary"
                        className={`${
                          tone === "Professional"
                            ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200"
                            : "bg-gradient-to-r from-green-100 to-cyan-100 text-green-800 border-green-200"
                        } font-semibold`}
                      >
                        {tone}
                      </Badge>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={copyToClipboard}
                        className="border-2 bg-gradient-to-r from-green-50 to-cyan-50 border-green-200 hover:border-green-400 hover:bg-gradient-to-r hover:from-green-100 hover:to-cyan-100 transition-all duration-200"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 mr-2 text-green-600" />
                            <span className="text-green-600 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2 text-green-600" />
                            <span className="text-green-600 font-semibold">Copy Post</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={clearPost}
                        className="border-2 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 transition-all duration-200"
                      >
                        <span className="text-purple-600 font-semibold">Generate New</span>
                      </Button>
                    </div>
                  </div>

                  <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-purple-200 shadow-xl">
                    <CardContent className="p-6">
                      <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
                        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-purple-100">
                          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            You
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-lg">Your LinkedIn Post</div>
                            <div className="text-sm bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-semibold">
                              Ready to share ✨
                            </div>
                          </div>
                        </div>
                        <div className="prose prose-lg max-w-none">
                          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-base">
                            {currentPost}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
            Powered by AI ✨ Built for professionals 🚀 Create engaging content in seconds ⚡
          </p>
        </div>
      </div>
    </div>
  )
}
