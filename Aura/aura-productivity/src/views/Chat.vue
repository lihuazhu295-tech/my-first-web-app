<template>
  <div class="ai-chat-container">
    <!-- 头部区域 -->
    <div class="chat-header">
      <div class="header-content">
        <div class="header-left">
          <div class="ai-avatar">
            <div class="avatar-glow"></div>
            <svg class="avatar-icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
              <path d="M19 15L20.09 18.26L24 19L20.09 19.74L19 23L17.91 19.74L14 19L17.91 18.26L19 15Z" fill="currentColor"/>
              <path d="M5 6L5.5 7.5L7 8L5.5 8.5L5 10L4.5 8.5L3 8L4.5 7.5L5 6Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="header-text">
            <h1 class="chat-title">AI Assistant</h1>
            <p class="chat-subtitle">智能对话助手</p>
          </div>
        </div>
        <div class="header-actions">
          <button @click="getDailyCompliment()" class="action-btn compliment-btn">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
            每日一夸
          </button>
          <button @click="clearChat" class="action-btn clear-btn">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            清空对话
          </button>
        </div>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="chat-messages" ref="messagesContainer">
      <!-- 欢迎消息 -->
      <div v-if="messages.length === 0" class="welcome-message">
        <div class="welcome-avatar">
          <div class="welcome-glow"></div>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
          </svg>
        </div>
        <div class="welcome-content">
          <h3>你好！我是你的AI助手</h3>
          <p>我可以帮助你解答问题、提供建议或进行有趣的对话。有什么我可以为你做的吗？</p>
        </div>
        <div class="quick-actions">
          <button @click="sendQuickMessage('帮我制定一个学习计划')" class="quick-btn">
            📚 制定学习计划
          </button>
          <button @click="sendQuickMessage('给我一些工作效率的建议')" class="quick-btn">
            ⚡ 效率建议
          </button>
          <button @click="sendQuickMessage('推荐一些有趣的话题')" class="quick-btn">
            💡 有趣话题
          </button>
          <button @click="getDailyCompliment()" class="quick-btn daily-compliment-btn">
            🌟 每日一夸
          </button>
        </div>
      </div>

      <!-- 消息列表 -->
      <div v-for="message in messages" :key="message.id" class="message-wrapper">
        <div class="message" :class="message.role">
          <div v-if="message.role === 'assistant'" class="message-avatar">
            <div class="avatar-glow"></div>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="message-content">
            <div class="message-text">{{ message.content }}</div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
          <div v-if="message.role === 'user'" class="message-avatar user-avatar">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="message-wrapper">
        <div class="message assistant">
          <div class="message-avatar">
            <div class="avatar-glow loading"></div>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input-container">
      <div class="input-wrapper">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          type="text"
          class="chat-input"
          placeholder="输入你的问题..."
          :disabled="isLoading"
        />
        <button
          @click="sendMessage"
          :disabled="isLoading || !newMessage.trim()"
          class="send-btn"
        >
          <svg v-if="!isLoading" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div v-else class="loading-spinner"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const messages = ref<Message[]>([])
const newMessage = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement>()

// 从localStorage加载对话历史
const loadChatHistory = () => {
  const savedMessages = localStorage.getItem('aura-chat')
  if (savedMessages) {
    messages.value = JSON.parse(savedMessages).map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }))
  }
}

// 保存对话历史到localStorage
const saveChatHistory = () => {
  localStorage.setItem('aura-chat', JSON.stringify(messages.value))
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 快速发送消息
const sendQuickMessage = (text: string) => {
  newMessage.value = text
  sendMessage()
}

// 发送消息
const sendMessage = async () => {
  const text = newMessage.value.trim()
  if (!text || isLoading.value) return

  // 添加用户消息
  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: text,
    timestamp: new Date()
  }
  messages.value.push(userMessage)
  newMessage.value = ''
  saveChatHistory()
  scrollToBottom()

  // 调用Deepseek API获取回复
  isLoading.value = true
  
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-b75efe3825ea468ba6a9f3f8bfe8d6b8'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一个友好的个人助手，帮助用户管理任务和提高工作效率。' },
          { role: 'user', content: text }
        ],
        max_tokens: 500,
        temperature: 0.7,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('API响应:', data)
    
    const aiText = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content 
      ? data.choices[0].message.content 
      : '抱歉，我暂时无法回复，请稍后再试。'
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiText,
      timestamp: new Date()
    }
    
    messages.value.push(aiMessage)
    scrollToBottom()
  } catch (error) {
    console.error('API调用失败:', error)
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '抱歉，AI服务暂时不可用，请检查网络连接或稍后再试。',
      timestamp: new Date()
    }
    messages.value.push(aiMessage)
    scrollToBottom()
  } finally {
    isLoading.value = false
    saveChatHistory()
  }
}

