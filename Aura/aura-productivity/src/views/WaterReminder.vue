<template>
  <div class="water-container">
    <div class="floating-particles"></div>
    <div class="content-wrapper">
      <div class="header-section">
        <h2 class="main-title">
          <span class="title-icon">💧</span>
          科学喝水
        </h2>
        <div class="subtitle">健康生活，从每一滴水开始</div>
      </div>

      <!-- 今日喝水进度 -->
      <div class="progress-card">
        <div class="card-header">
          <span class="card-icon">🎯</span>
          <h3 class="card-title">今日进度</h3>
          <div class="progress-percentage">{{ progressPercentage }}%</div>
        </div>
        <div class="water-progress">
          <div class="progress-ring-container">
            <svg class="progress-ring" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#4facfe" />
                  <stop offset="100%" stop-color="#00f2fe" />
                </linearGradient>
                <filter id="waterGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/> 
                  </feMerge>
                </filter>
              </defs>
              <circle
                cx="60"
                cy="60"
                r="52"
                stroke="rgba(255,255,255,0.1)"
                stroke-width="6"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                stroke="url(#waterGradient)"
                stroke-width="6"
                fill="none"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="strokeDashoffset"
                class="progress-circle"
                filter="url(#waterGlow)"
              />
            </svg>
            <div class="center-content">
              <div class="water-amount">{{ todayIntake }}</div>
              <div class="water-unit">ml</div>
              <div class="water-target">目标: {{ dailyTarget }}ml</div>
            </div>
          </div>
          <div class="quick-actions">
            <button
              v-for="amount in quickAmounts"
              :key="amount"
              @click="addWater(amount)"
              class="quick-btn"
            >
              <span class="btn-icon">{{ getWaterIcon(amount) }}</span>
              {{ amount }}ml
            </button>
          </div>
        </div>
      </div>

      <!-- 自定义添加 -->
      <div class="add-water-card">
        <div class="card-header">
          <span class="card-icon">➕</span>
          <h3 class="card-title">自定义添加</h3>
        </div>
        <div class="custom-input">
          <input
            v-model.number="customAmount"
            type="number"
            min="1"
            max="2000"
            class="amount-input"
            placeholder="输入毫升数"
          />
          <button @click="addCustomWater" class="add-custom-btn">
            <span class="btn-icon">✅</span>
            添加
          </button>
        </div>
      </div>

      <!-- 设置区域 -->
      <div class="settings-card">
        <div class="card-header">
          <span class="card-icon">⚙️</span>
          <h3 class="card-title">设置</h3>
        </div>
        <div class="settings-grid">
          <div class="setting-item">
            <label class="setting-label">
              <span class="label-icon">🎯</span>
              每日目标
            </label>
            <div class="input-wrapper">
              <input
                v-model.number="dailyTarget"
                type="number"
                min="500"
                max="5000"
                step="100"
                class="setting-input"
              />
              <span class="input-unit">ml</span>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span class="label-icon">⏰</span>
              提醒间隔
            </label>
            <div class="input-wrapper">
              <select v-model="reminderInterval" class="setting-select">
                <option value="30">30分钟</option>
                <option value="60">1小时</option>
                <option value="90">1.5小时</option>
                <option value="120">2小时</option>
              </select>
            </div>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span class="label-icon">🔔</span>
              提醒开关
            </label>
            <button
              @click="toggleReminder"
              class="toggle-reminder-btn"
              :class="{ active: reminderEnabled }"
            >
              <span class="toggle-icon">
                {{ reminderEnabled ? '🔔' : '🔕' }}
              </span>
              {{ reminderEnabled ? '已开启' : '已关闭' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 今日记录 -->
      <div class="records-card">
        <div class="card-header">
          <span class="card-icon">📝</span>
          <h3 class="card-title">今日记录</h3>
          <div class="record-count">{{ todayRecords.length }}次</div>
        </div>
        <div v-if="todayRecords.length === 0" class="empty-state">
          <div class="empty-icon">🚰</div>
          <div class="empty-text">今天还没有喝水记录</div>
          <div class="empty-hint">开始记录你的第一杯水吧！</div>
        </div>
        <div v-else class="records-list">
          <div
            v-for="record in todayRecords"
            :key="record.id"
            class="record-item"
          >
            <div class="record-icon">{{ getWaterIcon(record.amount) }}</div>
            <div class="record-info">
              <div class="record-amount">{{ record.amount }}ml</div>
              <div class="record-time">{{ formatTime(record.timestamp) }}</div>
            </div>
            <button
              @click="deleteRecord(record.id)"
              class="delete-record-btn"
            >
              <span class="delete-icon">🗑️</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 统计图表 -->
      <div class="stats-card">
        <div class="card-header">
          <span class="card-icon">📊</span>
          <h3 class="card-title">7日统计</h3>
        </div>
        <div class="chart-container">
          <div class="chart-bars">
            <div
              v-for="(day, index) in weeklyStats"
              :key="index"
              class="chart-bar"
            >
              <div
                class="bar-fill"
                :style="{ height: (day.amount / dailyTarget * 100) + '%' }"
              ></div>
              <div class="bar-label">{{ day.label }}</div>
              <div class="bar-amount">{{ day.amount }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 喝水提醒弹窗 -->
    <div v-if="showReminder" class="reminder-modal">
      <div class="modal-content">
        <div class="reminder-animation">
          <div class="water-drop">💧</div>
        </div>
        <div class="reminder-title">该喝水啦！</div>
        <div class="reminder-message">
          保持水分充足，让身体更健康
        </div>
        <div class="modal-actions">
          <button @click="snoozeReminder" class="snooze-btn">
            <span class="btn-icon">😴</span>
            稍后提醒 (10分钟)
          </button>
          <button @click="dismissReminder" class="dismiss-btn">
            <span class="btn-icon">✅</span>
            知道了
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface WaterRecord {
  id: string
  amount: number
  timestamp: number
}

interface DayStats {
  label: string
  amount: number
}

// 响应式数据
const todayIntake = ref(0)
const dailyTarget = ref(2000)
const customAmount = ref(250)
const reminderInterval = ref(60) // 分钟
const reminderEnabled = ref(true)
const showReminder = ref(false)
const waterRecords = ref<WaterRecord[]>([])
const quickAmounts = [100, 200, 250, 300, 500]

// 定时器
let reminderTimer: number | null = null

// 计算属性
const circumference = 2 * Math.PI * 52
const progressPercentage = computed(() => {
  return Math.min(Math.round((todayIntake.value / dailyTarget.value) * 100), 100)
})
const strokeDashoffset = computed(() => {
  const progress = todayIntake.value / dailyTarget.value
  return circumference * (1 - Math.min(progress, 1))
})

// 今日记录
const todayRecords = computed(() => {
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const todayEnd = todayStart + 24 * 60 * 60 * 1000
  
  return waterRecords.value
    .filter(record => record.timestamp >= todayStart && record.timestamp < todayEnd)
    .sort((a, b) => b.timestamp - a.timestamp)
})

// 7日统计
const weeklyStats = computed(() => {
  const stats: DayStats[] = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    const dayEnd = dayStart + 24 * 60 * 60 * 1000
    
    const dayRecords = waterRecords.value.filter(
      record => record.timestamp >= dayStart && record.timestamp < dayEnd
    )
    
    const totalAmount = dayRecords.reduce((sum, record) => sum + record.amount, 0)
    
    const dayNames = ['日', '一', '二', '三', '四', '五', '六']
    const label = i === 0 ? '今天' : dayNames[date.getDay()]
    
    stats.push({ label, amount: totalAmount })
  }
  
  return stats
})

// 获取水杯图标
const getWaterIcon = (amount: number) => {
  if (amount <= 150) return '🥃'
  if (amount <= 250) return '🥤'
  if (amount <= 400) return '🧃'
  return '🍼'
}

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// 添加喝水记录
const addWater = (amount: number) => {
  const record: WaterRecord = {
    id: Date.now().toString(),
    amount,
    timestamp: Date.now()
  }
  
  waterRecords.value.push(record)
  updateTodayIntake()
  saveData()
  
  // 添加成功动画效果
  showSuccessAnimation()
}

// 添加自定义水量
const addCustomWater = () => {
  if (customAmount.value > 0 && customAmount.value <= 2000) {
    addWater(customAmount.value)
    customAmount.value = 250
  } else {
    alert('请输入1-2000ml之间的有效数值')
  }
}

// 删除记录
const deleteRecord = (id: string) => {
  const index = waterRecords.value.findIndex(record => record.id === id)
  if (index > -1) {
    waterRecords.value.splice(index, 1)
    updateTodayIntake()
    saveData()
  }
}

// 更新今日摄入量
const updateTodayIntake = () => {
  todayIntake.value = todayRecords.value.reduce((sum, record) => sum + record.amount, 0)
}

// 切换提醒开关
const toggleReminder = () => {
  reminderEnabled.value = !reminderEnabled.value
  if (reminderEnabled.value) {
    startReminderTimer()
  } else {
    stopReminderTimer()
  }
  saveSettings()
}

// 开始提醒定时器
const startReminderTimer = () => {
  stopReminderTimer()
  if (reminderEnabled.value) {
    reminderTimer = window.setInterval(() => {
      showReminder.value = true
      playReminderSound()
    }, reminderInterval.value * 60 * 1000)
  }
}

// 停止提醒定时器
const stopReminderTimer = () => {
  if (reminderTimer) {
    clearInterval(reminderTimer)
    reminderTimer = null
  }
}

// 稍后提醒
const snoozeReminder = () => {
  showReminder.value = false
  // 10分钟后再次提醒
  setTimeout(() => {
    if (reminderEnabled.value) {
      showReminder.value = true
      playReminderSound()
    }
  }, 10 * 60 * 1000)
}

// 关闭提醒
const dismissReminder = () => {
  showReminder.value = false
}

// 播放提醒音效
const playReminderSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.value = 600
  oscillator.type = 'sine'
  
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.3)
}

