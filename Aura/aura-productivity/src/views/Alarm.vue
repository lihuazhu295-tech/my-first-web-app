<template>
  <div class="alarm-container">
    <div class="floating-particles"></div>
    <div class="content-wrapper">
      <div class="header-section">
        <h2 class="main-title">
          <span class="title-icon">⏰</span>
          闹钟
        </h2>
        <div class="subtitle">准时提醒，高效生活</div>
      </div>

      <!-- 添加闹钟区域 -->
      <div class="add-alarm-card">
        <div class="card-header">
          <span class="card-icon">➕</span>
          <h3 class="card-title">添加闹钟</h3>
        </div>
        <div class="alarm-form">
          <div class="time-input-group">
            <div class="time-input">
              <label class="input-label">时间</label>
              <div class="time-picker">
                <input
                  v-model="newAlarm.hour"
                  type="number"
                  min="0"
                  max="23"
                  class="time-field"
                  placeholder="时"
                />
                <span class="time-separator">:</span>
                <input
                  v-model="newAlarm.minute"
                  type="number"
                  min="0"
                  max="59"
                  class="time-field"
                  placeholder="分"
                />
              </div>
            </div>
            <div class="label-input">
              <label class="input-label">标签</label>
              <input
                v-model="newAlarm.label"
                type="text"
                class="label-field"
                placeholder="闹钟标签"
                maxlength="20"
              />
            </div>
          </div>
          <div class="repeat-options">
            <label class="input-label">重复</label>
            <div class="repeat-days">
              <button
                v-for="(day, index) in weekDays"
                :key="index"
                @click="toggleRepeatDay(index)"
                class="day-btn"
                :class="{ active: newAlarm.repeatDays.includes(index) }"
              >
                {{ day }}
              </button>
            </div>
          </div>
          <button @click="addAlarm" class="add-btn">
            <span class="btn-icon">✅</span>
            添加闹钟
          </button>
        </div>
      </div>

      <!-- 闹钟列表 -->
      <div class="alarms-list">
        <div class="list-header">
          <span class="list-icon">📋</span>
          <h3 class="list-title">我的闹钟</h3>
          <span class="alarm-count">{{ alarms.length }}</span>
        </div>
        <div v-if="alarms.length === 0" class="empty-state">
          <div class="empty-icon">😴</div>
          <div class="empty-text">还没有设置闹钟</div>
          <div class="empty-hint">添加第一个闹钟开始高效生活吧！</div>
        </div>
        <div v-else class="alarm-items">
          <div
            v-for="alarm in alarms"
            :key="alarm.id"
            class="alarm-item"
            :class="{ active: alarm.enabled }"
          >
            <div class="alarm-info">
              <div class="alarm-time">
                {{ formatTime(alarm.hour, alarm.minute) }}
              </div>
              <div class="alarm-details">
                <div class="alarm-label">{{ alarm.label || '闹钟' }}</div>
                <div class="alarm-repeat">
                  {{ getRepeatText(alarm.repeatDays) }}
                </div>
              </div>
            </div>
            <div class="alarm-controls">
              <button
                @click="toggleAlarm(alarm.id)"
                class="toggle-btn"
                :class="{ enabled: alarm.enabled }"
              >
                <span class="toggle-icon">
                  {{ alarm.enabled ? '🔔' : '🔕' }}
                </span>
              </button>
              <button
                @click="deleteAlarm(alarm.id)"
                class="delete-btn"
              >
                <span class="delete-icon">🗑️</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 闹钟响铃弹窗 -->
    <div v-if="ringingAlarm" class="alarm-modal">
      <div class="modal-content">
        <div class="ringing-animation">
          <div class="alarm-bell">🔔</div>
        </div>
        <div class="ringing-time">
          {{ formatTime(ringingAlarm.hour, ringingAlarm.minute) }}
        </div>
        <div class="ringing-label">
          {{ ringingAlarm.label || '闹钟提醒' }}
        </div>
        <div class="modal-actions">
          <button @click="snoozeAlarm" class="snooze-btn">
            <span class="btn-icon">😴</span>
            稍后提醒 (5分钟)
          </button>
          <button @click="stopAlarm" class="stop-btn">
            <span class="btn-icon">⏹️</span>
            关闭闹钟
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Alarm {
  id: string
  hour: number
  minute: number
  label: string
  enabled: boolean
  repeatDays: number[] // 0-6 表示周日到周六
}

