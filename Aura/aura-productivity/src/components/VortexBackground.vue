<template>
  <div class="vortex-container">
    <canvas ref="canvasRef" class="vortex-canvas"></canvas>
    <div class="vortex-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement>()
let animationId: number
let particles: Particle[] = []

class Particle {
  x: number
  y: number
  angle: number
  radius: number
  speed: number
  opacity: number
  size: number
  color: string
  
  constructor(centerX: number, centerY: number) {
    this.angle = Math.random() * Math.PI * 2
    this.radius = Math.random() * 300 + 50
    this.speed = Math.random() * 0.02 + 0.005
    this.opacity = Math.random() * 0.5 + 0.1
    this.size = Math.random() * 2 + 0.5
    
    // 渐变色彩
    const colors = [
      'rgba(99, 102, 241, ',
      'rgba(139, 92, 246, ',
      'rgba(167, 139, 250, ',
      'rgba(196, 181, 253, ',
      'rgba(221, 214, 254, '
    ]
    this.color = colors[Math.floor(Math.random() * colors.length)]
    
    this.x = centerX + Math.cos(this.angle) * this.radius
    this.y = centerY + Math.sin(this.angle) * this.radius
  }
  
  update(centerX: number, centerY: number) {
    this.angle += this.speed
    this.x = centerX + Math.cos(this.angle) * this.radius
    this.y = centerY + Math.sin(this.angle) * this.radius
    
    // 添加一些随机波动
    this.x += Math.sin(this.angle * 3) * 10
    this.y += Math.cos(this.angle * 2) * 8
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.fillStyle = this.color + this.opacity + ')'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    
    // 添加发光效果
    ctx.shadowBlur = 20
    ctx.shadowColor = this.color + '0.8)'
    ctx.fill()
    ctx.restore()
  }
}

const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  // 创建粒子
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  
  for (let i = 0; i < 150; i++) {
    particles.push(new Particle(centerX, centerY))
  }
  
  const animate = () => {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    
    // 绘制中心漩涡
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200)
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)')
    gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.2)')
    gradient.addColorStop(1, 'rgba(167, 139, 250, 0.1)')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(centerX, centerY, 200, 0, Math.PI * 2)
    ctx.fill()
    
    // 更新和绘制粒子
    particles.forEach(particle => {
      particle.update(centerX, centerY)
      particle.draw(ctx)
    })
    
    // 绘制连接线
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)'
    ctx.lineWidth = 0.5
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          ctx.globalAlpha = (100 - distance) / 100 * 0.3
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }
    
    ctx.globalAlpha = 1
    animationId = requestAnimationFrame(animate)
  }
  
  animate()
}

onMounted(() => {
  setTimeout(initCanvas, 100)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.vortex-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
}

.vortex-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    #0f172a 0%, 
    #1e293b 25%, 
    #334155 50%, 
    #475569 75%, 
    #64748b 100%);
}

.vortex-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, 
    transparent 0%, 
    rgba(15, 23, 42, 0.1) 50%, 
    rgba(15, 23, 42, 0.3) 100%);
  pointer-events: none;
}

/* 主题适配 */
:global(.theme-dopamine) .vortex-canvas {
  background: linear-gradient(135deg, 
    #111827 0%, 
    #1f2937 25%, 
    #374151 50%, 
    #4b5563 75%, 
    #6b7280 100%);
}

:global(.theme-candy) .vortex-canvas {
  background: linear-gradient(135deg, 
    #fdf2f8 0%, 
    #fce7f3 25%, 
    #fbcfe8 50%, 
    #f9a8d4 75%, 
    #f472b6 100%);
}

:global(.theme-candy) .vortex-overlay {
  background: radial-gradient(circle at center, 
    transparent 0%, 
    rgba(253, 242, 248, 0.1) 50%, 
    rgba(253, 242, 248, 0.3) 100%);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .vortex-canvas {
    transform: scale(1.2);
    transform-origin: center;
  }
}

/* 性能优化 */
@media (prefers-reduced-motion: reduce) {
  .vortex-canvas {
    animation: none;
  }
}

/* 深色模式优化 */
@media (prefers-color-scheme: dark) {
  .vortex-canvas {
    background: linear-gradient(135deg, 
      #0c0a09 0%, 
      #1c1917 25%, 
      #292524 50%, 
      #44403c 75%, 
      #57534e 100%);
  }
}
</style>