// 每日一夸功能
const getDailyCompliment = () => {
  const compliments = [
    '🌟 你今天真的很棒！你的努力和坚持让人敬佩，继续保持这份美好的状态吧！',
    '✨ 你拥有独特的魅力和才华，每一天都在成为更好的自己，这真的很了不起！',
    '🌈 你的笑容能照亮整个世界，你的存在就是一份珍贵的礼物！',
    '🎯 你处理问题的方式很聪明，你的思维敏捷让人印象深刻！',
    '💫 你的创造力和想象力真的很棒，总能带来新鲜的想法和灵感！',
    '🌸 你很善良，总是能为他人着想，这种温暖的品质很珍贵！',
    '🚀 你的学习能力很强，面对挑战时的勇气和决心值得赞扬！',
    '🎨 你有很好的审美眼光，总能发现生活中的美好细节！',
    '🌺 你的乐观态度很感染人，即使在困难时刻也能保持积极！',
    '⭐ 你很有责任心，做事认真负责，这种品质会带你走得更远！',
    '🌻 你的耐心和细心让人敬佩，这些品质会帮你成就很多事情！',
    '🎪 你很有趣，总能给周围的人带来欢乐和正能量！',
    '🌙 你很有智慧，总能在关键时刻做出正确的选择！',
    '🎭 你的表达能力很棒，总能清晰地传达自己的想法！',
    '🌊 你很有包容心，能理解和接纳不同的观点，这很难得！',
    '🎵 你的生活态度很积极，总能在平凡中发现不平凡！',
    '🌟 你很勇敢，敢于面对挑战，敢于追求自己的梦想！',
    '🎈 你的热情很感染人，做任何事都充满活力和动力！',
    '🌷 你很体贴，总能关注到别人的感受，这种善良很温暖！',
    '🎯 你很有目标感，知道自己想要什么，并为之努力，这很棒！',
    '🌼 你的坚韧不拔让人钦佩，无论遇到什么困难都能勇敢面对！',
    '🎊 你的积极能量总是能感染身边的每一个人，这是多么珍贵的品质！',
    '🌟 你的独立思考能力很强，总能从不同角度看待问题！',
    '🎀 你的温柔和体贴让人如沐春风，这种美好很难得！',
    '🌸 你的进步速度让人惊叹，每一天都在超越昨天的自己！',
    '🎨 你的创新思维总能带来意想不到的惊喜和突破！',
    '🌺 你的真诚和坦率让人感到安心，这种品质很珍贵！',
    '🎭 你的幽默感总能在紧张的时刻带来轻松的氛围！',
    '🌻 你的专注力和执行力让人印象深刻，这是成功的关键品质！',
    '🎪 你的适应能力很强，总能在变化中找到属于自己的节奏！'
  ]
  
  // 随机选择一条夸奖内容
  const randomIndex = Math.floor(Math.random() * compliments.length)
  const randomCompliment = compliments[randomIndex]
  
  // 直接添加AI回复消息
  const aiMessage: Message = {
    id: Date.now().toString(),
    role: 'assistant',
    content: randomCompliment,
    timestamp: new Date()
  }
  
  messages.value.push(aiMessage)
  saveChatHistory()
  scrollToBottom()
}

// 清空对话
const clearChat = () => {
  if (confirm('确定要清空所有对话记录吗？')) {
    messages.value = []
    localStorage.removeItem('aura-chat')
  }
}

// 格式化时间
const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// 初始化
onMounted(() => {
  loadChatHistory()
})
</script>

<style scoped>
.ai-chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, 
    rgba(15, 15, 35, 0.95) 0%, 
    rgba(26, 26, 58, 0.95) 25%, 
    rgba(45, 45, 95, 0.95) 50%, 
    rgba(26, 26, 58, 0.95) 75%, 
    rgba(15, 15, 35, 0.95) 100%);
  position: relative;
  overflow: hidden;
}

