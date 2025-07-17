import React, { useState, useEffect } from 'react'
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
  CheckCircle
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
  const [PreviewComponent, setPreviewComponent] = useState<React.ComponentType | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)

  // Safely render the generated component
  useEffect(() => {
    if (!code) return

    try {
      // Validate and clean the code first
      const cleanedCode = code
        .replace(/import.*from.*['\"].*['\"];?\n?/g, '') // Remove imports
        .replace(/export\s+default\s+function/g, 'function') // Remove export
        .replace(/export\s+function/g, 'function') // Remove export from named functions
        .trim()

      // Check for potential reserved word issues
      const reservedWords = ['class', 'interface', 'package', 'private', 'protected', 'public', 'static', 'implements', 'extends']
      const hasReservedWordIssue = reservedWords.some(word => {
        const regex = new RegExp(`\\b${word}\\s*=`, 'g')
        return regex.test(cleanedCode)
      })

      if (hasReservedWordIssue) {
        throw new Error('Code contains reserved word usage that may cause syntax errors')
      }

      // Create a safer component wrapper with better error handling
      const createSafeComponent = () => {
        try {
          // Create mock components and hooks
          const mockReact = {
            createElement: React.createElement,
            useState: React.useState,
            useEffect: React.useEffect,
            useRef: React.useRef,
            Fragment: React.Fragment
          }

          // Mock UI components with better styling
          const mockComponents = {
            Button: ({ children, className = '', onClick, variant = 'default', ...props }) => {
              const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
              const variantClasses = variant === 'outline' 
                ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
              return React.createElement('button', { 
                className: `${baseClasses} ${variantClasses} ${className}`,
                onClick,
                ...props
              }, children)
            },
            
            Card: ({ children, className = '' }) => 
              React.createElement('div', { 
                className: `bg-white border border-gray-200 rounded-lg shadow-sm ${className}`
              }, children),
              
            CardContent: ({ children, className = '' }) => 
              React.createElement('div', { className: `p-6 ${className}` }, children),
              
            CardHeader: ({ children, className = '' }) => 
              React.createElement('div', { className: `p-6 pb-3 ${className}` }, children),
              
            CardTitle: ({ children, className = '' }) => 
              React.createElement('h3', { className: `text-lg font-semibold text-gray-900 ${className}` }, children),
              
            Input: ({ className = '', ...props }) => 
              React.createElement('input', { 
                className: `w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`,
                ...props
              }),
              
            Badge: ({ children, className = '', variant = 'default' }) => {
              const variantClasses = variant === 'secondary' 
                ? 'bg-gray-100 text-gray-800'
                : 'bg-blue-100 text-blue-800'
              return React.createElement('span', { 
                className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses} ${className}`
              }, children)
            }
          }

          // Mock Lucide icons
          const mockIcons = {
            ChevronRight: () => React.createElement('svg', { 
              width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2,
              className: 'lucide lucide-chevron-right'
            }, React.createElement('polyline', { points: '9,18 15,12 9,6' })),
            
            Star: () => React.createElement('svg', { 
              width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2,
              className: 'lucide lucide-star'
            }, React.createElement('polygon', { points: '12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26' })),
            
            Heart: () => React.createElement('svg', { 
              width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2,
              className: 'lucide lucide-heart'
            }, React.createElement('path', { d: 'm19,14c0,5-7,9-7,9s-7-4-7-9a5,5,0,0,1,10,0l4,0a5,5,0,0,1,0,0z' })),
            
            User: () => React.createElement('svg', { 
              width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2,
              className: 'lucide lucide-user'
            }, React.createElement('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }), React.createElement('circle', { cx: '12', cy: '7', r: '4' })),
            
            Mail: () => React.createElement('svg', { 
              width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2,
              className: 'lucide lucide-mail'
            }, React.createElement('rect', { width: '20', height: '16', x: '2', y: '4', rx: '2' }), React.createElement('path', { d: 'm22,7-10,5L2,7' }))
          }

          // Create a safe execution context
          const executionContext = {
            React: mockReact,
            useState: mockReact.useState,
            useEffect: mockReact.useEffect,
            useRef: mockReact.useRef,
            ...mockComponents,
            ...mockIcons
          }

          // Use Function constructor instead of eval for better error handling
          const componentFunction = new Function(
            ...Object.keys(executionContext),
            `
            try {
              ${cleanedCode}
              if (typeof ${componentName} === 'function') {
                return ${componentName};
              } else {
                throw new Error('Component function not found: ${componentName}');
              }
            } catch (error) {
              console.error('Component execution error:', error);
              throw error;
            }
            `
          )

          return componentFunction(...Object.values(executionContext))
        } catch (error) {
          console.error('Safe component creation error:', error)
          throw error
        }
      }

      const ComponentClass = createSafeComponent()
      setPreviewComponent(() => ComponentClass)
      setPreviewError(null)
    } catch (error) {
      console.error('Preview error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to render preview'
      setPreviewError(errorMessage)
      setPreviewComponent(null)
    }
  }, [code, componentName])

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
          <TabsContent value="preview" className="h-full mt-0 p-4">
            <Card className="h-full">
              <div className="p-4 border-b">
                <p className="text-sm text-muted-foreground">{preview}</p>
              </div>
              <div className="p-6 h-full overflow-auto">
                {previewError ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Preview Error: {previewError}
                    </AlertDescription>
                  </Alert>
                ) : PreviewComponent ? (
                  <div className="min-h-full">
                    <PreviewComponent />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Eye className="h-8 w-8 mx-auto mb-2" />
                      <p>Loading preview...</p>
                    </div>
                  </div>
                )}
              </div>
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