<template>
  <div :class="sidebarRef?.currentTheme || currentTheme" class="min-h-screen transition-all duration-300">
    <!-- 漩涡背景 -->
    <VortexBackground />
    
    <!-- Splash Cursor 效果 -->
    <SplashCursor />
    
    <!-- 侧边栏布局 -->
    <Sidebar ref="sidebarRef">
      <router-view />
    </Sidebar>
    
    <!-- AI助手组件 -->
    <AIAssistant />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VortexBackground from './components/VortexBackground.vue'
import Sidebar from './components/Sidebar.vue'
import SplashCursor from './components/SplashCursor.vue'
import AIAssistant from './components/AIAssistant.vue'

const sidebarRef = ref()
const currentTheme = ref('')

// 从localStorage加载主题偏好（作为后备）
onMounted(() => {
  const savedTheme = localStorage.getItem('aura-theme')
  if (savedTheme) {
    currentTheme.value = savedTheme
  }
})
</script>

<style scoped>
.aura-title {
  font-family: 'Brush Script MT', 'Lucida Handwriting', 'Apple Chancery', cursive;
  background: linear-gradient(135deg, 
    #e0f2fe 0%, 
    #b3e5fc 15%, 
    #81d4fa 30%, 
    #4fc3f7 45%, 
    #29b6f6 60%, 
    #03a9f4 75%, 
    #039be5 90%, 
    #0288d1 100%);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ethereal-flow 6s ease-in-out infinite, fairy-float 4s ease-in-out infinite;
  text-shadow: 
    0 0 10px rgba(135, 206, 250, 0.6),
    0 0 20px rgba(173, 216, 230, 0.4),
    0 0 30px rgba(240, 248, 255, 0.3),
    0 0 40px rgba(176, 224, 230, 0.2);
  letter-spacing: 0.08em;
  transform-origin: center;
  filter: drop-shadow(0 0 15px rgba(135, 206, 250, 0.3));
  position: relative;
}

.aura-title::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(circle, 
    rgba(240, 248, 255, 0.1) 0%, 
    rgba(173, 216, 230, 0.05) 50%, 
    transparent 70%);
  border-radius: 50%;
  animation: aura-glow 5s ease-in-out infinite;
  z-index: -1;
}

@keyframes ethereal-flow {
  0%, 100% {
    background-position: 0% 50%;
    filter: drop-shadow(0 0 15px rgba(135, 206, 250, 0.3)) hue-rotate(0deg);
  }
  25% {
    background-position: 100% 0%;
    filter: drop-shadow(0 0 20px rgba(173, 216, 230, 0.4)) hue-rotate(30deg);
  }
  50% {
    background-position: 100% 100%;
    filter: drop-shadow(0 0 25px rgba(240, 248, 255, 0.5)) hue-rotate(60deg);
  }
  75% {
    background-position: 0% 100%;
    filter: drop-shadow(0 0 20px rgba(176, 224, 230, 0.4)) hue-rotate(30deg);
  }
}

@keyframes fairy-float {
  0%, 100% {
    transform: translateY(0px) translateX(0px) scale(1) rotate(0deg);
  }
  25% {
    transform: translateY(-2px) translateX(1px) scale(1.01) rotate(0.5deg);
  }
  50% {
    transform: translateY(-4px) translateX(0px) scale(1.02) rotate(0deg);
  }
  75% {
    transform: translateY(-2px) translateX(-1px) scale(1.01) rotate(-0.5deg);
  }
}

@keyframes aura-glow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

.aura-title:hover {
  animation: ethereal-flow 3s ease-in-out infinite, fairy-float 2s ease-in-out infinite;
  text-shadow: 
    0 0 15px rgba(135, 206, 250, 0.8),
    0 0 25px rgba(173, 216, 230, 0.6),
    0 0 35px rgba(240, 248, 255, 0.5),
    0 0 45px rgba(176, 224, 230, 0.4);
  filter: drop-shadow(0 0 25px rgba(135, 206, 250, 0.5));
}
</style>