// 显示成功动画
const showSuccessAnimation = () => {
  // 这里可以添加成功动画逻辑
  console.log('Water added successfully!')
}

// 保存数据
const saveData = () => {
  localStorage.setItem('aura-water-records', JSON.stringify(waterRecords.value))
  localStorage.setItem('aura-water-today-intake', todayIntake.value.toString())
}

// 保存设置
const saveSettings = () => {
  const settings = {
    dailyTarget: dailyTarget.value,
    reminderInterval: reminderInterval.value,
    reminderEnabled: reminderEnabled.value
  }
  localStorage.setItem('aura-water-settings', JSON.stringify(settings))
}

// 加载数据
const loadData = () => {
  // 加载记录
  const savedRecords = localStorage.getItem('aura-water-records')
  if (savedRecords) {
    try {
      waterRecords.value = JSON.parse(savedRecords)
      updateTodayIntake()
    } catch (error) {
      console.error('Failed to load water records:', error)
      waterRecords.value = []
    }
  }
  
  // 加载设置
  const savedSettings = localStorage.getItem('aura-water-settings')
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings)
      dailyTarget.value = settings.dailyTarget || 2000
      reminderInterval.value = settings.reminderInterval || 60
      reminderEnabled.value = settings.reminderEnabled !== false
    } catch (error) {
      console.error('Failed to load water settings:', error)
    }
  }
}

