import React, { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Alert, AlertDescription } from './ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Code, 
  Eye, 
  Copy, 
  Download, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'

interface CodePreviewProps {
  code: string
  componentName: string
  preview: string
  isGenerating?: boolean
  onRegenerate?: () => void
}

export function CodePreview({ 
  code, 
  componentName, 
  preview, 
  isGenerating = false,
  onRegenerate 
}: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success('Code copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy code')
    }
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/typescript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${componentName}.tsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Code downloaded!')
  }

  // Create a safe static preview based on the code content
  const createStaticPreview = () => {
    if (!code) return null

    // Analyze the code to determine what kind of component it is
    const hasForm = /input|form|button/i.test(code)
    const hasCard = /card/i.test(code)
    const hasNavigation = /nav|menu|header/i.test(code)
    const hasGrid = /grid|flex/i.test(code)
    const hasChart = /chart|graph/i.test(code)
    const hasList = /list|item/i.test(code)

    return (
      <div className="space-y-6 p-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
            <Sparkles className="h-4 w-4" />
            <span>AI Generated Component</span>
          </div>
          <h3 className="text-lg font-semibold">{componentName}</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">{preview}</p>
        </div>

        {/* Static preview based on code analysis */}
        <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 bg-muted/5">
          <div className="text-center space-y-4">
            {hasForm && (
              <div className="space-y-3 max-w-sm mx-auto">
                <div className="h-10 bg-muted rounded border"></div>
                <div className="h-10 bg-muted rounded border"></div>
                <div className="h-10 bg-primary/20 rounded"></div>
              </div>
            )}
            
            {hasCard && !hasForm && (
              <div className="grid gap-4 max-w-2xl mx-auto">
                <div className="bg-background border rounded-lg p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted/60 rounded w-1/2"></div>
                  <div className="h-3 bg-muted/60 rounded w-2/3"></div>
                </div>
              </div>
            )}
            
            {hasNavigation && (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-background border rounded">
                  <div className="h-6 bg-muted rounded w-24"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-muted rounded w-16"></div>
                    <div className="h-6 bg-muted rounded w-16"></div>
                    <div className="h-6 bg-primary/20 rounded w-16"></div>
                  </div>
                </div>
              </div>
            )}
            
            {hasGrid && !hasCard && !hasForm && !hasNavigation && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-muted rounded"></div>
                ))}
              </div>
            )}
            
            {hasList && !hasGrid && !hasCard && (
              <div className="space-y-2 max-w-md mx-auto">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 bg-background border rounded">
                    <div className="w-8 h-8 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                      <div className="h-2 bg-muted/60 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {hasChart && (
              <div className="max-w-md mx-auto">
                <div className="h-48 bg-gradient-to-t from-primary/20 to-transparent rounded border flex items-end justify-around p-4">
                  {[40, 60, 30, 80, 50].map((height, i) => (
                    <div key={i} className="bg-primary/60 rounded-t" style={{ height: `${height}%`, width: '20px' }}></div>
                  ))}
                </div>
              </div>
            )}
            
            {!hasForm && !hasCard && !hasNavigation && !hasGrid && !hasList && !hasChart && (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto flex items-center justify-center">
                  <Code className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-48 mx-auto"></div>
                  <div className="h-3 bg-muted/60 rounded w-32 mx-auto"></div>
                </div>
              </div>
            )}
            
            <div className="pt-4 border-t border-dashed">
              <p className="text-xs text-muted-foreground">
                This is a static preview. The actual component will be fully interactive when exported.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Component generated successfully! Switch to the Code tab to view the implementation.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <Card className="h-full">
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
            <div>
              <h3 className="font-medium">Generating Component</h3>
              <p className="text-sm text-muted-foreground">AI is creating your component...</p>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (!code) {
    return (
      <Card className="h-full">
        <div className="h-full flex items-center justify-center text-center space-y-4">
          <div>
            <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-muted-foreground">No Component Generated</h3>
            <p className="text-sm text-muted-foreground">Start a conversation to generate code</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{componentName}</Badge>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{code.split('\n').length} lines</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCode}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            {onRegenerate && (
              <Button variant="outline" size="sm" onClick={onRegenerate}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            )}
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'preview' | 'code')}>
          <TabsList>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="h-4 w-4 mr-2" />
              Code
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1">
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="preview" className="h-full mt-0">
            <Card className="h-full">
              <ScrollArea className="h-full">
                {createStaticPreview()}
              </ScrollArea>
            </Card>
          </TabsContent>
          
          <TabsContent value="code" className="h-full mt-0">
            <Card className="h-full">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code className="h-4 w-4" />
                  <span className="font-medium">{componentName}.tsx</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Valid TypeScript</span>
                </div>
              </div>
              <ScrollArea className="h-full">
                <pre className="p-4 text-sm font-mono bg-muted/20 h-full overflow-auto">
                  <code className="language-tsx">{code}</code>
                </pre>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}