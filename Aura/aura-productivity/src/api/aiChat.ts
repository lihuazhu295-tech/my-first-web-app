// AI对话服务 - 统一的AI API调用模块
// 使用DeepSeek模型提供智能对话功能

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  messages: ChatMessage[]
  maxTokens?: number
  temperature?: number
  stream?: boolean
}

export interface ChatResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

// DeepSeek API配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'
const DEEPSEEK_API_KEY = 'sk-b75efe3825ea468ba6a9f3f8bfe8d6b8'

/**
 * 调用DeepSeek AI模型进行对话
 * @param request 对话请求参数
 * @returns Promise<ChatResponse>
 */
export const chatWithAI = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: request.messages,
        max_tokens: request.maxTokens || 500,
        temperature: request.temperature || 0.7,
        stream: request.stream || false
      })
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API错误: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('API响应格式错误')
    }

    return {
      content: data.choices[0].message.content,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      } : undefined
    }
  } catch (error) {
    console.error('AI对话调用失败:', error)
    throw error
  }
}

/**
 * 简单的AI对话 - 单轮对话
 * @param userMessage 用户消息
 * @param systemPrompt 系统提示词（可选）
 * @returns Promise<string>
 */
export const simpleChat = async (
  userMessage: string, 
  systemPrompt: string = '你是一个友好的AI助手，帮助用户解答问题和提供建议。'
): Promise<string> => {
  try {
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ]

    const response = await chatWithAI({ messages })
    return response.content
  } catch (error) {
    console.error('简单对话失败:', error)
    return '抱歉，AI服务暂时不可用，请稍后再试。'
  }
}

/**
 * 获取AI建议 - 针对特定场景的AI建议
 * @param context 上下文信息
 * @param question 具体问题
 * @returns Promise<string>
 */
export const getAISuggestion = async (context: string, question: string): Promise<string> => {
  const systemPrompt = `你是一个专业的效率顾问和生活助手。基于用户提供的上下文信息，给出实用、具体的建议。
请保持回答简洁明了，重点突出可操作性。`
  
  const userMessage = `上下文：${context}\n\n问题：${question}`
  
  return await simpleChat(userMessage, systemPrompt)
}

/**
 * 智能文本分析 - 分析文本内容并提供洞察
 * @param text 要分析的文本
 * @param analysisType 分析类型
 * @returns Promise<string>
 */
export const analyzeText = async (
  text: string, 
  analysisType: 'summary' | 'sentiment' | 'keywords' | 'improvement' = 'summary'
): Promise<string> => {
  const prompts = {
    summary: '请总结以下文本的主要内容，提取关键信息：',
    sentiment: '请分析以下文本的情感倾向和语调：',
    keywords: '请提取以下文本的关键词和核心概念：',
    improvement: '请分析以下文本并提供改进建议：'
  }
  
  const systemPrompt = `你是一个专业的文本分析师，擅长${analysisType === 'summary' ? '内容总结' : 
    analysisType === 'sentiment' ? '情感分析' : 
    analysisType === 'keywords' ? '关键词提取' : '文本优化'}。`
  
  const userMessage = `${prompts[analysisType]}\n\n${text}`
  
  return await simpleChat(userMessage, systemPrompt)
}

/**
 * 创意生成 - 基于主题生成创意内容
 * @param topic 主题
 * @param type 创意类型
 * @returns Promise<string>
 */
export const generateIdeas = async (
  topic: string, 
  type: 'brainstorm' | 'solution' | 'content' | 'name' = 'brainstorm'
): Promise<string> => {
  const prompts = {
    brainstorm: `请围绕"${topic}"这个主题进行头脑风暴，提供5-8个创新想法：`,
    solution: `请针对"${topic}"这个问题，提供3-5个可行的解决方案：`,
    content: `请围绕"${topic}"这个主题，生成有趣的内容创意：`,
    name: `请为"${topic}"相关的项目或产品，提供5-10个有创意的名称：`
  }
  
  const systemPrompt = '你是一个富有创造力的创意顾问，擅长生成新颖、实用的想法和解决方案。'
  
  return await simpleChat(prompts[type], systemPrompt)
}

export default {
  chatWithAI,
  simpleChat,
  getAISuggestion,
  analyzeText,
  generateIdeas
}