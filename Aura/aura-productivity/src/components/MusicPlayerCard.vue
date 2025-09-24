<template>
  <div class="music-player-card">
    <div class="card-header">
      <div class="card-icon">
        <Music class="w-6 h-6 text-primary" />
      </div>
      <div class="card-title-section">
        <h3 class="card-title">音乐播放器</h3>
        <p class="card-subtitle">享受美妙的音乐时光</p>
      </div>
      <router-link to="/music" class="card-action-btn">
        <Play class="w-4 h-4" />
        <span>打开</span>
      </router-link>
    </div>

    <div class="card-content">
      <!-- 当前播放信息 -->
      <div v-if="currentSong" class="now-playing">
        <div class="song-info">
          <div class="song-icon">
            <Music class="w-5 h-5 text-primary" />
          </div>
          <div class="song-details">
            <p class="song-title">{{ currentSong.title }}</p>
            <p class="song-artist">{{ currentSong.artist }}</p>
          </div>
        </div>
        <div class="play-status" :class="{ 'playing': isPlaying }">
          <Volume2 class="w-4 h-4" />
          <span class="status-text">{{ isPlaying ? '正在播放' : '已暂停' }}</span>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <Music class="w-8 h-8 text-muted-foreground" />
        </div>
        <p class="empty-text">暂无播放</p>
        <p class="empty-subtext">点击打开音乐播放器</p>
      </div>

      <!-- 快速控制 -->
      <div class="quick-controls">
        <button
          @click="togglePlay"
          class="control-btn primary"
          :disabled="!hasCurrentSong"
        >
          <Play v-if="!isPlaying" class="w-5 h-5" />
          <Pause v-else class="w-5 h-5" />
        </button>
        <button
          @click="previousSong"
          class="control-btn secondary"
          :disabled="!hasCurrentSong"
        >
          <SkipBack class="w-4 h-4" />
        </button>
        <button
          @click="nextSong"
          class="control-btn secondary"
          :disabled="!hasCurrentSong"
        >
          <SkipForward class="w-4 h-4" />
        </button>
      </div>

      <!-- 播放列表预览 -->
      <div v-if="playlist.length > 0" class="playlist-preview">
        <div class="playlist-header">
          <h4 class="playlist-title">播放列表</h4>
          <span class="playlist-count">{{ playlist.length }} 首歌曲</span>
        </div>
        <div class="playlist-items">
          <div
            v-for="(song, index) in playlist.slice(0, 3)"
            :key="song.id"
            class="playlist-item"
            :class="{ 'active': currentIndex === index }"
            @click="playSong(index)"
          >
            <div class="item-icon">
              <Music class="w-3 h-3" />
            </div>
            <div class="item-info">
              <p class="item-title">{{ song.title }}</p>
              <p class="item-artist">{{ song.artist }}</p>
            </div>
            <div v-if="currentIndex === index" class="item-status">
              <Volume2 class="w-3 h-3 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="card-footer">
      <div class="decorative-line"></div>
      <p class="footer-text">点击卡片打开完整播放器</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Music, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-vue-next'

// 歌曲接口
interface Song {
  id: number
  title: string
  artist: string
  url: string
  duration: number
  cover?: string
}

// 状态管理
const isPlaying = ref(false)
const currentIndex = ref(-1)

// 示例播放列表
const playlist = ref<Song[]>([
  {
    id: 1,
    title: '轻音乐 - 专注工作',
    artist: 'Aura音乐',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 180,
    cover: ''
  },
  {
    id: 2,
    title: '冥想音乐 - 放松心情',
    artist: 'Aura音乐',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 240,
    cover: ''
  },
  {
    id: 3,
    title: '自然声音 - 森林鸟鸣',
    artist: 'Aura音乐',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 200,
    cover: ''
  }
])

// 计算属性
const currentSong = computed(() => {
  return currentIndex.value >= 0 ? playlist.value[currentIndex.value] : null
})

const hasCurrentSong = computed(() => currentSong.value !== null)

