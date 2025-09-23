<template>
  <div class="splash-cursor-container">
    <div 
      v-for="particle in particles" 
      :key="particle.id"
      class="particle"
      :style="{
        left: particle.x + 'px',
        top: particle.y + 'px',
        opacity: particle.opacity,
        transform: `scale(${particle.scale})`
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  opacity: number
  scale: number
  life: number
}

const particles = ref<Particle[]>([])
let particleId = 0
let animationId: number

function createParticle(x: number, y: number) {
  const particle: Particle = {
    id: particleId++,
    x: x - 5,
    y: y - 5,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    opacity: 1,
    scale: Math.random() * 0.5 + 0.5,
    life: 60
  }
  
  particles.value.push(particle)
  
  if (particles.value.length > 50) {
    particles.value.shift()
  }
}

function updateParticles() {
  particles.value = particles.value.filter(particle => {
    particle.x += particle.vx
    particle.y += particle.vy
    particle.vx *= 0.98
    particle.vy *= 0.98
    particle.life--
    particle.opacity = particle.life / 60
    particle.scale *= 0.99
    
    return particle.life > 0
  })
}

function animate() {
  updateParticles()
  animationId = requestAnimationFrame(animate)
}

function onMouseMove(event: MouseEvent) {
  if (Math.random() > 0.7) {
    createParticle(event.clientX, event.clientY)
  }
}

function onMouseClick(event: MouseEvent) {
  for (let i = 0; i < 5; i++) {
    createParticle(event.clientX, event.clientY)
  }
}

onMounted(() => {
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('click', onMouseClick)
  animate()
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('click', onMouseClick)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.splash-cursor-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
}

.particle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: radial-gradient(circle, rgba(100, 200, 255, 0.8) 0%, rgba(100, 200, 255, 0) 70%);
  border-radius: 50%;
  pointer-events: none;
  will-change: transform, opacity;
}
</style>