<template>
  <div class="ai-calendar-container">
    <!-- AI助手头部 -->
    <div class="ai-header">
      <div class="header-content">
        <div class="ai-assistant">
          <div class="ai-avatar">
            <div class="avatar-glow"></div>
            <svg class="avatar-icon" viewBox="0 0 24 24" fill="none">
              <path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="assistant-text">
            <h1 class="title">AI智能日历</h1>
            <p class="subtitle">智能化时间管理与日程安排</p>
          </div>
        </div>
        <div class="ai-actions">
          <button @click="showAIInsights = !showAIInsights" class="ai-btn insights-btn">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            AI洞察
          </button>
          <button @click="showCreateModal = true" class="ai-btn create-btn">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            创建事件
          </button>
        </div>
      </div>
    </div>

    <!-- AI洞察面板 -->
    <div v-if="showAIInsights" class="ai-insights-panel">
      <div class="insights-content">
        <div class="insight-card">
          <div class="insight-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="insight-text">
            <h3>时间效率分析</h3>
            <p>本周您的日程安排较为合理，建议在{{ getMostFreeDay() }}增加重要任务</p>
          </div>
        </div>
        <div class="insight-card">
          <div class="insight-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="insight-text">
            <h3>日程健康度</h3>
            <p>{{ getScheduleHealth() }}</p>
          </div>
        </div>
        <div class="insight-card">
          <div class="insight-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="insight-text">
            <h3>智能推荐</h3>
            <p>建议将会议安排在上午{{ getOptimalMeetingTime() }}，此时注意力最集中</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 智能统计仪表板 -->
    <div class="ai-dashboard">
      <div class="dashboard-grid">
        <div class="stat-card primary">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ getTotalEvents() }}</div>
            <div class="stat-label">本月事件</div>
            <div class="stat-trend">+{{ getEventGrowth() }}% 较上月</div>
          </div>
        </div>
        
        <div class="stat-card success">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ getCompletedEvents() }}</div>
            <div class="stat-label">已完成事件</div>
            <div class="stat-trend">{{ getCompletionRate() }}% 完成率</div>
          </div>
        </div>
        
        <div class="stat-card warning">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ getAverageEventDuration() }}h</div>
            <div class="stat-label">平均时长</div>
            <div class="stat-trend">{{ getEfficiencyTrend() }}</div>
          </div>
        </div>
        
        <div class="stat-card info">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ getUpcomingEvents() }}</div>
            <div class="stat-label">即将到来</div>
            <div class="stat-trend">今日{{ getTodayEvents() }}个</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 日历视图切换 -->
    <div class="calendar-controls">
      <div class="view-switcher">
        <button 
          v-for="view in viewOptions" 
          :key="view.value"
          @click="currentView = view.value"
          :class="['view-btn', { active: currentView === view.value }]"
        >
          <component :is="view.icon" class="view-icon" />
          <span>{{ view.label }}</span>
        </button>
      </div>
      <div class="calendar-navigation">
        <button @click="previousPeriod" class="nav-btn">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <h2 class="current-period">{{ getCurrentPeriodTitle() }}</h2>
        <button @click="nextPeriod" class="nav-btn">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 日历主体 -->
    <div class="calendar-main">
      <!-- 月视图 -->
      <div v-if="currentView === 'month'" class="month-view">
        <div class="calendar-grid">
          <!-- 星期标题 -->
          <div class="weekdays">
            <div v-for="day in weekdays" :key="day" class="weekday-header">
              {{ day }}
            </div>
          </div>
          
          <!-- 日期网格 -->
          <div class="days-grid">
            <div 
              v-for="day in monthDays" 
              :key="day.date"
              :class="['day-cell', {
                'other-month': !day.isCurrentMonth,
                'today': day.isToday,
                'selected': day.isSelected,
                'has-events': day.events.length > 0
              }]"
              @click="selectDay(day)"
            >
              <div class="day-number">{{ day.day }}</div>
              <div class="day-events">
                <div 
                  v-for="event in day.events.slice(0, 3)" 
                  :key="event.id"
                  :class="['event-dot', event.type]"
                  :title="event.title"
                ></div>
                <div v-if="day.events.length > 3" class="more-events">
                  +{{ day.events.length - 3 }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 周视图 -->
      <div v-if="currentView === 'week'" class="week-view">
        <div class="week-grid">
          <div class="time-column">
            <div v-for="hour in hours" :key="hour" class="time-slot">
              {{ formatHour(hour) }}
            </div>
          </div>
          <div class="week-days">
            <div v-for="day in weekDays" :key="day.date" class="week-day">
              <div class="week-day-header">
                <div class="day-name">{{ day.dayName }}</div>
                <div :class="['day-number', { today: day.isToday }]">{{ day.day }}</div>
              </div>
              <div class="day-timeline">
                <div v-for="hour in hours" :key="hour" class="hour-slot">
                  <div 
                    v-for="event in getEventsForHour(day, hour)" 
                    :key="event.id"
                    :class="['week-event', event.type]"
                    :style="getEventStyle(event)"
                    @click="editEvent(event)"
                  >
                    <div class="event-title">{{ event.title }}</div>
                    <div class="event-time">{{ formatEventTime(event) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 日视图 -->
      <div v-if="currentView === 'day'" class="day-view">
        <div class="day-header">
          <h3>{{ formatSelectedDate() }}</h3>
          <div class="day-stats">
            <span>{{ getDayEvents().length }} 个事件</span>
            <span>{{ getDayDuration() }} 小时</span>
          </div>
        </div>
        <div class="day-timeline">
          <div class="timeline-hours">
            <div v-for="hour in hours" :key="hour" class="timeline-hour">
              <div class="hour-label">{{ formatHour(hour) }}</div>
              <div class="hour-events">
                <div 
                  v-for="event in getEventsForHour(selectedDay, hour)" 
                  :key="event.id"
                  :class="['timeline-event', event.type]"
                  @click="editEvent(event)"
                >
                  <div class="event-content">
                    <div class="event-title">{{ event.title }}</div>
                    <div class="event-description">{{ event.description }}</div>
                    <div class="event-time">{{ formatEventTime(event) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建/编辑事件模态框 -->
    <div v-if="showCreateModal || showEditModal" class="ai-modal-overlay">
      <div class="ai-modal">
        <div class="modal-header">
          <div class="modal-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>{{ showEditModal ? 'AI智能编辑事件' : 'AI智能创建事件' }}</h3>
          <button @click="closeModal" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="saveEvent" class="modal-form">
          <div class="form-group">
            <label>事件标题</label>
            <input 
              v-model="eventForm.title" 
              type="text" 
              class="form-input"
              placeholder="输入事件标题..."
              required
            >
          </div>
          
          <div class="form-group">
            <label>事件描述</label>
            <textarea 
              v-model="eventForm.description" 
              class="form-textarea"
              placeholder="描述事件详情..."
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>开始时间</label>
              <input 
                v-model="eventForm.startTime" 
                type="datetime-local" 
                class="form-input"
                required
              >
            </div>
            <div class="form-group">
              <label>结束时间</label>
              <input 
                v-model="eventForm.endTime" 
                type="datetime-local" 
                class="form-input"
                required
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>事件类型</label>
              <select v-model="eventForm.type" class="form-select">
                <option value="meeting">会议</option>
                <option value="task">任务</option>
                <option value="reminder">提醒</option>
                <option value="personal">个人</option>
              </select>
            </div>
            <div class="form-group">
              <label>优先级</label>
              <select v-model="eventForm.priority" class="form-select">
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
          </div>
          
          <!-- AI智能建议 -->
          <div class="ai-suggestions">
            <div class="suggestion-header">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
              <span>AI智能建议</span>
            </div>
            <div class="suggestion-item">{{ getEventSuggestion() }}</div>
          </div>
          
          <div class="modal-actions">
            <button type="submit" class="ai-btn primary">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ showEditModal ? 'AI智能更新' : 'AI智能创建' }}
            </button>
            <button type="button" @click="closeModal" class="ai-btn secondary">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface CalendarEvent {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  type: 'meeting' | 'task' | 'reminder' | 'personal'
  priority: 'high' | 'medium' | 'low'
  completed?: boolean
}

interface DayData {
  date: string
  day: number
  dayName: string
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  events: CalendarEvent[]
}

// 响应式数据
const showAIInsights = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const currentView = ref<'month' | 'week' | 'day'>('month')
const currentDate = ref(new Date())
const selectedDay = ref<DayData | null>(null)
const events = ref<CalendarEvent[]>([])

// 事件表单
const eventForm = ref<Partial<CalendarEvent>>({
  title: '',
  description: '',
  startTime: '',
  endTime: '',
  type: 'meeting',
  priority: 'medium'
})

// 视图选项
const viewOptions = [
  { value: 'month', label: '月', icon: 'Calendar' },
  { value: 'week', label: '周', icon: 'CalendarDays' },
  { value: 'day', label: '日', icon: 'Clock' }
]

// 星期标题
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 小时数组
const hours = Array.from({ length: 24 }, (_, i) => i)

// 计算属性
const monthDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days: DayData[] = []
  const today = new Date()
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    const dayEvents = events.value.filter(event => {
      const eventDate = new Date(event.startTime)
      return eventDate.toDateString() === date.toDateString()
    })
    
    days.push({
      date: date.toISOString().split('T')[0],
      day: date.getDate(),
      dayName: weekdays[date.getDay()],
      isCurrentMonth: date.getMonth() === month,
      isToday: date.toDateString() === today.toDateString(),
      isSelected: selectedDay.value?.date === date.toISOString().split('T')[0],
      events: dayEvents
    })
  }
  
  return days
})

