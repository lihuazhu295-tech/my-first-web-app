<template>
  <div class="pomodoro-container">
    <div class="floating-particles"></div>
    <div class="content-wrapper">
      <div class="header-section">
        <h2 class="main-title">
          <span class="title-icon">🍅</span>
          番茄钟
        </h2>
        <div class="subtitle">专注工作，高效生活</div>
      </div>

      <!-- 番茄钟主体 -->
      <div class="timer-main">
        <!-- 主时间显示 -->
        <div class="time-display">
          <div class="time-text" :class="{ 'pulse': isRunning }">
            {{ formatTime(timeLeft) }}
          </div>
          <div class="mode-indicator" :class="currentMode">
            <span class="mode-icon">{{ currentMode === 'work' ? '💼' : '☕' }}</span>
            {{ currentMode === 'work' ? '工作时间' : '休息时间' }}
          </div>
        </div>

        <!-- 增强版进度环 -->
        <div class="progress-ring-container">
          <div class="progress-ring-bg"></div>
          <svg class="progress-ring" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" :stop-color="currentMode === 'work' ? '#ff6b6b' : '#4ecdc4'" />
                <stop offset="100%" :stop-color="currentMode === 'work' ? '#ff8e8e' : '#6ee7dd'" />
              </linearGradient>
              <filter id="glow">
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
              stroke="url(#progressGradient)"
              stroke-width="6"
              fill="none"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="strokeDashoffset"
              class="progress-circle"
              filter="url(#glow)"
            />
          </svg>
          <div class="center-content">
            <div class="center-time">
              {{ Math.floor(timeLeft / 60) }}<span class="time-separator">:</span>{{ (timeLeft % 60).toString().padStart(2, '0') }}
            </div>
            <div class="center-label">{{ currentMode === 'work' ? 'FOCUS' : 'BREAK' }}</div>
          </div>
        </div>

        <!-- 控制按钮 -->
        <div class="control-buttons">
          <button
            @click="toggleTimer"
            class="primary-btn"
            :class="{ 'running': isRunning }"
          >
            <span class="btn-icon">{{ isRunning ? '⏸️' : '▶️' }}</span>
            {{ isRunning ? '暂停' : '开始' }}
          </button>
          <button
            @click="resetTimer"
            class="secondary-btn"
          >
            <span class="btn-icon">🔄</span>
            重置
          </button>
        </div>
      </div>

      <!-- 设置和统计区域 -->
      <div class="bottom-section">
        <!-- 设置区域 -->
        <div class="settings-card">
          <div class="card-header">
            <span class="card-icon">⚙️</span>
            <h3 class="card-title">设置</h3>
          </div>
          <div class="settings-grid">
            <div class="setting-item">
              <label class="setting-label">
                <span class="label-icon">💼</span>
                工作时间
              </label>
              <div class="input-wrapper">
                <input
                  v-model.number="workDuration"
                  type="number"
                  min="1"
                  max="60"
                  class="setting-input"
                  :disabled="isRunning"
                />
                <span class="input-unit">分钟</span>
              </div>
            </div>
            <div class="setting-item">
              <label class="setting-label">
                <span class="label-icon">☕</span>
                休息时间
              </label>
              <div class="input-wrapper">
                <input
                  v-model.number="breakDuration"
                  type="number"
                  min="1"
                  max="30"
                  class="setting-input"
                  :disabled="isRunning"
                />
                <span class="input-unit">分钟</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 今日统计 -->
        <div class="stats-card">
          <div class="card-header">
            <span class="card-icon">📊</span>
            <h3 class="card-title">今日统计</h3>
          </div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-icon">🍅</div>
              <div class="stat-value">{{ completedPomodoros }}</div>
              <div class="stat-label">完成番茄</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">⏱️</div>
              <div class="stat-value">{{ formatTime(totalWorkTime) }}</div>
              <div class="stat-label">工作时长</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 提示通知 -->
    <div
      v-if="showNotification"
      class="fixed top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg"
    >
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// 状态管理
const workDuration = ref(25) // 工作时间（分钟）
const breakDuration = ref(5)  // 休息时间（分钟）
const timeLeft = ref(workDuration.value * 60) // 剩余时间（秒）
const isRunning = ref(false)
const currentMode = ref<'work' | 'break'>('work') // 当前模式
const completedPomodoros = ref(0) // 完成的番茄钟数量
const totalWorkTime = ref(0) // 总工作时长（秒）
const showNotification = ref(false)
const notificationMessage = ref('')

// 计算属性
const circumference = 2 * Math.PI * 52
const strokeDashoffset = computed(() => {
  const totalDuration = currentMode.value === 'work' ? workDuration.value : breakDuration.value
  const progress = (totalDuration * 60 - timeLeft.value) / (totalDuration * 60)
  return circumference * (1 - progress)
})

// 计时器
let timer: number | null = null

// 格式化时间显示
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 显示通知
const showNotificationMessage = (message: string) => {
  notificationMessage.value = message
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

// 播放提示音
const playNotificationSound = () => {
  // 创建音频上下文来播放提示音
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.value = 800
  oscillator.type = 'sine'
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.5)
}

