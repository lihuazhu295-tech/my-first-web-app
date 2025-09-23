<template>
  <div class="ai-assistant-widget">
    <!-- AI助手触发按钮 -->
    <button 
      v-if="!isOpen" 
      @click="toggleAssistant" 
      class="ai-trigger-btn"
      :class="{ 'pulse': hasNewSuggestion }"
    >
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
        <path d="M19 15L20.09 18.26L24 19L20.09 19.74L19 23L17.91 19.74L14 19L17.91 18.26L19 15Z" fill="currentColor"/>
      </svg>
      <span class="btn-text">AI助手</span>
    </button>

    <!-- AI助手面板 -->
    <div v-if="isOpen" class="ai-assistant-panel">
      <!-- 头部 -->
      <div class="panel-header">
        <div class="header-info">
          <div class="ai-avatar">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="header-text">
            <h3>AI智能助手</h3>
            <p>基于DeepSeek模型</p>
          </div>
        </div>
        <button @click="toggleAssistant" class="close-btn">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>

      <!-- 功能选项卡 -->
      <div class="function-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
        >
          <svg viewBox="0 0 24 24" fill="none" v-html="tab.icon"></svg>
          {{ tab.name }}
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="panel-content">
        <!-- 快速对话 -->
        <div v-if="activeTab === 'chat'" class="chat-section">
          <div class="quick-questions">
            <h4>快速提问</h4>
            <div class="question-grid">
              <button 
                v-for="question in quickQuestions" 
                :key="question"
                @click="askQuestion(question)"
                class="question-btn"
                :disabled="isLoading"
              >
                {{ question }}
              </button>
            </div>
          </div>
          
          <div class="custom-input">
            <div class="input-group">
              <input 
                v-model="customQuestion"
                @keyup.enter="askCustomQuestion"
                placeholder="输入您的问题..."
                class="question-input"
                :disabled="isLoading"
              />
              <button 
                @click="askCustomQuestion"
                :disabled="isLoading || !customQuestion.trim()"
                class="send-btn"
              >
                <svg v-if="!isLoading" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <div v-else class="loading-spinner"></div>
              </button>
            </div>
          </div>
        </div>

        <!-- 智能建议 -->
        <div v-if="activeTab === 'suggest'" class="suggest-section">
          <div class="context-input">
            <h4>获取AI建议</h4>
            <textarea 
              v-model="suggestionContext"
              placeholder="描述您当前的情况或需要建议的场景..."
              class="context-textarea"
              rows="3"
            ></textarea>
            <button 
              @click="getSuggestion"
              :disabled="isLoading || !suggestionContext.trim()"
              class="suggest-btn"
            >
              <svg v-if="!isLoading" viewBox="0 0 24 24" fill="none">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <div v-else class="loading-spinner"></div>
              获取建议
            </button>
          </div>
        </div>

        <!-- 文本分析 -->
        <div v-if="activeTab === 'analyze'" class="analyze-section">
          <div class="analysis-input">
            <h4>文本分析</h4>
            <textarea 
              v-model="analysisText"
              placeholder="输入要分析的文本内容..."
              class="analysis-textarea"
              rows="4"
            ></textarea>
            <div class="analysis-options">
              <label v-for="option in analysisOptions" :key="option.value">
                <input 
                  type="radio" 
                  v-model="analysisType" 
                  :value="option.value"
                />
                {{ option.label }}
              </label>
            </div>
            <button 
              @click="analyzeText"
              :disabled="isLoading || !analysisText.trim()"
              class="analyze-btn"
            >
              <svg v-if="!isLoading" viewBox="0 0 24 24" fill="none">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <div v-else class="loading-spinner"></div>
              开始分析
            </button>
          </div>
        </div>

        <!-- 创意生成 -->
        <div v-if="activeTab === 'create'" class="create-section">
          <div class="creation-input">
            <h4>创意生成</h4>
            <input 
              v-model="creationTopic"
              placeholder="输入主题或关键词..."
              class="topic-input"
            />
            <div class="creation-options">
              <label v-for="option in creationOptions" :key="option.value">
                <input 
                  type="radio" 
                  v-model="creationType" 
                  :value="option.value"
                />
                {{ option.label }}
              </label>
            </div>
            <button 
              @click="generateIdeas"
              :disabled="isLoading || !creationTopic.trim()"
              class="create-btn"
            >
              <svg v-if="!isLoading" viewBox="0 0 24 24" fill="none">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <div v-else class="loading-spinner"></div>
              生成创意
            </button>
          </div>
        </div>

        <!-- AI回复区域 -->
        <div v-if="aiResponse" class="ai-response">
          <div class="response-header">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
            <span>AI回复</span>
            <button @click="copyResponse" class="copy-btn" title="复制回复">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2m8 0V2a2 2 0 00-2-2H10a2 2 0 00-2 2v2m8 0H8" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
          <div class="response-content">
            {{ aiResponse }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { simpleChat, getAISuggestion, analyzeText as analyzeTextAPI, generateIdeas as generateIdeasAPI } from '../api/aiChat'

// 响应式数据
const isOpen = ref(false)
const activeTab = ref('chat')
const isLoading = ref(false)
const hasNewSuggestion = ref(false)
const aiResponse = ref('')

// 对话相关
const customQuestion = ref('')
const quickQuestions = [
  '如何提高工作效率？',
  '推荐一些时间管理技巧',
  '如何保持专注？',
  '制定学习计划的建议'
]

// 建议相关
const suggestionContext = ref('')

// 分析相关
const analysisText = ref('')
const analysisType = ref('summary')
const analysisOptions = [
  { value: 'summary', label: '内容总结' },
  { value: 'sentiment', label: '情感分析' },
  { value: 'keywords', label: '关键词提取' },
  { value: 'improvement', label: '改进建议' }
]

// 创意相关
const creationTopic = ref('')
const creationType = ref('brainstorm')
const creationOptions = [
  { value: 'brainstorm', label: '头脑风暴' },
  { value: 'solution', label: '解决方案' },
  { value: 'content', label: '内容创意' },
  { value: 'name', label: '命名建议' }
]

// 选项卡配置
const tabs = [
  {
    id: 'chat',
    name: '快速对话',
    icon: '<path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" stroke-width="2"/>'
  },
  {
    id: 'suggest',
    name: '智能建议',
    icon: '<path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="2"/>'
  },
  {
    id: 'analyze',
    name: '文本分析',
    icon: '<path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2"/>'
  },
  {
    id: 'create',
    name: '创意生成',
    icon: '<path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" stroke-width="2"/>'
  }
]

// 方法
const toggleAssistant = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    hasNewSuggestion.value = false
  }
}