const weekDays = computed(() => {
  const startOfWeek = new Date(currentDate.value)
  const day = startOfWeek.getDay()
  startOfWeek.setDate(startOfWeek.getDate() - day)
  
  const days: DayData[] = []
  const today = new Date()
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    
    const dayEvents = events.value.filter(event => {
      const eventDate = new Date(event.startTime)
      return eventDate.toDateString() === date.toDateString()
    })
    
    days.push({
      date: date.toISOString().split('T')[0],
      day: date.getDate(),
      dayName: weekdays[date.getDay()],
      isCurrentMonth: true,
      isToday: date.toDateString() === today.toDateString(),
      isSelected: selectedDay.value?.date === date.toISOString().split('T')[0],
      events: dayEvents
    })
  }
  
  return days
})

// 方法
const getCurrentPeriodTitle = () => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth() + 1
  
  if (currentView.value === 'month') {
    return `${year}年${month}月`
  } else if (currentView.value === 'week') {
    const startOfWeek = new Date(currentDate.value)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    return `${startOfWeek.getMonth() + 1}月${startOfWeek.getDate()}日 - ${endOfWeek.getMonth() + 1}月${endOfWeek.getDate()}日`
  } else {
    return `${year}年${month}月${currentDate.value.getDate()}日`
  }
}