// 监听设置变化
watch([dailyTarget, reminderInterval], () => {
  saveSettings()
})

watch(reminderInterval, () => {
  if (reminderEnabled.value) {
    startReminderTimer()
  }
})

// 生命周期
onMounted(() => {
  loadData()
  if (reminderEnabled.value) {
    startReminderTimer()
  }
})

onUnmounted(() => {
  stopReminderTimer()
})
</script>

<style scoped>
/* 科学喝水模块样式 */
.water-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.content-wrapper {
  position: relative;
  z-index: 10;
  max-width: 600px;
  margin: 0 auto;
}

/* 头部样式 */
.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.title-icon {
  font-size: 2rem;
  animation: drop 3s ease-in-out infinite;
}

@keyframes drop {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(10px); }
}

.subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  font-weight: 300;
}

/* 卡片基础样式 */
.progress-card, .add-water-card, .settings-card, .records-card, .stats-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.card-icon {
  font-size: 1.5rem;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0;
  flex: 1;
}

.progress-percentage, .record-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

/* 进度环 */
.progress-ring-container {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 2rem;
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-circle {
  transition: stroke-dashoffset 1s ease;
  stroke-linecap: round;
}

.center-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.water-amount {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
}

.water-unit {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
}

.water-target {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

/* 快捷按钮 */
.quick-actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.quick-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.quick-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
}

.btn-icon {
  font-size: 1.5rem;
}

/* 自定义添加 */
.custom-input {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.amount-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 500;
}

.amount-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
}

.amount-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.add-custom-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-custom-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

/* 设置区域 */
.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.label-icon {
  font-size: 1.2rem;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.setting-input, .setting-select {
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 600;
}

.setting-input:focus, .setting-select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
}

.input-unit {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.toggle-reminder-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-reminder-btn.active {
  background: linear-gradient(135deg, #4ecdc4, #6ee7dd);
  border-color: #4ecdc4;
}

.toggle-reminder-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.toggle-icon {
  font-size: 1.2rem;
}

/* 记录列表 */
.empty-state {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.8);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-hint {
  font-size: 0.9rem;
  opacity: 0.8;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
}

.record-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.record-icon {
  font-size: 1.5rem;
}

.record-info {
  flex: 1;
}

.record-amount {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
}

.record-time {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.delete-record-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 107, 107, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-record-btn:hover {
  background: rgba(255, 107, 107, 0.4);
  transform: scale(1.1);
}

.delete-icon {
  font-size: 1rem;
}

/* 统计图表 */
.chart-container {
  padding: 1rem 0;
}

.chart-bars {
  display: flex;
  justify-content: space-between;
  align-items: end;
  height: 150px;
  gap: 0.5rem;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #4facfe, #00f2fe);
  border-radius: 0.25rem 0.25rem 0 0;
  min-height: 4px;
  transition: height 0.5s ease;
  margin-bottom: auto;
}

.bar-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.5rem;
  font-weight: 600;
}

.bar-amount {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.25rem;
}

/* 提醒弹窗 */
.reminder-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 2rem;
  padding: 2rem;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.reminder-animation {
  margin-bottom: 1rem;
}

.water-drop {
  font-size: 4rem;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.reminder-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.reminder-message {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.snooze-btn, .dismiss-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.snooze-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.snooze-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.dismiss-btn {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
}

.dismiss-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
  }
  
  .custom-input {
    flex-direction: column;
    align-items: stretch;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>