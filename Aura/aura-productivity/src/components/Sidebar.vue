<template>
  <div class="sidebar-container">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ 'collapsed': isCollapsed }">
      <!-- Logo 区域 -->
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" class="w-8 h-8">
              <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 v-if="!isCollapsed" class="logo-text">招招小记</h1>
        </div>
        <button 
          @click="toggleSidebar" 
          class="collapse-btn"
          :class="{ 'rotated': isCollapsed }"
        >
          <svg viewBox="0 0 24 24" class="w-4 h-4">
            <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
      </div>

      <!-- 导航菜单 -->
      <nav class="sidebar-nav">
        <div class="nav-section">
          <h3 v-if="!isCollapsed" class="nav-section-title">主要功能</h3>
          <ul class="nav-list">
            <li v-for="route in mainRoutes" :key="route.path" class="nav-item">
              <router-link
                :to="route.path"
                class="nav-link"
                :class="{ 'active': $route.path === route.path }"
                :title="isCollapsed ? route.meta.title : ''"
              >
                <component :is="getIcon(route.meta.icon)" class="nav-icon" />
                <span v-if="!isCollapsed" class="nav-text">{{ route.meta.title }}</span>
                <div v-if="$route.path === route.path" class="active-indicator"></div>
              </router-link>
            </li>
          </ul>
        </div>

        <div class="nav-section">
          <h3 v-if="!isCollapsed" class="nav-section-title">工具</h3>
          <ul class="nav-list">
            <li v-for="route in toolRoutes" :key="route.path" class="nav-item">
              <router-link
                :to="route.path"
                class="nav-link"
                :class="{ 'active': $route.path === route.path }"
                :title="isCollapsed ? route.meta.title : ''"
              >
                <component :is="getIcon(route.meta.icon)" class="nav-icon" />
                <span v-if="!isCollapsed" class="nav-text">{{ route.meta.title }}</span>
                <div v-if="$route.path === route.path" class="active-indicator"></div>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>

      <!-- 底部区域 -->
      <div class="sidebar-footer">
        <!-- 底部区域现在为空 -->
      </div>
    </aside>

    <!-- 主内容区域 -->
    <main class="main-content" :class="{ 'expanded': isCollapsed }">
      <!-- 右上角主题切换器 -->
      <div class="top-bar">
        <div class="theme-switcher-top">
          <div class="theme-label-top">主题</div>
          <select 
            v-model="currentTheme" 
            class="theme-select-top"
            title="切换主题"
          >
            <option value="">极简苹果</option>
            <option value="theme-dopamine">多巴胺</option>
            <option value="theme-candy">糖果渐变</option>
          </select>
        </div>
      </div>
      <div class="content-wrapper">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Notebook, 
  CheckSquare, 
  MessageCircle, 
  Timer,
  Briefcase,
  Calendar,
  Clock,
  Droplets,
  type LucideIcon
} from 'lucide-vue-next'

const router = useRouter()
const routes = router.getRoutes().filter(route => route.meta?.title)

// 分组路由
const mainRoutes = computed(() => 
  routes.filter(route => ['Notes', 'Todo', 'Projects'].includes(route.name as string))
)

const toolRoutes = computed(() => 
  routes.filter(route => ['Chat', 'Pomodoro', 'Calendar', 'Alarm', 'WaterReminder'].includes(route.name as string))
)

const isCollapsed = ref(false)
const currentTheme = ref('')

// 从localStorage加载设置
onMounted(() => {
  const savedTheme = localStorage.getItem('aura-theme')
  if (savedTheme) {
    currentTheme.value = savedTheme
  }
  
  const savedCollapsed = localStorage.getItem('sidebar-collapsed')
  if (savedCollapsed) {
    isCollapsed.value = JSON.parse(savedCollapsed)
  }
})

// 保存设置到localStorage
watch(currentTheme, (newTheme) => {
  localStorage.setItem('aura-theme', newTheme)
})

watch(isCollapsed, (newValue) => {
  localStorage.setItem('sidebar-collapsed', JSON.stringify(newValue))
})

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

// 获取图标组件
const iconMap: Record<string, LucideIcon> = {
  Notebook,
  CheckSquare,
  MessageCircle,
  Timer,
  Briefcase,
  Calendar,
  Clock,
  Droplets
}

const getIcon = (iconName: string) => {
  return iconMap[iconName] || Notebook
}

// 暴露主题给父组件
defineExpose({
  currentTheme
})
</script>

<style scoped>
.sidebar-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 280px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(139, 92, 246, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1);
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
}

.collapse-btn {
  width: 2rem;
  height: 2rem;
  border: none;
  background: rgba(107, 114, 128, 0.1);
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
}

.collapse-btn:hover {
  background: rgba(107, 114, 128, 0.2);
  color: #374151;
}

.collapse-btn.rotated {
  transform: rotate(180deg);
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 2rem;
}

.nav-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 1rem 0.75rem 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin: 0 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.nav-link:hover {
  background: rgba(99, 102, 241, 0.1);
  color: #4f46e5;
}

.nav-link.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  color: #4f46e5;
  font-weight: 600;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.nav-text {
  white-space: nowrap;
}

.active-indicator {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 2px 0 0 2px;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(229, 231, 235, 0.5);
}

/* 右上角主题切换器 */
.top-bar {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 20;
}

.theme-switcher-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.theme-label-top {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
}

.theme-select-top {
  padding: 0.375rem 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.375rem;
  background: rgba(255, 255, 255, 0.9);
  font-size: 0.75rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
}

.theme-select-top:hover {
  border-color: #4f46e5;
  background: rgba(255, 255, 255, 1);
}

.theme-select-top:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.main-content {
  flex: 1;
  background: rgba(248, 250, 252, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
}

.content-wrapper {
  padding: 2rem;
  padding-top: 4rem; /* 为右上角主题切换器留出空间 */
  max-width: 1200px;
  margin: 0 auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 50;
    transform: translateX(-100%);
  }
  
  .sidebar:not(.collapsed) {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0;
  }
}

/* 深色主题支持 */
:global(.theme-dopamine) .sidebar {
  background: rgba(17, 24, 39, 0.95);
  border-right-color: rgba(75, 85, 99, 0.3);
}

:global(.theme-dopamine) .nav-link {
  color: #d1d5db;
}

:global(.theme-dopamine) .nav-link:hover {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
}

:global(.theme-dopamine) .nav-link.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  color: #a5b4fc;
}

:global(.theme-dopamine) .main-content {
  background: #111827;
}
</style>