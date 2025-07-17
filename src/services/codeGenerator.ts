import { blink } from '../blink/client'
import type { CodeGenerationRequest, CodeGenerationResponse } from '../types/app'

export class CodeGeneratorService {
  private static instance: CodeGeneratorService
  
  static getInstance(): CodeGeneratorService {
    if (!CodeGeneratorService.instance) {
      CodeGeneratorService.instance = new CodeGeneratorService()
    }
    return CodeGeneratorService.instance
  }

  async generateComponent(request: CodeGenerationRequest): Promise<CodeGenerationResponse> {
    try {
      const systemPrompt = `You are an expert React developer. Generate clean, modern React components using TypeScript and Tailwind CSS.

IMPORTANT RULES:
1. Always use TypeScript with proper types
2. Use Tailwind CSS for styling (already configured)
3. Use Lucide React for icons (already installed)
4. Make components responsive and accessible
5. Include proper error handling and loading states
6. Use modern React patterns (hooks, functional components)
7. Return ONLY the component code, no explanations
8. Component should be a default export
9. Use shadcn/ui components when appropriate (Button, Card, Input, etc.)
10. Make it production-ready and beautiful

Available shadcn/ui components: Button, Card, Input, Badge, Tabs, ScrollArea, Separator, Dialog, Sheet, Toast, and more.

Example structure:
\`\`\`tsx
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { SomeIcon } from 'lucide-react'

export default function ComponentName() {
  // Component logic here
  return (
    <div className="p-6">
      {/* Component JSX here */}
    </div>
  )
}
\`\`\``

      const fullPrompt = `${systemPrompt}

User Request: ${request.prompt}

${request.existingCode ? `Existing Code to modify:\n${request.existingCode}` : ''}

${request.context ? `Additional Context: ${request.context}` : ''}

Generate a React component that fulfills this request. Make it modern, responsive, and production-ready.`

      const { text } = await blink.ai.generateText({
        prompt: fullPrompt,
        model: 'gpt-4o-mini',
        maxTokens: 2000
      })

      // Extract code from response
      const codeMatch = text.match(/```(?:tsx?|javascript|jsx)?\n([\s\S]*?)\n```/)
      const code = codeMatch ? codeMatch[1] : text

      // Extract component name from code
      const componentNameMatch = code.match(/export default function (\w+)/)
      const componentName = componentNameMatch ? componentNameMatch[1] : request.componentName || 'GeneratedComponent'

      // Generate preview description
      const previewPrompt = `Describe what this React component does in 1-2 sentences. Be concise and focus on functionality:

${code}`

      const { text: preview } = await blink.ai.generateText({
        prompt: previewPrompt,
        model: 'gpt-4o-mini',
        maxTokens: 100
      })

      return {
        success: true,
        code: code.trim(),
        componentName,
        preview: preview.trim()
      }
    } catch (error) {
      console.error('Code generation error:', error)
      return {
        success: false,
        code: '',
        componentName: 'ErrorComponent',
        preview: 'Failed to generate component',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async improveComponent(code: string, improvement: string): Promise<CodeGenerationResponse> {
    return this.generateComponent({
      prompt: `Improve this component: ${improvement}`,
      existingCode: code,
      context: 'This is an existing component that needs to be improved or modified.'
    })
  }

  async generateFullApp(description: string): Promise<CodeGenerationResponse> {
    return this.generateComponent({
      prompt: `Create a complete web application: ${description}. Include multiple sections, proper navigation, and a professional layout.`,
      componentName: 'App'
    })
  }
}