// 响应式数据
const alarms = ref<Alarm[]>([])
const newAlarm = ref({
  hour: new Date().getHours(),
  minute: new Date().getMinutes(),
  label: '',
  repeatDays: [] as number[]
})
const ringingAlarm = ref<Alarm | null>(null)
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

// 定时器
let checkInterval: number | null = null
let audioContext: AudioContext | null = null
let isRinging = false

// 格式化时间显示
const formatTime = (hour: number, minute: number) => {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

// 获取重复文本
const getRepeatText = (repeatDays: number[]) => {
  if (repeatDays.length === 0) return '仅一次'
  if (repeatDays.length === 7) return '每天'
  if (repeatDays.length === 5 && !repeatDays.includes(0) && !repeatDays.includes(6)) {
    return '工作日'
  }
  if (repeatDays.length === 2 && repeatDays.includes(0) && repeatDays.includes(6)) {
    return '周末'
  }
  return repeatDays.map(day => '周' + weekDays[day]).join(', ')
}

// 切换重复日期
const toggleRepeatDay = (dayIndex: number) => {
  const index = newAlarm.value.repeatDays.indexOf(dayIndex)
  if (index > -1) {
    newAlarm.value.repeatDays.splice(index, 1)
  } else {
    newAlarm.value.repeatDays.push(dayIndex)
  }
}

// 添加闹钟
const addAlarm = () => {
  if (newAlarm.value.hour < 0 || newAlarm.value.hour > 23 || 
      newAlarm.value.minute < 0 || newAlarm.value.minute > 59) {
    alert('请输入正确的时间格式')
    return
  }

  const alarm: Alarm = {
    id: Date.now().toString(),
    hour: newAlarm.value.hour,
    minute: newAlarm.value.minute,
    label: newAlarm.value.label,
    enabled: true,
    repeatDays: [...newAlarm.value.repeatDays]
  }

  alarms.value.push(alarm)
  saveAlarms()
  
  // 重置表单
  newAlarm.value = {
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
    label: '',
    repeatDays: []
  }
}

// 切换闹钟开关
const toggleAlarm = (id: string) => {
  const alarm = alarms.value.find(a => a.id === id)
  if (alarm) {
    alarm.enabled = !alarm.enabled
    saveAlarms()
  }
}

// 删除闹钟
const deleteAlarm = (id: string) => {
  const index = alarms.value.findIndex(a => a.id === id)
  if (index > -1) {
    alarms.value.splice(index, 1)
    saveAlarms()
  }
}

// 播放闹钟音效
const playAlarmSound = () => {
  if (isRinging) return
  
  isRinging = true
  audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  
  const playBeep = () => {
    if (!isRinging || !audioContext) return
    
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
    
    setTimeout(playBeep, 1000) // 每秒响一次
  }
  
  playBeep()
}

// 停止闹钟音效
const stopAlarmSound = () => {
  isRinging = false
  if (audioContext) {
    audioContext.close()
    audioContext = null
  }
}

// 检查闹钟
const checkAlarms = () => {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentDay = now.getDay()
  
  for (const alarm of alarms.value) {
    if (!alarm.enabled) continue
    
    if (alarm.hour === currentHour && alarm.minute === currentMinute) {
      // 检查是否需要在今天响铃
      if (alarm.repeatDays.length === 0 || alarm.repeatDays.includes(currentDay)) {
        triggerAlarm(alarm)
        
        // 如果是一次性闹钟，响铃后禁用
        if (alarm.repeatDays.length === 0) {
          alarm.enabled = false
          saveAlarms()
        }
        break
      }
    }
  }
}

// 触发闹钟
const triggerAlarm = (alarm: Alarm) => {
  ringingAlarm.value = alarm
  playAlarmSound()
}

// 稍后提醒
const snoozeAlarm = () => {
  if (!ringingAlarm.value) return
  
  stopAlarmSound()
  
  // 创建5分钟后的临时闹钟
  const now = new Date()
  now.setMinutes(now.getMinutes() + 5)
  
  const snoozeAlarm: Alarm = {
    id: Date.now().toString(),
    hour: now.getHours(),
    minute: now.getMinutes(),
    label: ringingAlarm.value.label + ' (稍后提醒)',
    enabled: true,
    repeatDays: []
  }
  
  alarms.value.push(snoozeAlarm)
  saveAlarms()
  
  ringingAlarm.value = null
}

// 关闭闹钟
const stopAlarm = () => {
  stopAlarmSound()
  ringingAlarm.value = null
}

// 保存闹钟到本地存储
const saveAlarms = () => {
  localStorage.setItem('aura-alarms', JSON.stringify(alarms.value))
}

// 加载闹钟从本地存储
const loadAlarms = () => {
  const saved = localStorage.getItem('aura-alarms')
  if (saved) {
    try {
      alarms.value = JSON.parse(saved)
    } catch (error) {
      console.error('Failed to load alarms:', error)
      alarms.value = []
    }
  }
}

// 生命周期
onMounted(() => {
  loadAlarms()
  // 每分钟检查一次闹钟
  checkInterval = window.setInterval(checkAlarms, 60000)
})

onUnmounted(() => {
  if (checkInterval) {
    clearInterval(checkInterval)
  }
  stopAlarmSound()
})
</script>

<style scoped>
/* 闹钟模块样式 */
.alarm-container {
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
  animation: swing 2s ease-in-out infinite;
}

@keyframes swing {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(15deg); }
  75% { transform: rotate(-15deg); }
}

.subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  font-weight: 300;
}

/* 卡片基础样式 */
.add-alarm-card, .alarms-list {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card-header, .list-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.card-icon, .list-icon {
  font-size: 1.5rem;
}

.card-title, .list-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0;
  flex: 1;
}

.alarm-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

/* 添加闹钟表单 */
.alarm-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.time-input-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 768px) {
  .time-input-group {
    grid-template-columns: 1fr;
  }
}

.input-label {
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.time-picker {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-field {
  width: 60px;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.time-field:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
}

.time-separator {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.label-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 500;
}

.label-field:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
}

.label-field::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

/* 重复选项 */
.repeat-days {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.day-btn {
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.day-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.day-btn.active {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  border-color: #ff6b6b;
  color: white;
  transform: scale(1.1);
}

/* 添加按钮 */
.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: none;
  border-radius: 1rem;
  background: linear-gradient(135deg, #4ecdc4, #6ee7dd);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
}

.btn-icon {
  font-size: 1.2rem;
}

/* 闹钟列表 */
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

.alarm-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alarm-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.alarm-item.active {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.alarm-info {
  flex: 1;
}

.alarm-time {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
}

.alarm-label {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.25rem;
}

.alarm-repeat {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.alarm-controls {
  display: flex;
  gap: 0.5rem;
}

.toggle-btn, .delete-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.2);
}

.toggle-btn.enabled {
  background: linear-gradient(135deg, #4ecdc4, #6ee7dd);
}

.toggle-btn:hover {
  transform: scale(1.1);
}

.delete-btn {
  background: rgba(255, 107, 107, 0.2);
}

.delete-btn:hover {
  background: rgba(255, 107, 107, 0.4);
  transform: scale(1.1);
}

.toggle-icon, .delete-icon {
  font-size: 1.2rem;
}

/* 闹钟响铃弹窗 */
.alarm-modal {
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2rem;
  padding: 2rem;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.ringing-animation {
  margin-bottom: 1rem;
}

.alarm-bell {
  font-size: 4rem;
  animation: ring 0.5s ease-in-out infinite alternate;
}

@keyframes ring {
  0% { transform: rotate(-15deg) scale(1); }
  100% { transform: rotate(15deg) scale(1.1); }
}

.ringing-time {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.ringing-label {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.snooze-btn, .stop-btn {
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

.stop-btn {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
}

.stop-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}
</style>