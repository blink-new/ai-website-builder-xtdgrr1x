import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { 
  ArrowLeft, 
  Send, 
  Smartphone, 
  Monitor, 
  Code, 
  Download, 
  Share, 
  Sparkles,
  Bot,
  User,
  Loader2
} from 'lucide-react'

interface BuilderInterfaceProps {
  initialPrompt: string
  onBackToLanding: () => void
}

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export function BuilderInterface({ initialPrompt, onBackToLanding }: BuilderInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'user',
      content: initialPrompt,
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'ai',
      content: "I'll help you build that web application! Let me start by creating the basic structure and components. This will include a modern design with responsive layout, interactive elements, and clean code architecture.",
      timestamp: new Date()
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentMessage.trim() || isGenerating) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsGenerating(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I understand your request. I'm updating the application with those changes. The new features will include improved styling, better user experience, and additional functionality as requested.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsGenerating(false)
    }, 2000)
  }

  const sampleCode = `import React, { useState } from 'react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your App</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Count: {count}</p>
              <Button onClick={() => setCount(count + 1)}>
                Increment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}`

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBackToLanding}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="font-semibold">AI Builder</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm">
              Deploy
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="w-96 border-r flex flex-col bg-background">
          <div className="p-4 border-b">
            <h2 className="font-semibold flex items-center">
              <Bot className="h-4 w-4 mr-2 text-primary" />
              AI Assistant
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Chat with AI to build and modify your app
            </p>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'ai' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {message.type === 'ai' ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-medium">
                      {message.type === 'ai' ? 'AI Assistant' : 'You'}
                    </div>
                    <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {isGenerating && (
                <div className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-medium">AI Assistant</div>
                    <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Generating response...
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
          
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Describe changes or ask questions..."
                disabled={isGenerating}
                className="flex-1"
              />
              <Button type="submit" size="sm" disabled={!currentMessage.trim() || isGenerating}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Preview/Code Panel */}
        <div className="flex-1 flex flex-col">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'preview' | 'code')}>
                <TabsList>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {activeTab === 'preview' && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'desktop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('desktop')}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'mobile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('mobile')}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 p-4">
            <Tabs value={activeTab} className="h-full">
              <TabsContent value="preview" className="h-full mt-0">
                <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className={`bg-background border rounded-lg shadow-lg transition-all duration-300 ${
                    viewMode === 'mobile' 
                      ? 'w-80 h-[600px]' 
                      : 'w-full h-full max-w-6xl'
                  }`}>
                    <div className="h-full flex flex-col">
                      {/* Mock Browser Header */}
                      <div className="flex items-center space-x-2 p-3 border-b bg-muted/50">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex-1 bg-background rounded px-3 py-1 text-sm text-muted-foreground">
                          localhost:3000
                        </div>
                      </div>
                      
                      {/* App Preview */}
                      <div className="flex-1 p-8 overflow-auto">
                        <div className="max-w-4xl mx-auto">
                          <Card>
                            <div className="p-6">
                              <h1 className="text-2xl font-bold mb-4">Welcome to Your App</h1>
                              <p className="text-muted-foreground mb-6">
                                This is a preview of your generated web application. 
                                You can interact with the AI to modify and enhance it.
                              </p>
                              <div className="space-y-4">
                                <Button className="w-full sm:w-auto">
                                  Get Started
                                </Button>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                                  {[1, 2, 3].map((i) => (
                                    <Card key={i} className="p-4">
                                      <h3 className="font-semibold mb-2">Feature {i}</h3>
                                      <p className="text-sm text-muted-foreground">
                                        Description of feature {i}
                                      </p>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="code" className="h-full mt-0">
                <Card className="h-full">
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4" />
                      <span className="font-medium">App.tsx</span>
                    </div>
                    <Badge variant="secondary">React + TypeScript</Badge>
                  </div>
                  <ScrollArea className="h-full">
                    <pre className="p-4 text-sm font-mono bg-muted/20 h-full overflow-auto">
                      <code>{sampleCode}</code>
                    </pre>
                  </ScrollArea>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}