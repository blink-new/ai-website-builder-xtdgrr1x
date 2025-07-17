import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { CodePreview } from './CodePreview'
import { CodeGeneratorService } from '../services/codeGenerator'
import type { Message, GeneratedComponent } from '../types/app'
import { 
  ArrowLeft, 
  Send, 
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

export function BuilderInterface({ initialPrompt, onBackToLanding }: BuilderInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'user',
      content: initialPrompt,
      timestamp: new Date()
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const [currentComponent, setCurrentComponent] = useState<GeneratedComponent | null>(null)
  const [codeGenerator] = useState(() => CodeGeneratorService.getInstance())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateComponent = useCallback(async (prompt: string, isInitial = false) => {
    setIsGenerating(true)
    
    try {
      const response = await codeGenerator.generateComponent({
        prompt,
        existingCode: currentComponent?.code,
        context: isInitial ? 'This is the initial component generation for a new project.' : undefined
      })

      if (response.success) {
        const newComponent: GeneratedComponent = {
          id: Date.now().toString(),
          name: response.componentName,
          code: response.code,
          preview: response.preview,
          timestamp: new Date()
        }
        
        setCurrentComponent(newComponent)
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `I've generated a ${response.componentName} component for you! ${response.preview}`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `I encountered an error while generating the component: ${response.error}. Please try rephrasing your request.`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I encountered an unexpected error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsGenerating(false)
    }
  }, [codeGenerator, currentComponent])

  // Generate initial component on mount
  useEffect(() => {
    if (initialPrompt && !currentComponent) {
      generateComponent(initialPrompt, true)
    }
  }, [initialPrompt, currentComponent, generateComponent])

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
    const messageToProcess = currentMessage
    setCurrentMessage('')

    await generateComponent(messageToProcess)
  }

  const handleRegenerateComponent = () => {
    if (currentComponent) {
      generateComponent('Regenerate this component with improvements and better design')
    }
  }

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
          <CodePreview
            code={currentComponent?.code || ''}
            componentName={currentComponent?.name || 'Component'}
            preview={currentComponent?.preview || 'No component generated yet'}
            isGenerating={isGenerating}
            onRegenerate={handleRegenerateComponent}
          />
        </div>
      </div>
    </div>
  )
}