/* 头部区域 */
.chat-header {
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  position: relative;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ai-avatar {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #a855f7, #c084fc);
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
}

.avatar-glow {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  opacity: 0.6;
  animation: pulse-glow 2s ease-in-out infinite;
  z-index: -1;
}

.avatar-icon {
  width: 24px;
  height: 24px;
  color: white;
}

.header-text {
  display: flex;
  flex-direction: column;
}

.chat-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.chat-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2);
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

/* 头部每日一夸按钮特殊样式 */
.compliment-btn {
  background: linear-gradient(135deg, #fbbf24, #f59e0b) !important;
  border: 1px solid rgba(251, 191, 36, 0.6) !important;
  color: white !important;
  font-weight: 600 !important;
  position: relative;
  overflow: hidden;
}

.compliment-btn::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  transform: rotate(45deg);
  animation: header-shimmer 2.5s ease-in-out infinite;
}

.compliment-btn:hover {
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
  border-color: rgba(251, 191, 36, 0.8) !important;
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4) !important;
}

@keyframes header-shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  50% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
  100% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
}

/* 消息区域 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.3);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.5);
}

/* 欢迎消息 */
.welcome-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1);
}

.welcome-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #a855f7, #c084fc);
  margin-bottom: 1.5rem;
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.3);
}

.welcome-glow {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  opacity: 0.4;
  animation: pulse-glow 3s ease-in-out infinite;
  z-index: -1;
}

.welcome-avatar svg {
  width: 40px;
  height: 40px;
  color: white;
}

.welcome-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 0.75rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.welcome-content p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 2rem 0;
  line-height: 1.6;
  max-width: 500px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.quick-btn {
  padding: 0.75rem 1.25rem;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.quick-btn:hover {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.2);
}

/* 每日一夸按钮特殊样式 */
.daily-compliment-btn {
  background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);
  border: 1px solid rgba(251, 191, 36, 0.5);
  color: white;
  font-weight: 600;
  position: relative;
  overflow: hidden;
}

.daily-compliment-btn::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: rotate(45deg);
  animation: shimmer 3s ease-in-out infinite;
}

.daily-compliment-btn:hover {
  background: linear-gradient(135deg, #f59e0b, #d97706, #b45309);
  border-color: rgba(251, 191, 36, 0.8);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  50% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
  100% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
}

/* 消息样式 */
.message-wrapper {
  display: flex;
  width: 100%;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  max-width: 80%;
  animation: message-appear 0.3s ease-out;
}

.message.user {
  margin-left: auto;
  flex-direction: row-reverse;
}

.message-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
}

.message-avatar.user-avatar {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  box-shadow: 0 4px 16px rgba(6, 182, 212, 0.3);
}

.message-avatar svg {
  width: 20px;
  height: 20px;
  color: white;
}

.message-avatar .avatar-glow {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  opacity: 0.4;
  animation: pulse-glow 2s ease-in-out infinite;
  z-index: -1;
}

.message-avatar .avatar-glow.loading {
  animation: pulse-glow 1s ease-in-out infinite;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.message-text {
  padding: 1rem 1.25rem;
  border-radius: 18px;
  font-size: 0.95rem;
  line-height: 1.6;
  word-wrap: break-word;
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.message.assistant .message-text {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.message.user .message-text {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(168, 85, 247, 0.8));
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.message-time {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.message.user .message-time {
  text-align: right;
}

/* 输入状态 */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 18px;
  backdrop-filter: blur(20px);
}

.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(139, 92, 246, 0.8);
  animation: typing-bounce 1.4s ease-in-out infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

/* 输入区域 */
.chat-input-container {
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(139, 92, 246, 0.2);
  position: relative;
  z-index: 10;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-width: 1200px;
  margin: 0 auto;
}

.chat-input {
  flex: 1;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.chat-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.chat-input:focus {
  border-color: rgba(139, 92, 246, 0.6);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1), 0 4px 16px rgba(139, 92, 246, 0.2);
}

.send-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-btn svg {
  width: 20px;
  height: 20px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 动画 */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@keyframes message-appear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes typing-bounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-header {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .chat-messages {
    padding: 1rem;
  }
  
  .message {
    max-width: 95%;
  }
  
  .welcome-message {
    padding: 2rem 1rem;
  }
  
  .quick-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .chat-input-container {
    padding: 1rem;
  }
}
</style>