const previousPeriod = () => {
  const newDate = new Date(currentDate.value)
  if (currentView.value === 'month') {
    newDate.setMonth(newDate.getMonth() - 1)
  } else if (currentView.value === 'week') {
    newDate.setDate(newDate.getDate() - 7)
  } else {
    newDate.setDate(newDate.getDate() - 1)
  }
  currentDate.value = newDate
}

const nextPeriod = () => {
  const newDate = new Date(currentDate.value)
  if (currentView.value === 'month') {
    newDate.setMonth(newDate.getMonth() + 1)
  } else if (currentView.value === 'week') {
    newDate.setDate(newDate.getDate() + 7)
  } else {
    newDate.setDate(newDate.getDate() + 1)
  }
  currentDate.value = newDate
}

const selectDay = (day: DayData) => {
  selectedDay.value = day
  currentDate.value = new Date(day.date)
  if (currentView.value !== 'day') {
    currentView.value = 'day'
  }
}

const formatHour = (hour: number) => {
  return `${hour.toString().padStart(2, '0')}:00`
}

const formatSelectedDate = () => {
  if (!selectedDay.value) return ''
  const date = new Date(selectedDay.value.date)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`
}

const getEventsForHour = (day: DayData, hour: number) => {
  return day.events.filter(event => {
    const startHour = new Date(event.startTime).getHours()
    const endHour = new Date(event.endTime).getHours()
    return hour >= startHour && hour <= endHour
  })
}

const getEventStyle = (event: CalendarEvent) => {
  const start = new Date(event.startTime)
  const end = new Date(event.endTime)
  const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  return {
    height: `${Math.max(duration * 60, 30)}px`,
    top: `${start.getMinutes()}px`
  }
}

const formatEventTime = (event: CalendarEvent) => {
  const start = new Date(event.startTime)
  const end = new Date(event.endTime)
  return `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`
}

const getDayEvents = () => {
  if (!selectedDay.value) return []
  return selectedDay.value.events
}

const getDayDuration = () => {
  const dayEvents = getDayEvents()
  const totalMinutes = dayEvents.reduce((total, event) => {
    const start = new Date(event.startTime)
    const end = new Date(event.endTime)
    return total + (end.getTime() - start.getTime()) / (1000 * 60)
  }, 0)
  return Math.round(totalMinutes / 60 * 10) / 10
}

const editEvent = (event: CalendarEvent) => {
  eventForm.value = { ...event }
  showEditModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  eventForm.value = {
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: 'meeting',
    priority: 'medium'
  }
}

const saveEvent = () => {
  if (showEditModal.value) {
    // 更新事件
    const index = events.value.findIndex(e => e.id === eventForm.value.id)
    if (index !== -1) {
      events.value[index] = { ...eventForm.value } as CalendarEvent
    }
  } else {
    // 创建新事件
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      ...eventForm.value
    } as CalendarEvent
    events.value.push(newEvent)
  }
  closeModal()
}

// AI功能方法
const getMostFreeDay = () => {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  return days[Math.floor(Math.random() * days.length)]
}

const getScheduleHealth = () => {
  const totalEvents = events.value.length
  if (totalEvents === 0) return '日程安排良好，有充足的自由时间'
  if (totalEvents < 5) return '日程安排合理，工作生活平衡'
  if (totalEvents < 10) return '日程较为紧凑，建议适当调整'
  return '日程过于密集，建议优化时间安排'
}

const getOptimalMeetingTime = () => {
  const times = ['9:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00']
  return times[Math.floor(Math.random() * times.length)]
}

const getTotalEvents = () => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  return events.value.filter(event => {
    const eventDate = new Date(event.startTime)
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear
  }).length
}

const getEventGrowth = () => {
  return Math.floor(Math.random() * 30) + 5
}

const getCompletedEvents = () => {
  return events.value.filter(event => event.completed).length
}

const getCompletionRate = () => {
  if (events.value.length === 0) return 0
  return Math.round((getCompletedEvents() / events.value.length) * 100)
}

const getAverageEventDuration = () => {
  if (events.value.length === 0) return 0
  const totalDuration = events.value.reduce((total, event) => {
    const start = new Date(event.startTime)
    const end = new Date(event.endTime)
    return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  }, 0)
  return Math.round(totalDuration / events.value.length * 10) / 10
}

const getEfficiencyTrend = () => {
  const trends = ['效率提升', '保持稳定', '需要优化']
  return trends[Math.floor(Math.random() * trends.length)]
}

const getUpcomingEvents = () => {
  const now = new Date()
  return events.value.filter(event => {
    const eventDate = new Date(event.startTime)
    return eventDate > now
  }).length
}

const getTodayEvents = () => {
  const today = new Date()
  return events.value.filter(event => {
    const eventDate = new Date(event.startTime)
    return eventDate.toDateString() === today.toDateString()
  }).length
}

const getEventSuggestion = () => {
  const suggestions = [
    '建议将重要会议安排在上午，此时注意力最集中',
    '连续会议之间建议留出15分钟缓冲时间',
    '午餐时间建议安排轻松的个人事务',
    '下午3-4点是创造性工作的黄金时间'
  ]
  return suggestions[Math.floor(Math.random() * suggestions.length)]
}

// 加载示例数据
const loadSampleData = () => {
  const sampleEvents: CalendarEvent[] = [
    {
      id: '1',
      title: '团队会议',
      description: '讨论项目进展和下周计划',
      startTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 86400000 + 3600000).toISOString().slice(0, 16),
      type: 'meeting',
      priority: 'high'
    },
    {
      id: '2',
      title: '客户演示',
      description: '向客户展示产品功能',
      startTime: new Date(Date.now() + 172800000).toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 172800000 + 7200000).toISOString().slice(0, 16),
      type: 'meeting',
      priority: 'high'
    },
    {
      id: '3',
      title: '代码审查',
      description: '审查新功能的代码实现',
      startTime: new Date(Date.now() + 259200000).toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 259200000 + 1800000).toISOString().slice(0, 16),
      type: 'task',
      priority: 'medium'
    }
  ]
  events.value = sampleEvents
}

// 组件挂载时加载数据
onMounted(() => {
  loadSampleData()
})
</script>

<style scoped>
/* AI日历容器 */
.ai-calendar-container {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.1) 0%, 
    rgba(139, 92, 246, 0.1) 25%,
    rgba(168, 85, 247, 0.1) 50%,
    rgba(236, 72, 153, 0.1) 75%,
    rgba(239, 68, 68, 0.1) 100%);
  backdrop-filter: blur(20px);
  padding: 2rem;
}

/* AI助手头部 */
.ai-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-assistant {
  display: flex;
  align-items: center;
  gap: 1.5rem;
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
  overflow: hidden;
}

.avatar-glow {
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  animation: rotate 3s linear infinite;
  z-index: -1;
}

.avatar-icon {
  width: 30px;
  height: 30px;
  color: white;
}

.assistant-text {
  color: white;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
  opacity: 0.8;
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
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.ai-btn svg {
  width: 18px;
  height: 18px;
}

.insights-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.insights-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.create-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

/* AI洞察面板 */
.ai-insights-panel {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.insights-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.insight-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.insight-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.insight-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.insight-text h3 {
  margin: 0 0 0.5rem 0;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
}

.insight-text p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
}

/* 智能统计仪表板 */
.ai-dashboard {
  margin-bottom: 2rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card.primary .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.success .stat-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-card.warning .stat-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-card.info .stat-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.stat-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.25rem;
}

.stat-trend {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

/* 日历控制 */
.calendar-controls {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.view-switcher {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.view-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.view-icon {
  width: 16px;
  height: 16px;
}

.calendar-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.nav-btn svg {
  width: 20px;
  height: 20px;
}

.current-period {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
  min-width: 200px;
  text-align: center;
}

/* 日历主体 */
.calendar-main {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 月视图 */
.month-view {
  width: 100%;
}

.calendar-grid {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 1rem;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

.weekday-header {
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

.day-cell {
  min-height: 120px;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.day-cell:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.02);
}

.day-cell.other-month {
  opacity: 0.3;
}

.day-cell.today {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border: 2px solid rgba(102, 126, 234, 0.5);
}

.day-cell.selected {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  border: 2px solid #667eea;
}

.day-number {
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.day-events {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.event-dot {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #667eea;
}

.event-dot.meeting {
  background: #667eea;
}

.event-dot.task {
  background: #10b981;
}

.event-dot.reminder {
  background: #f59e0b;
}

.event-dot.personal {
  background: #ec4899;
}

.more-events {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 2px;
}

/* 周视图 */
.week-view {
  width: 100%;
}

.week-grid {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 1rem;
}

.time-column {
  display: flex;
  flex-direction: column;
}

.time-slot {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.week-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

.week-day {
  display: flex;
  flex-direction: column;
}

.week-day-header {
  padding: 1rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px 8px 0 0;
  margin-bottom: 1rem;
}

.day-name {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.25rem;
}

.day-number {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
}

.day-number.today {
  color: #667eea;
}

.day-timeline {
  flex: 1;
  position: relative;
}

.hour-slot {
  height: 60px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.week-event {
  position: absolute;
  left: 4px;
  right: 4px;
  background: #667eea;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.week-event:hover {
  transform: scale(1.02);
  z-index: 10;
}

.week-event.meeting {
  background: #667eea;
}

.week-event.task {
  background: #10b981;
}

.week-event.reminder {
  background: #f59e0b;
}

.week-event.personal {
  background: #ec4899;
}

.event-title {
  font-weight: 600;
  margin-bottom: 2px;
}

.event-time {
  font-size: 0.7rem;
  opacity: 0.8;
}

/* 日视图 */
.day-view {
  width: 100%;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.day-header h3 {
  margin: 0;
  color: white;
  font-size: 1.5rem;
}

.day-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.timeline-hours {
  display: flex;
  flex-direction: column;
}

.timeline-hour {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 1rem;
  min-height: 80px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.hour-label {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.hour-events {
  position: relative;
  padding: 0.5rem;
}

.timeline-event {
  background: #667eea;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.timeline-event:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.timeline-event.meeting {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.timeline-event.task {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.timeline-event.reminder {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.timeline-event.personal {
  background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
}

.event-content {
  color: white;
}

.event-content .event-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.event-description {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.event-content .event-time {
  font-size: 0.8rem;
  opacity: 0.8;
}

/* 模态框 */
.ai-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.ai-modal {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.modal-header h3 {
  flex: 1;
  margin: 0;
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  font-weight: 600;
  color: white;
  font-size: 0.9rem;
}

.form-input,
.form-textarea,
.form-select {
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-select option {
  background: #1f2937;
  color: white;
}

/* AI建议 */
.ai-suggestions {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.suggestion-header svg {
  width: 16px;
  height: 16px;
  color: #667eea;
}

.suggestion-item {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  line-height: 1.5;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.ai-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.ai-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.ai-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 动画 */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-calendar-container {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .calendar-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .week-grid {
    grid-template-columns: 60px 1fr;
  }
  
  .week-days {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .ai-modal {
    width: 95%;
    margin: 1rem;
  }
}

@media (max-width: 480px) {
  .insights-content {
    grid-template-columns: 1fr;
  }
  
  .view-switcher {
    flex-direction: column;
    width: 100%;
  }
  
  .view-btn {
    justify-content: center;
  }
  
  .days-grid {
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }
  
  .day-cell {
    min-height: 80px;
    padding: 0.25rem;
  }
  
  .week-days {
    grid-template-columns: 1fr;
  }
}
</style>