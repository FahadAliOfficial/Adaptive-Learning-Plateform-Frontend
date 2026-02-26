import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Brain, Target, TrendingUp, Zap, ArrowRight, CheckCircle2, BookOpen, Users, Award, Sparkles, BarChart3, Lightbulb, Code2, Rocket, Star, Quote } from "lucide-react"

export default function Home() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "LearnRL"

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white mx-auto">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-yellow-500/5 to-green-500/10 animate-gradient" />
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-40 dark:opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-green-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-40 dark:opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-[500px] h-[500px] bg-yellow-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-40 dark:opacity-20 animate-blob animation-delay-4000" />
        
        <div className="container mx-auto relative px-4 py-20 md:py-32 z-10">
          <div className="mx-auto max-w-5xl text-center space-y-10">
            {/* Badge */}
            <div className="inline-block animate-fade-in-down">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/20 to-green-500/20 dark:from-blue-500/30 dark:to-green-500/30 px-5 py-2.5 backdrop-blur-xl border border-blue-500/40 shadow-2xl shadow-blue-500/20">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500">
                  <Zap className="h-3.5 w-3.5 text-slate-900 animate-pulse" />
                </div>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  AI-Powered Adaptive Learning
                </span>
              </div>
            </div>
            
            {/* Main Heading */}
            <div className="space-y-6 animate-fade-in-up">
              <h1 className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1] text-slate-900 dark:text-white">
                Master Programming
                <br />
                <span className="inline-block mt-2 bg-gradient-to-r from-blue-600 via-green-500 to-yellow-500 bg-clip-text text-transparent animate-gradient-x">
                  with {siteName}
                </span>
              </h1>
              
              <p className="mx-auto max-w-3xl text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Transform your coding skills with{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-blue-600 dark:text-blue-400 font-bold">Reinforcement Learning</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-gradient-to-r from-blue-400/30 to-green-400/30 -z-10" />
                </span>
                {" "}powered education
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-700 dark:text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Personalized Learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Smart Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Real-time Feedback</span>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-in animation-delay-500 pt-4">
              <Button 
                size="lg" 
                className="h-16 px-12 text-lg font-semibold shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white relative overflow-hidden group rounded-2xl"
                asChild
              >
                <Link href="/register">
                  <span className="relative z-10 flex items-center gap-3">
                    Get Started Free
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="h-16 px-12 text-lg font-semibold border-2 border-blue-500/50 dark:border-blue-500 bg-white dark:bg-transparent text-blue-600 dark:text-blue-400 hover:border-blue-600 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 hover:scale-105 transition-all duration-300 backdrop-blur-sm rounded-2xl"
                asChild
              >
                <Link href="/login" className="flex items-center gap-2">
                  Sign In
                </Link>
              </Button>
            </div>
            
            {/* Social Proof */}
            <div className="pt-8 animate-fade-in animation-delay-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Trusted by developers worldwide</p>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">10K+</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Active Learners</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">50K+</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Tests Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">4.9/5</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-32 bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                <Brain className="h-4 w-4" />
                Features
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Why Choose {siteName}?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Experience the future of programming education with our intelligent learning platform powered by cutting-edge AI
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <Card className="relative overflow-hidden border-2 border-blue-100 dark:border-blue-900/50 hover:border-blue-500 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-2 group bg-white dark:bg-slate-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/30 to-transparent rounded-bl-full group-hover:w-40 group-hover:h-40 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative z-10">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl mb-2 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Learn Faster with RL</CardTitle>
                <CardDescription className="leading-relaxed text-slate-600 dark:text-slate-400">
                  Our reinforcement learning algorithm adapts to your learning style and pace, optimizing your educational journey
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="relative overflow-hidden border-2 border-green-100 dark:border-green-900/50 hover:border-green-500 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/30 hover:-translate-y-2 group bg-white dark:bg-slate-800 animation-delay-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/30 to-transparent rounded-bl-full group-hover:w-40 group-hover:h-40 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative z-10">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center mb-4 shadow-lg shadow-green-500/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl mb-2 text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">MCQ Based Learning</CardTitle>
                <CardDescription className="leading-relaxed text-slate-600 dark:text-slate-400">
                  Master concepts through carefully crafted multiple-choice questions that test your understanding and reinforce learning
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="relative overflow-hidden border-2 border-yellow-100 dark:border-yellow-900/50 hover:border-yellow-500 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/30 hover:-translate-y-2 group bg-white dark:bg-slate-800 animation-delay-400">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/30 to-transparent rounded-bl-full group-hover:w-40 group-hover:h-40 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative z-10">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-400 flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <TrendingUp className="h-7 w-7 text-slate-900" />
                </div>
                <CardTitle className="text-xl mb-2 text-slate-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">Smart Reports & Insights</CardTitle>
                <CardDescription className="leading-relaxed text-slate-600 dark:text-slate-400">
                  Get detailed analytics on your performance, identify weak areas, and receive personalized recommendations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-b from-green-50/50 via-white to-blue-50/50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-50/30 to-transparent dark:via-green-900/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-[120px] opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500 rounded-full filter blur-[120px] opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold sm:text-4xl text-slate-900 dark:text-white">
                Everything You Need to Excel
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                {siteName} provides a comprehensive learning environment designed to help you master programming efficiently
              </p>
              
              <div className="space-y-5">
                {[
                  "Personalized learning paths tailored to your skill level",
                  "Real-time performance tracking and analytics",
                  "Topic-based recommendations powered by AI",
                  "Comprehensive question bank covering all concepts",
                  "Detailed explanations for every question",
                  "Progress monitoring across multiple languages"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/50 group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-green-500 opacity-20 blur-[100px] rounded-3xl" />
              <Card className="relative p-10 shadow-2xl shadow-blue-500/20 bg-white dark:bg-slate-800 border-2 border-blue-200/50 dark:border-blue-800/50 rounded-3xl hover:shadow-blue-500/30 hover:border-blue-400/50 transition-all duration-500">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Your Progress</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">85%</span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-blue-600 to-green-500 shadow-lg shadow-blue-500/50" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">42</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Topics Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">92%</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-500">15</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Days Streak</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Programming Languages Section */}
      <section className="container mx-auto px-4 py-32 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 text-sm font-semibold">
                <Code2 className="h-4 w-4" />
                Supported Languages
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Master Multiple Languages
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Learn and practice with a wide range of programming languages, all in one platform
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: "Python", color: "from-blue-500 to-yellow-500", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
              { name: "JavaScript", color: "from-yellow-400 to-yellow-500", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
              { name: "Java", color: "from-red-600 to-orange-500", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
              { name: "C++", color: "from-blue-700 to-blue-500", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
              { name: "Go", color: "from-cyan-500 to-blue-500", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" }
            ].map((lang, index) => (
              <Card key={index} className="relative overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 group bg-white dark:bg-slate-800">
                <CardContent className="p-6 text-center">
                  <div className="mb-3 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                    <img 
                      src={lang.logo} 
                      alt={`${lang.name} logo`} 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {lang.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-32 overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900">
        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-7xl">
            <div className="text-center space-y-6 mb-20">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-sm font-semibold">
                  <Lightbulb className="h-4 w-4" />
                  How It Works
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Start Learning in 3 Simple Steps
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Choose Your Path",
                  description: "Select a programming language and difficulty level that matches your current skills",
                  icon: BookOpen,
                  color: "blue"
                },
                {
                  step: "02",
                  title: "Take Smart Tests",
                  description: "Our AI generates personalized MCQ tests that adapt to your learning progress",
                  icon: Brain,
                  color: "green"
                },
                {
                  step: "03",
                  title: "Track & Improve",
                  description: "Get detailed insights and recommendations to accelerate your learning journey",
                  icon: TrendingUp,
                  color: "yellow"
                }
              ].map((item, index) => (
                <div key={index} className="relative group">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${
                    item.color === "blue" ? "from-blue-600 to-blue-400" :
                    item.color === "green" ? "from-green-600 to-green-400" :
                    "from-yellow-500 to-yellow-400"
                  } rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500`} />
                  <Card className="relative h-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl">
                    <CardContent className="p-8 space-y-6">
                      <div className="flex items-start justify-between">
                        <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${
                          item.color === "blue" ? "from-blue-600 to-blue-500" :
                          item.color === "green" ? "from-green-600 to-green-500" :
                          "from-yellow-500 to-yellow-400"
                        } flex items-center justify-center shadow-lg shadow-${item.color}-500/50`}>
                          <item.icon className="h-8 w-8 text-white" />
                        </div>
                        <span className={`text-5xl font-black ${
                          item.color === "blue" ? "text-blue-200 dark:text-blue-900/50" :
                          item.color === "green" ? "text-green-200 dark:text-green-900/50" :
                          "text-yellow-200 dark:text-yellow-900/50"
                        }`}>
                          {item.step}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-32 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "10K+", label: "Active Students", color: "blue" },
              { icon: BookOpen, value: "5K+", label: "MCQ Questions", color: "green" },
              { icon: Award, value: "50K+", label: "Tests Completed", color: "yellow" },
              { icon: Star, value: "4.9/5", label: "Student Rating", color: "blue" }
            ].map((stat, index) => (
              <Card key={index} className="relative overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 bg-white dark:bg-slate-800 group">
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  stat.color === "blue" ? "from-blue-500/5 to-blue-500/0" :
                  stat.color === "green" ? "from-green-500/5 to-green-500/0" :
                  "from-yellow-500/5 to-yellow-500/0"
                } opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <CardContent className="p-8 text-center space-y-4 relative z-10">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${
                    stat.color === "blue" ? "from-blue-600 to-blue-500" :
                    stat.color === "green" ? "from-green-600 to-green-500" :
                    "from-yellow-500 to-yellow-400"
                  } shadow-lg mb-2 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-7 w-7 ${stat.color === "yellow" ? "text-slate-900" : "text-white"}`} />
                  </div>
                  <div className={`text-4xl font-black ${
                    stat.color === "blue" ? "text-blue-600 dark:text-blue-400" :
                    stat.color === "green" ? "text-green-600 dark:text-green-400" :
                    "text-yellow-500"
                  }`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-32 overflow-hidden bg-gradient-to-b from-green-50/50 via-white to-blue-50/50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-[120px] opacity-20" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-green-500 rounded-full filter blur-[120px] opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-7xl">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                  <Star className="h-4 w-4 fill-current" />
                  Testimonials
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                What Students Say
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Computer Science Student",
                  content: "LearnRL completely transformed how I study programming. The adaptive learning approach helped me improve my Python skills by 80% in just 2 months!",
                  rating: 5
                },
                {
                  name: "Michael Chen",
                  role: "Software Developer",
                  content: "The personalized MCQ tests are brilliant! They focus on exactly what I need to learn. I passed my JavaScript certification with flying colors.",
                  rating: 5
                },
                {
                  name: "Emma Williams",
                  role: "Self-Taught Developer",
                  content: "As a self-learner, LearnRL gave me the structure I needed. The detailed analytics help me track my progress and stay motivated every day.",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <Card key={index} className="relative border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 bg-white dark:bg-slate-800 group">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <Quote className="h-10 w-10 text-blue-500/20" />
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-32 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-green-500 to-yellow-500 p-1 shadow-2xl shadow-blue-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-green-500/30 blur-3xl" />
            <Card className="relative border-0 bg-gradient-to-br from-blue-600 to-green-600 text-white shadow-none rounded-[2.4rem]">
              <CardContent className="p-16 text-center space-y-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
                  <Rocket className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                  Ready to Transform Your Learning?
                </h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of students already improving their programming skills with {siteName}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button size="lg" className="h-14 px-10 text-lg font-semibold bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all shadow-xl rounded-2xl" asChild>
                    <Link href="/register">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" className="h-14 px-10 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 transition-all shadow-xl rounded-2xl" asChild>
                    <Link href="/login">
                      Sign In
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            <p>&copy; 2026 {siteName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
