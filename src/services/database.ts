import { blink } from '../blink/client'

export interface Project {
  id: string
  userId: string
  name: string
  description?: string
  initialPrompt: string
  createdAt: string
  updatedAt: string
  isPublic: boolean
  thumbnailUrl?: string
}

export interface Component {
  id: string
  projectId: string
  userId: string
  name: string
  code: string
  previewDescription?: string
  prompt: string
  createdAt: string
}

export interface ChatMessage {
  id: string
  projectId: string
  userId: string
  type: 'user' | 'ai'
  content: string
  createdAt: string
}

export interface Template {
  id: string
  name: string
  description: string
  category: string
  code: string
  previewImageUrl?: string
  isFeatured: boolean
  createdAt: string
}

export class DatabaseService {
  private static instance: DatabaseService

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  // Projects
  async createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const user = await blink.auth.me()
    const project = await blink.db.projects.create({
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      name: data.name,
      description: data.description,
      initialPrompt: data.initialPrompt,
      isPublic: data.isPublic,
      thumbnailUrl: data.thumbnailUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    return project
  }

  async getUserProjects(): Promise<Project[]> {
    const user = await blink.auth.me()
    return await blink.db.projects.list({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' }
    })
  }

  async getProject(id: string): Promise<Project | null> {
    const user = await blink.auth.me()
    const projects = await blink.db.projects.list({
      where: { 
        AND: [
          { id },
          { userId: user.id }
        ]
      }
    })
    return projects[0] || null
  }

  async updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    await blink.db.projects.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    })
  }

  async deleteProject(id: string): Promise<void> {
    await blink.db.projects.delete(id)
  }

  // Components
  async saveComponent(data: Omit<Component, 'id' | 'createdAt'>): Promise<Component> {
    const component = await blink.db.components.create({
      id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      projectId: data.projectId,
      userId: data.userId,
      name: data.name,
      code: data.code,
      previewDescription: data.previewDescription,
      prompt: data.prompt,
      createdAt: new Date().toISOString()
    })
    return component
  }

  async getProjectComponents(projectId: string): Promise<Component[]> {
    const user = await blink.auth.me()
    return await blink.db.components.list({
      where: { 
        AND: [
          { projectId },
          { userId: user.id }
        ]
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async getLatestComponent(projectId: string): Promise<Component | null> {
    const components = await this.getProjectComponents(projectId)
    return components[0] || null
  }

  // Chat Messages
  async saveChatMessage(data: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage> {
    const message = await blink.db.chatMessages.create({
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      projectId: data.projectId,
      userId: data.userId,
      type: data.type,
      content: data.content,
      createdAt: new Date().toISOString()
    })
    return message
  }

  async getProjectMessages(projectId: string): Promise<ChatMessage[]> {
    const user = await blink.auth.me()
    return await blink.db.chatMessages.list({
      where: { 
        AND: [
          { projectId },
          { userId: user.id }
        ]
      },
      orderBy: { createdAt: 'asc' }
    })
  }

  // Templates
  async getFeaturedTemplates(): Promise<Template[]> {
    return await blink.db.templates.list({
      where: { isFeatured: "1" },
      orderBy: { createdAt: 'desc' },
      limit: 12
    })
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return await blink.db.templates.list({
      where: { category },
      orderBy: { createdAt: 'desc' }
    })
  }

  async getAllTemplates(): Promise<Template[]> {
    return await blink.db.templates.list({
      orderBy: { createdAt: 'desc' }
    })
  }
}