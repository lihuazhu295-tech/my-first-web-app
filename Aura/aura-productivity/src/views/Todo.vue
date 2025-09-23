<template>
  <div class="aquarius-bg p-6 relative overflow-hidden">
    <div class="constellation"></div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-semibold text-foreground">待办事项</h2>
    </div>

    <!-- 添加新任务 -->
    <div class="mb-6">
      <div class="flex space-x-2 mb-2">
        <input
          v-model="newTaskText"
          @keyup.enter="addTask"
          type="text"
          class="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="添加新的待办事项..."
        />
        <select
          v-model="newTaskPriority"
          class="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="high">🔴 高优先级</option>
          <option value="medium">🟡 中优先级</option>
          <option value="low">🟢 低优先级</option>
        </select>
        <button
          @click="addTask"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          添加
        </button>
      </div>
    </div>

    <!-- 任务统计 -->
    <div class="mb-4 text-sm text-muted-foreground">
      总共 {{ tasks.length }} 个任务，
      <span class="text-primary">{{ completedTasks }} 个已完成</span>，
      <span class="text-destructive">{{ pendingTasks }} 个待完成</span>
    </div>

    <!-- 任务列表 -->
    <div class="space-y-2">
      <div
        v-for="task in sortedTasks"
        :key="task.id"
        class="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg border border-border hover:border-primary/50 transition-colors"
      >
        <input
          type="checkbox"
          :checked="task.completed"
          @change="toggleTask(task.id)"
          class="w-4 h-4 text-primary rounded border-border focus:ring-2 focus:ring-ring"
        />
        <!-- 优先级标识 -->
        <div 
          :class="[
            'px-2 py-1 rounded-full text-xs font-medium border',
            getPriorityInfo(task.priority).color
          ]"
        >
          {{ getPriorityInfo(task.priority).icon }} {{ getPriorityInfo(task.priority).text }}
        </div>
        <div class="flex-1">
          <span
            :class="[
              'text-foreground',
              task.completed && 'line-through text-muted-foreground'
            ]"
          >
            {{ task.text }}
          </span>
          <p class="text-xs text-muted-foreground">
            {{ formatDate(task.createdAt) }}
          </p>
        </div>
        <button
          @click="deleteTask(task.id)"
          class="text-destructive hover:text-destructive/80 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="tasks.length === 0" class="text-center py-12">
      <div class="text-muted-foreground mb-4">
        ✅ 还没有待办事项，开始添加你的第一个任务吧！
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  priority: 'high' | 'medium' | 'low'
}

const tasks = ref<Task[]>([])
const newTaskText = ref('')
const newTaskPriority = ref<'high' | 'medium' | 'low'>('medium')

// 计算属性
const completedTasks = computed(() => tasks.value.filter(task => task.completed).length)
const pendingTasks = computed(() => tasks.value.filter(task => !task.completed).length)

// 按优先级排序的任务列表
const sortedTasks = computed(() => {
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  return [...tasks.value].sort((a, b) => {
    // 未完成的任务优先显示
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    // 按优先级排序
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
})

// 获取优先级显示信息
const getPriorityInfo = (priority: 'high' | 'medium' | 'low') => {
  const priorityMap = {
    high: { icon: '🔴', text: '高', color: 'text-red-500 bg-red-50 border-red-200' },
    medium: { icon: '🟡', text: '中', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    low: { icon: '🟢', text: '低', color: 'text-green-600 bg-green-50 border-green-200' }
  }
  return priorityMap[priority]
}

// 从localStorage加载任务
const loadTasks = () => {
  const savedTasks = localStorage.getItem('aura-tasks')
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks).map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      priority: task.priority || 'medium' // 为旧数据提供默认优先级
    }))
  }
}

// 保存任务到localStorage
const saveTasksToStorage = () => {
  localStorage.setItem('aura-tasks', JSON.stringify(tasks.value))
}

// 添加新任务
const addTask = () => {
  const text = newTaskText.value.trim()
  if (!text) return

  const newTask: Task = {
    id: Date.now().toString(),
    text,
    completed: false,
    createdAt: new Date(),
    priority: newTaskPriority.value
  }

  tasks.value.unshift(newTask)
  newTaskText.value = ''
  newTaskPriority.value = 'medium'
  saveTasksToStorage()
}

// 切换任务状态
const toggleTask = (id: string) => {
  const task = tasks.value.find(t => t.id === id)
  if (task) {
    task.completed = !task.completed
    saveTasksToStorage()
  }
}

// 删除任务
const deleteTask = (id: string) => {
  if (confirm('确定要删除这个任务吗？')) {
    tasks.value = tasks.value.filter(task => task.id !== id)
    saveTasksToStorage()
  }
}

// 格式化日期
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// 初始化
onMounted(() => {
  loadTasks()
})
</script>

<style scoped>
/* AI-native 待办事项样式 */
.aquarius-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow-x: hidden;
}

.aquarius-bg::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

/* 确保内容在背景之上 */
.aquarius-bg > * {
  position: relative;
  z-index: 3;
}
</style>