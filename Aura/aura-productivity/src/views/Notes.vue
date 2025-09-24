<template>
  <div class="ai-notes-container">
    <!-- AI助手头部 -->
    <div class="ai-header">
      <div class="header-content">
        <div class="ai-assistant">
          <div class="ai-avatar">
            <div class="avatar-glow"></div>
            <svg class="avatar-icon" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="assistant-text">
            <h1 class="title">AI智能记事</h1>
            <p class="subtitle">智能化笔记管理与知识整理</p>
          </div>
        </div>
        <div class="ai-actions">
          <button class="ai-btn insights-btn">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            AI洞察
          </button>
          <button @click="createNewNote" class="ai-btn create-btn">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            新建笔记
          </button>
        </div>
      </div>
    </div>

    <!-- 音乐播放器卡片 -->
    <MusicPlayerCard />

    <!-- 笔记内容区域 -->
    <div class="notes-content">
      <!-- 笔记列表 -->
      <div class="notes-grid">
        <div v-for="note in notes" :key="note.id" class="note-card">
          <div class="note-content" @click="editNote(note)">
            <h3 class="note-title">{{ note.title || '无标题' }}</h3>
            <p class="note-preview">{{ note.content || '无内容' }}</p>
            <p class="note-date">{{ formatDate(note.updatedAt) }}</p>
          </div>
          <button @click.stop="deleteNoteDirect(note.id)" class="note-delete-btn" title="删除笔记">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="notes.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 class="empty-title">开始你的智能记事之旅</h3>
        <p class="empty-description">AI将帮助你更好地组织和管理笔记内容</p>
        <button @click="createNewNote" class="ai-btn create-btn">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          创建第一个笔记
        </button>
      </div>
    </div>

    <!-- 新建/编辑笔记对话框 -->
    <div v-if="showNoteDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-card rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-foreground">
            {{ editingNote?.id ? '编辑笔记' : '新建笔记' }}
          </h3>
          <button @click="closeNoteDialog" class="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">标题</label>
            <input
              v-model="currentNote.title"
              type="text"
              class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="输入笔记标题..."
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">内容</label>
            <textarea
              v-model="currentNote.content"
              rows="10"
              class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="输入笔记内容..."
            ></textarea>
          </div>

          <div class="flex justify-end space-x-2">
            <button
              v-if="editingNote?.id"
              @click="deleteNote(editingNote.id)"
              class="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
            >
              删除
            </button>
            <button
              @click="saveNote"
              class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MusicPlayerCard from '@/components/MusicPlayerCard.vue'

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

const notes = ref<Note[]>([])
const showNoteDialog = ref(false)
const currentNote = ref<Partial<Note>>({
  title: '',
  content: ''
})
const editingNote = ref<Note | null>(null)

// 从localStorage加载笔记
const loadNotes = () => {
  const savedNotes = localStorage.getItem('aura-notes')
  if (savedNotes) {
    notes.value = JSON.parse(savedNotes).map((note: any) => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt)
    }))
  }
}

// 保存笔记到localStorage
const saveNotesToStorage = () => {
  localStorage.setItem('aura-notes', JSON.stringify(notes.value))
}

// 创建新笔记
const createNewNote = () => {
  editingNote.value = null
  currentNote.value = {
    title: '',
    content: ''
  }
  showNoteDialog.value = true
}

// 编辑笔记
const editNote = (note: Note) => {
  editingNote.value = note
  currentNote.value = { ...note }
  showNoteDialog.value = true
}

// 保存笔记
const saveNote = () => {
  if (!currentNote.value.title?.trim() && !currentNote.value.content?.trim()) {
    return
  }

  if (editingNote.value) {
    // 更新现有笔记
    const index = notes.value.findIndex(n => n.id === editingNote.value!.id)
    if (index !== -1) {
      notes.value[index] = {
        ...editingNote.value,
        ...currentNote.value,
        updatedAt: new Date()
      }
    }
  } else {
    // 创建新笔记
    const newNote: Note = {
      id: Date.now().toString(),
      title: currentNote.value.title || '无标题',
      content: currentNote.value.content || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    notes.value.unshift(newNote)
  }

  saveNotesToStorage()
  closeNoteDialog()
}

// 删除笔记（从编辑对话框）
const deleteNote = (id: string) => {
  if (confirm('确定要删除这篇笔记吗？')) {
    notes.value = notes.value.filter(note => note.id !== id)
    saveNotesToStorage()
    closeNoteDialog()
  }
}

// 直接删除笔记（从卡片）
const deleteNoteDirect = (id: string) => {
  if (confirm('确定要删除这篇笔记吗？')) {
    notes.value = notes.value.filter(note => note.id !== id)
    saveNotesToStorage()
  }
}

// 关闭笔记对话框
const closeNoteDialog = () => {
  showNoteDialog.value = false
  currentNote.value = { title: '', content: '' }
  editingNote.value = null
}

// 格式化日期
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// 初始化
onMounted(() => {
  loadNotes()
})
</script>

<style scoped>
/* AI Notes Container */
.ai-notes-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow: hidden;
}

.ai-notes-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(255, 119, 198, 0.2) 0%, transparent 50%),
              radial-gradient(ellipse at 40% 80%, rgba(119, 198, 255, 0.2) 0%, transparent 50%);
  animation: ai-glow 8s ease-in-out infinite;
  pointer-events: none;
}

/* AI Header */
.ai-header {
  position: relative;
  z-index: 10;
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.ai-assistant {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ai-avatar {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(102, 126, 234, 0.4);
}

.avatar-glow {
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  animation: avatar-pulse 2s ease-in-out infinite;
  z-index: -1;
}

.avatar-icon {
  width: 28px;
  height: 28px;
  color: white;
}

.assistant-text .title {
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.assistant-text .subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  margin: 0.25rem 0 0 0;
}

.ai-actions {
  display: flex;
  gap: 1rem;
}

.ai-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  cursor: pointer;
}

.ai-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.ai-btn svg {
  width: 18px;
  height: 18px;
}

.create-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.create-btn:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

/* Notes Content */
.notes-content {
  position: relative;
  z-index: 5;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.note-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.note-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.note-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.note-card:hover::before {
  opacity: 1;
}

.note-content {
  cursor: pointer;
}

.note-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.note-preview {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-date {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  margin: 0;
}

.note-delete-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.note-card:hover .note-delete-btn {
  opacity: 1;
}

.note-delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.1);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 40px rgba(102, 126, 234, 0.3);
}

.empty-icon svg {
  width: 40px;
  height: 40px;
  color: white;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.empty-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin: 0 0 2rem 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* Animations */
@keyframes ai-glow {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@keyframes avatar-pulse {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .ai-header {
    padding: 1.5rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .ai-actions {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .notes-content {
    padding: 1.5rem;
  }
  
  .notes-grid {
    grid-template-columns: 1fr;
  }
  
  .assistant-text .title {
    font-size: 1.5rem;
  }
}
</style>