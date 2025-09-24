<template>
  <div class="p-6 space-y-6">
    <!-- 页面标题 -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">音乐播放器</h1>
      <p class="text-muted-foreground">享受美妙的音乐时光</p>
    </div>

    <!-- 播放器主体 -->
    <div class="max-w-2xl mx-auto">
      <!-- 当前播放歌曲信息 -->
      <div class="bg-card rounded-lg p-6 shadow-lg mb-6">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
            <Music v-if="!currentSong?.cover" class="w-8 h-8 text-primary-foreground" />
            <img v-else :src="currentSong.cover" alt="封面" class="w-full h-full object-cover rounded-lg">
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-foreground">{{ currentSong?.title || '未选择歌曲' }}</h3>
            <p class="text-muted-foreground">{{ currentSong?.artist || '请选择歌曲' }}</p>
          </div>
        </div>
      </div>

      <!-- 播放控制 -->
      <div class="bg-card rounded-lg p-6 shadow-lg mb-6">
        <!-- 进度条 -->
        <div class="mb-4">
          <div class="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
            <span>{{ formatTime(currentTime) }}</span>
            <div class="flex-1">
              <input
                type="range"
                min="0"
                :max="duration"
                v-model="currentTime"
                @input="seek"
                class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
              >
            </div>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>

        <!-- 控制按钮 -->
        <div class="flex items-center justify-center space-x-4">
          <button
            @click="previousSong"
            class="p-2 rounded-full hover:bg-secondary transition-colors"
            :disabled="!hasPreviousSong"
          >
            <SkipBack class="w-5 h-5" />
          </button>

          <button
            @click="togglePlay"
            class="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            <Play v-if="!isPlaying" class="w-6 h-6" />
            <Pause v-else class="w-6 h-6" />
          </button>

          <button
            @click="nextSong"
            class="p-2 rounded-full hover:bg-secondary transition-colors"
            :disabled="!hasNextSong"
          >
            <SkipForward class="w-5 h-5" />
          </button>
        </div>

        <!-- 音量控制 -->
        <div class="flex items-center space-x-2 mt-4">
          <Volume2 class="w-4 h-4 text-muted-foreground" />
          <input
            type="range"
            min="0"
            max="100"
            v-model="volume"
            @input="setVolume"
            class="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
          >
          <span class="text-sm text-muted-foreground w-8">{{ volume }}%</span>
        </div>
      </div>

      <!-- 播放列表 -->
      <div class="bg-card rounded-lg shadow-lg">
        <div class="p-4 border-b border-border">
          <h3 class="text-lg font-semibold text-foreground">播放列表</h3>
        </div>
        <div class="max-h-64 overflow-y-auto">
          <div
            v-for="(song, index) in playlist"
            :key="song.id"
            @click="playSong(index)"
            class="flex items-center space-x-3 p-3 hover:bg-secondary/50 cursor-pointer transition-colors"
            :class="{ 'bg-secondary/30': currentIndex === index }"
          >
            <div class="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded flex items-center justify-center flex-shrink-0">
              <Music class="w-5 h-5 text-primary-foreground" v-if="currentIndex !== index || !isPlaying" />
              <Volume2 class="w-5 h-5 text-primary-foreground animate-pulse" v-else />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-foreground truncate">{{ song.title }}</p>
              <p class="text-xs text-muted-foreground truncate">{{ song.artist }}</p>
            </div>
            <div class="text-xs text-muted-foreground">
              {{ formatTime(song.duration) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 音频元素 -->
    <audio
      ref="audioElement"
      @timeupdate="updateTime"
      @loadedmetadata="onLoadedMetadata"
      @ended="onSongEnded"
      @error="onAudioError"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Music, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-vue-next'

// 音频元素引用
const audioElement = ref<HTMLAudioElement>()

// 播放状态
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(70)
const currentIndex = ref(-1)

// 歌曲接口
interface Song {
  id: number
  title: string
  artist: string
  url: string
  duration: number
  cover?: string
}

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

// 当前播放歌曲
const currentSong = computed(() => {
  return currentIndex.value >= 0 ? playlist.value[currentIndex.value] : null
})

// 是否有上一首/下一首
const hasPreviousSong = computed(() => currentIndex.value > 0)
const hasNextSong = computed(() => currentIndex.value < playlist.value.length - 1)

// 格式化时间
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 播放指定歌曲
const playSong = (index: number) => {
  if (index < 0 || index >= playlist.value.length) return

  currentIndex.value = index
  const song = playlist.value[index]

  if (audioElement.value) {
    audioElement.value.src = song.url
    audioElement.value.load()

    // 设置音量
    audioElement.value.volume = volume.value / 100

    // 开始播放
    audioElement.value.play().then(() => {
      isPlaying.value = true
    }).catch(error => {
      console.error('播放失败:', error)
      alert('音频加载失败，请检查网络连接')
    })
  }
}

// 切换播放/暂停
const togglePlay = () => {
  if (!audioElement.value || !currentSong.value) {
    // 如果没有歌曲，播放第一首
    if (playlist.value.length > 0) {
      playSong(0)
    }
    return
  }

  if (isPlaying.value) {
    audioElement.value.pause()
    isPlaying.value = false
  } else {
    audioElement.value.play().then(() => {
      isPlaying.value = true
    }).catch(error => {
      console.error('播放失败:', error)
      alert('音频播放失败')
    })
  }
}

// 上一首
const previousSong = () => {
  if (hasPreviousSong.value) {
    playSong(currentIndex.value - 1)
  }
}

// 下一首
const nextSong = () => {
  if (hasNextSong.value) {
    playSong(currentIndex.value + 1)
  } else {
    // 如果是最后一首，回到第一首
    playSong(0)
  }
}

// 跳转播放
const seek = () => {
  if (audioElement.value) {
    audioElement.value.currentTime = currentTime.value
  }
}

// 设置音量
const setVolume = () => {
  if (audioElement.value) {
    audioElement.value.volume = volume.value / 100
  }
}

// 更新时间
const updateTime = () => {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime
  }
}

// 加载元数据
const onLoadedMetadata = () => {
  if (audioElement.value) {
    duration.value = audioElement.value.duration
  }
}

// 歌曲结束
const onSongEnded = () => {
  nextSong()
}

// 音频错误
const onAudioError = () => {
  console.error('音频加载错误')
  alert('音频加载失败，请检查网络连接')
  isPlaying.value = false
}

// 键盘快捷键
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    return // 如果在输入框中，不处理快捷键
  }

  switch (event.code) {
    case 'Space':
      event.preventDefault()
      togglePlay()
      break
    case 'ArrowLeft':
      event.preventDefault()
      previousSong()
      break
    case 'ArrowRight':
      event.preventDefault()
      nextSong()
      break
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)

  // 设置初始音量
  if (audioElement.value) {
    audioElement.value.volume = volume.value / 100
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress)

  // 清理音频资源
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.src = ''
  }
})
</script>

