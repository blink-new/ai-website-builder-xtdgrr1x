import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Sparkles, Code, Smartphone, Zap, Globe, Palette } from 'lucide-react'

interface LandingPageProps {
  onStartBuilding: (prompt: string) => void
}

export function LandingPage({ onStartBuilding }: LandingPageProps) {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      onStartBuilding(prompt.trim())
    }
  }

  const examplePrompts = [
    "Build a modern SaaS landing page with pricing tiers",
    "Create a task management app like Todoist",
    "Design a portfolio website for a photographer",
    "Build a real-time chat application",
    "Create an e-commerce product catalog",
    "Design a dashboard for analytics"
  ]

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI-Powered Generation",
      description: "Describe your app in natural language and watch it come to life"
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Clean Code Export",
      description: "Get production-ready React code that you can customize and deploy"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Responsive Design",
      description: "Every app is built mobile-first with perfect responsive behavior"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-time Preview",
      description: "See your changes instantly with live preview and editing"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "One-Click Deploy",
      description: "Deploy your app to the web with a single click"
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Custom Styling",
      description: "Fine-tune colors, fonts, and layouts to match your brand"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">AI Builder</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                Beta
              </Badge>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              ✨ Powered by Advanced AI
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              Build Web Apps with
              <span className="text-primary block">Natural Language</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Describe your app idea and watch our AI create a fully functional web application 
              with modern design, clean code, and responsive layout.
            </p>
          </div>

          {/* Main Input */}
          <form onSubmit={handleSubmit} className="mb-12">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the web app you want to build..."
                  className="h-14 text-lg pr-32 bg-background border-2 border-border focus:border-primary transition-colors"
                />
                <Button 
                  type="submit" 
                  disabled={!prompt.trim()}
                  className="absolute right-2 top-2 h-10 px-6"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Build App
                </Button>
              </div>
            </div>
          </form>

          {/* Example Prompts */}
          <div className="mb-16">
            <p className="text-sm text-muted-foreground mb-4">Try these examples:</p>
            <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
              {examplePrompts.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(example)}
                  className="text-sm hover:bg-primary/5 hover:border-primary/30"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to build amazing apps</h2>
            <p className="text-lg text-muted-foreground">
              From idea to deployment in minutes, not months
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="text-primary mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">AI Builder</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for developers and creators everywhere
          </p>
        </div>
      </footer>
    </div>
  )
}