// 播放控制
const togglePlay = () => {
  if (!hasCurrentSong.value) {
    if (playlist.value.length > 0) {
      playSong(0)
    }
    return
  }
  isPlaying.value = !isPlaying.value
}

const previousSong = () => {
  if (currentIndex.value > 0) {
    playSong(currentIndex.value - 1)
  }
}

const nextSong = () => {
  if (currentIndex.value < playlist.value.length - 1) {
    playSong(currentIndex.value + 1)
  } else {
    playSong(0)
  }
}

const playSong = (index: number) => {
  if (index >= 0 && index < playlist.value.length) {
    currentIndex.value = index
    isPlaying.value = true
  }
}

// 生命周期
onMounted(() => {
  // 默认播放第一首
  if (playlist.value.length > 0) {
    currentIndex.value = 0
  }
})
</script>

<style scoped>
.music-player-card {
  background: linear-gradient(135deg,
    hsl(var(--card)) 0%,
    hsl(var(--card) / 0.8) 100%);
  border: 1px solid hsl(var(--border));
  border-radius: 1rem;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.music-player-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.1),
    0 0 0 1px hsl(var(--primary) / 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg,
    hsl(var(--primary)) 0%,
    hsl(var(--primary) / 0.8) 100%);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-title-section {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin: 0;
  line-height: 1.2;
}

.card-subtitle {
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
  margin: 0.25rem 0 0 0;
}

.card-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: 0.5rem;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.card-action-btn:hover {
  background: hsl(var(--primary) / 0.9);
  transform: translateY(-1px);
}

.card-content {
  space-y: 1.5rem;
}

.now-playing {
  background: hsl(var(--secondary) / 0.5);
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid hsl(var(--border));
}

.song-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.song-icon {
  width: 2rem;
  height: 2rem;
  background: hsl(var(--primary) / 0.1);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.song-details {
  flex: 1;
  min-width: 0;
}

.song-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(var(--foreground));
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  margin: 0.125rem 0 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.play-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
}

.play-status.playing {
  color: hsl(var(--primary));
}

.play-status.playing :deep(svg) {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.empty-state {
  text-align: center;
  padding: 2rem 0;
}

.empty-icon {
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1rem;
  font-weight: 500;
  color: hsl(var(--foreground));
  margin: 0 0 0.25rem 0;
}

.empty-subtext {
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
  margin: 0;
}

.quick-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.control-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.control-btn:hover:not(:disabled) {
  background: hsl(var(--secondary));
  transform: translateY(-1px);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn.primary {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-color: hsl(var(--primary));
}

.control-btn.primary:hover:not(:disabled) {
  background: hsl(var(--primary) / 0.9);
}

.playlist-preview {
  background: hsl(var(--secondary) / 0.3);
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid hsl(var(--border));
}

.playlist-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.playlist-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: hsl(var(--foreground));
  margin: 0;
}

.playlist-count {
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
}

.playlist-items {
  space-y: 0.5rem;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.playlist-item:hover {
  background: hsl(var(--secondary) / 0.5);
}

.playlist-item.active {
  background: hsl(var(--primary) / 0.1);
  border: 1px solid hsl(var(--primary) / 0.2);
}

.item-icon {
  width: 1.5rem;
  height: 1.5rem;
  background: hsl(var(--primary) / 0.1);
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 0.75rem;
  font-weight: 500;
  color: hsl(var(--foreground));
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-artist {
  font-size: 0.625rem;
  color: hsl(var(--muted-foreground));
  margin: 0.125rem 0 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-status {
  flex-shrink: 0;
}

.card-footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid hsl(var(--border));
  text-align: center;
}

.decorative-line {
  width: 2rem;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    hsl(var(--primary)) 50%,
    transparent 100%);
  margin: 0 auto 0.75rem auto;
}

.footer-text {
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  margin: 0;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .music-player-card {
    padding: 1rem;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .card-action-btn {
    align-self: flex-end;
  }

  .quick-controls {
    gap: 0.5rem;
  }

  .control-btn {
    width: 2.25rem;
    height: 2.25rem;
  }
}
</style>