const askQuestion = async (question: string) => {
  isLoading.value = true
  aiResponse.value = ''
  
  try {
    const response = await simpleChat(question)
    aiResponse.value = response
  } catch (error) {
    aiResponse.value = '抱歉，AI服务暂时不可用，请稍后再试。'
  } finally {
    isLoading.value = false
  }
}

const askCustomQuestion = async () => {
  if (!customQuestion.value.trim()) return
  
  await askQuestion(customQuestion.value)
  customQuestion.value = ''
}

const getSuggestion = async () => {
  if (!suggestionContext.value.trim()) return
  
  isLoading.value = true
  aiResponse.value = ''
  
  try {
    const response = await getAISuggestion(suggestionContext.value, '请给出具体的建议和行动方案')
    aiResponse.value = response
  } catch (error) {
    aiResponse.value = '抱歉，AI服务暂时不可用，请稍后再试。'
  } finally {
    isLoading.value = false
  }
}

const analyzeText = async () => {
  if (!analysisText.value.trim()) return
  
  isLoading.value = true
  aiResponse.value = ''
  
  try {
    const response = await analyzeTextAPI(analysisText.value, analysisType.value as any)
    aiResponse.value = response
  } catch (error) {
    aiResponse.value = '抱歉，AI服务暂时不可用，请稍后再试。'
  } finally {
    isLoading.value = false
  }
}

