export interface GeneratedComponent {
  id: string
  name: string
  code: string
  preview: string
  timestamp: Date
}

export interface AppProject {
  id: string
  name: string
  description: string
  components: GeneratedComponent[]
  mainComponent: string
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  isGenerating?: boolean
}

export interface CodeGenerationRequest {
  prompt: string
  context?: string
  existingCode?: string
  componentName?: string
}

export interface CodeGenerationResponse {
  success: boolean
  code: string
  componentName: string
  preview: string
  error?: string
}