// 切换计时器
const toggleTimer = () => {
  if (isRunning.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

// 开始计时器
const startTimer = () => {
  if (timer) return
  
  isRunning.value = true
  timer = window.setInterval(() => {
    timeLeft.value--
    
    if (currentMode.value === 'work') {
      totalWorkTime.value++
    }
    
    if (timeLeft.value <= 0) {
      completeTimer()
    }
  }, 1000)
}

// 暂停计时器
const pauseTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  isRunning.value = false
}

// 完成计时器
const completeTimer = () => {
  pauseTimer()
  
  if (currentMode.value === 'work') {
    completedPomodoros.value++
    currentMode.value = 'break'
    timeLeft.value = breakDuration.value * 60
    showNotificationMessage('工作时间结束！开始休息吧～')
    playNotificationSound()
  } else {
    currentMode.value = 'work'
    timeLeft.value = workDuration.value * 60
    showNotificationMessage('休息时间结束！继续工作吧～')
    playNotificationSound()
  }
  
  saveStats()
}

// 重置计时器
const resetTimer = () => {
  pauseTimer()
  currentMode.value = 'work'
  timeLeft.value = workDuration.value * 60
}

// 保存统计数据
const saveStats = () => {
  const stats = {
    completedPomodoros: completedPomodoros.value,
    totalWorkTime: totalWorkTime.value
  }
  localStorage.setItem('aura-pomodoro-stats', JSON.stringify(stats))
  console.log('Pomodoro stats saved:', stats)
}

// 加载统计数据
const loadStats = () => {
  const savedStats = localStorage.getItem('aura-pomodoro-stats')
  if (savedStats) {
    try {
      const stats = JSON.parse(savedStats)
      completedPomodoros.value = stats.completedPomodoros || 0
      totalWorkTime.value = stats.totalWorkTime || 0
      console.log('Pomodoro stats loaded:', stats)
    } catch (error) {
      console.error('Failed to load pomodoro stats:', error)
      completedPomodoros.value = 0
      totalWorkTime.value = 0
    }
  } else {
    console.log('No saved pomodoro stats found, initializing with defaults')
    completedPomodoros.value = 0
    totalWorkTime.value = 0
  }
}

// 加载设置
const loadSettings = () => {
  const savedSettings = localStorage.getItem('aura-pomodoro-settings')
  if (savedSettings) {
    const settings = JSON.parse(savedSettings)
    workDuration.value = settings.workDuration || 25
    breakDuration.value = settings.breakDuration || 5
    timeLeft.value = workDuration.value * 60
  }
}

// 保存设置
const saveSettings = () => {
  localStorage.setItem('aura-pomodoro-settings', JSON.stringify({
    workDuration: workDuration.value,
    breakDuration: breakDuration.value
  }))
}

// 监听设置变化
watch([workDuration, breakDuration], () => {
  if (!isRunning.value) {
    if (currentMode.value === 'work') {
      timeLeft.value = workDuration.value * 60
    } else {
      timeLeft.value = breakDuration.value * 60
    }
  }
  saveSettings()
})

// 生命周期
onMounted(() => {
  loadSettings()
  loadStats()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
/* 现代化番茄钟样式 */
.pomodoro-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  max-width: 500px;
  margin: 0 auto;
}

/* 头部样式 */
.header-section {
  text-align: center;
  margin-bottom: 3rem;
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
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  font-weight: 300;
}

/* 计时器主体 */
.timer-main {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 2rem;
  padding: 2.5rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
}

/* 时间显示 */
.time-display {
  text-align: center;
  margin-bottom: 2rem;
}

.time-text {
  font-size: 4rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.time-text.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.mode-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.mode-indicator.work {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
}

.mode-indicator.break {
  background: linear-gradient(135deg, #4ecdc4, #6ee7dd);
  color: white;
}

.mode-icon {
  font-size: 1.5rem;
}

/* 进度环容器 */
.progress-ring-container {
  position: relative;
  width: 280px;
  height: 280px;
  margin: 2rem auto;
}

.progress-ring-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  box-shadow: 
    inset 0 0 20px rgba(0, 0, 0, 0.1),
    0 0 20px rgba(255, 255, 255, 0.1);
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

.center-time {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.time-separator {
  opacity: 0.7;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

.center-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 2px;
}

/* 控制按钮 */
.control-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.primary-btn, .secondary-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.primary-btn {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
}

.primary-btn.running {
  background: linear-gradient(135deg, #ffa726, #ffcc02);
  box-shadow: 0 4px 15px rgba(255, 167, 38, 0.4);
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.2rem;
}

/* 底部区域 */
.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .bottom-section {
    grid-template-columns: 1fr;
  }
}

/* 卡片样式 */
.settings-card, .stats-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  padding: 1.5rem;
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

.setting-input {
  width: 60px;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-align: center;
  font-weight: 600;
}

.setting-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
}

.setting-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-unit {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

/* 统计区域 */
.stats-grid {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* 通知样式 */
.fixed {
  position: fixed;
}

.top-4 {
  top: 1rem;
}

.right-4 {
  right: 1rem;
}

.bg-primary {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
}

.text-primary-foreground {
  color: white;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.rounded-md {
  border-radius: 0.5rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>