const generateIdeas = async () => {
  if (!creationTopic.value.trim()) return
  
  isLoading.value = true
  aiResponse.value = ''
  
  try {
    const response = await generateIdeasAPI(creationTopic.value, creationType.value as any)
    aiResponse.value = response
  } catch (error) {
    aiResponse.value = '抱歉，AI服务暂时不可用，请稍后再试。'
  } finally {
    isLoading.value = false
  }
}

const copyResponse = async () => {
  try {
    await navigator.clipboard.writeText(aiResponse.value)
    // 可以添加复制成功的提示
  } catch (error) {
    console.error('复制失败:', error)
  }
}

// 生命周期
onMounted(() => {
  // 可以在这里添加初始化逻辑
  setTimeout(() => {
    hasNewSuggestion.value = true
  }, 3000)
})
</script>

<style scoped>
.ai-assistant-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.ai-trigger-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  font-weight: 500;
}

.ai-trigger-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
}

.ai-trigger-btn.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4); }
  50% { box-shadow: 0 4px 30px rgba(102, 126, 234, 0.8); }
  100% { box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4); }
}

.ai-trigger-btn svg {
  width: 20px;
  height: 20px;
}

.ai-assistant-panel {
  width: 400px;
  max-height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-avatar svg {
  width: 20px;
  height: 20px;
}

.header-text h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.header-text p {
  margin: 0;
  font-size: 12px;
  opacity: 0.8;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.function-tabs {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #6c757d;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.tab-btn.active {
  background: white;
  color: #667eea;
  border-bottom: 2px solid #667eea;
}

.tab-btn svg {
  width: 16px;
  height: 16px;
}

.panel-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.chat-section h4,
.suggest-section h4,
.analyze-section h4,
.create-section h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
}

.question-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin-bottom: 20px;
}

.question-btn {
  padding: 12px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  font-size: 13px;
  color: #495057;
  transition: all 0.2s;
}

.question-btn:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #667eea;
}

.question-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-group {
  display: flex;
  gap: 8px;
}

.question-input,
.context-textarea,
.analysis-textarea,
.topic-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
}

.question-input:focus,
.context-textarea:focus,
.analysis-textarea:focus,
.topic-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.send-btn,
.suggest-btn,
.analyze-btn,
.create-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  min-width: 100px;
}

.send-btn:hover:not(:disabled),
.suggest-btn:hover:not(:disabled),
.analyze-btn:hover:not(:disabled),
.create-btn:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.send-btn:disabled,
.suggest-btn:disabled,
.analyze-btn:disabled,
.create-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.send-btn svg,
.suggest-btn svg,
.analyze-btn svg,
.create-btn svg {
  width: 16px;
  height: 16px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.analysis-options,
.creation-options {
  display: flex;
  gap: 16px;
  margin: 12px 0;
  flex-wrap: wrap;
}

.analysis-options label,
.creation-options label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #495057;
  cursor: pointer;
}

.ai-response {
  margin-top: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.response-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.response-header span {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #495057;
}

.response-header svg {
  width: 16px;
  height: 16px;
  color: #667eea;
}

.copy-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.copy-btn svg {
  width: 16px;
  height: 16px;
}

.response-content {
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  color: #495057;
  white-space: pre-wrap;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .ai-assistant-panel {
    width: calc(100vw - 40px);
    max-width: 360px;
  }
  
  .tab-btn {
    font-size: 11px;
    padding: 10px 6px;
  }
  
  .analysis-options,
  .creation-options {
    flex-direction: column;
    gap: 8px;
  }
}
</style>