<style scoped>
/* 自定义滑块样式 */
.slider {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.slider::-webkit-slider-track {
  background: hsl(var(--secondary));
  height: 4px;
  border-radius: 2px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: hsl(var(--primary));
  height: 16px;
  width: 16px;
  border-radius: 50%;
  margin-top: -6px;
  transition: all 0.2s;
}

.slider::-webkit-slider-thumb:hover {
  background: hsl(var(--primary));
  transform: scale(1.1);
}

.slider::-moz-range-track {
  background: hsl(var(--secondary));
  height: 4px;
  border-radius: 2px;
  border: none;
}

.slider::-moz-range-thumb {
  background: hsl(var(--primary));
  height: 16px;
  width: 16px;
  border-radius: 50%;
  border: none;
  transition: all 0.2s;
}

.slider::-moz-range-thumb:hover {
  background: hsl(var(--primary));
  transform: scale(1.1);
}

/* 滚动条样式 */
.max-h-64::-webkit-scrollbar {
  width: 6px;
}

.max-h-64::-webkit-scrollbar-track {
  background: hsl(var(--secondary));
  border-radius: 3px;
}

.max-h-64::-webkit-scrollbar-thumb {
  background: hsl(var(--primary));
  border-radius: 3px;
}

.max-h-64::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--primary) / 0.8);
}
</style>