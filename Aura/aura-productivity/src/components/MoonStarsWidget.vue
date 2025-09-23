<template>
  <div class="moon-stars-widget">
    <!-- 月亮 -->
    <div class="moon">
      <svg width="40" height="40" viewBox="0 0 40 40" class="moon-svg">
        <path
          d="M20 5C28.284 5 35 11.716 35 20C35 28.284 28.284 35 20 35C15.858 35 12.111 33.142 9.5 30.5C13.5 32.5 18.5 32 22.5 28C26.5 24 27 19 25 15C23 11 20 5 20 5Z"
          fill="currentColor"
          class="text-yellow-300"
        />
      </svg>
    </div>
    
    <!-- 星星们 -->
    <div class="star star-1">
      <svg width="16" height="16" viewBox="0 0 16 16" class="star-svg">
        <path
          d="M8 0L9.798 5.202L16 8L9.798 10.798L8 16L6.202 10.798L0 8L6.202 5.202L8 0Z"
          fill="currentColor"
          class="text-yellow-200"
        />
      </svg>
    </div>
    
    <div class="star star-2">
      <svg width="12" height="12" viewBox="0 0 16 16" class="star-svg">
        <path
          d="M8 0L9.798 5.202L16 8L9.798 10.798L8 16L6.202 10.798L0 8L6.202 5.202L8 0Z"
          fill="currentColor"
          class="text-yellow-100"
        />
      </svg>
    </div>
    
    <div class="star star-3">
      <svg width="14" height="14" viewBox="0 0 16 16" class="star-svg">
        <path
          d="M8 0L9.798 5.202L16 8L9.798 10.798L8 16L6.202 10.798L0 8L6.202 5.202L8 0Z"
          fill="currentColor"
          class="text-yellow-200"
        />
      </svg>
    </div>
    
    <div class="star star-4">
      <svg width="10" height="10" viewBox="0 0 16 16" class="star-svg">
        <path
          d="M8 0L9.798 5.202L16 8L9.798 10.798L8 16L6.202 10.798L0 8L6.202 5.202L8 0Z"
          fill="currentColor"
          class="text-yellow-300"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
// 月亮星星挂件组件
</script>

<style scoped>
.moon-stars-widget {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  pointer-events: none;
  width: 120px;
  height: 120px;
}

.moon {
  position: absolute;
  top: 20px;
  left: 30px;
  animation: moonFloat 4s ease-in-out infinite;
}

.moon-svg {
  filter: drop-shadow(0 0 8px rgba(255, 255, 0, 0.3));
}

.star {
  position: absolute;
  animation: starTwinkle 2s ease-in-out infinite;
}

.star-1 {
  top: 10px;
  left: 80px;
  animation-delay: 0s;
}

.star-2 {
  top: 40px;
  left: 90px;
  animation-delay: 0.5s;
}

.star-3 {
  top: 70px;
  left: 20px;
  animation-delay: 1s;
}

.star-4 {
  top: 90px;
  left: 70px;
  animation-delay: 1.5s;
}

.star-svg {
  filter: drop-shadow(0 0 4px rgba(255, 255, 0, 0.4));
}

/* 月亮浮动动画 */
@keyframes moonFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-8px) rotate(2deg);
  }
  50% {
    transform: translateY(-4px) rotate(0deg);
  }
  75% {
    transform: translateY(-12px) rotate(-2deg);
  }
}

/* 星星闪烁动画 */
@keyframes starTwinkle {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1) rotate(0deg);
  }
  25% {
    opacity: 1;
    transform: scale(1.2) rotate(90deg);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.9) rotate(180deg);
  }
  75% {
    opacity: 1;
    transform: scale(1.1) rotate(270deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .moon-stars-widget {
    top: 10px;
    right: 10px;
    width: 80px;
    height: 80px;
    transform: scale(0.7);
  }
}
</style>