/* =============================================================================
   AI Coder Hub - Custom JavaScript
   赛博朋克粒子背景 + 极客交互增强
   ============================================================================= */

// ---------------------------------------------------------------------------
// 赛博朋克风格粒子背景
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  // 只在深色模式下启动粒子效果
  if (document.documentElement.getAttribute('data-theme') !== 'dark') return;

  const canvas = document.createElement('canvas');
  canvas.id = 'cyber-canvas';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  const particles = [];
  const particleCount = Math.min(60, Math.floor(width * height / 25000));
  const connectionDistance = 150;
  let mouseX = 0;
  let mouseY = 0;
  let animationId;

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 1.5 + 0.5;
      // AI 品牌色系
      const colors = [
        'rgba(97, 175, 239, ',   // 蓝
        'rgba(198, 120, 221, ',  // 紫
        'rgba(86, 182, 194, ',   // 青
        'rgba(152, 195, 121, ',  // 绿
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // 鼠标交互 - 轻微吸引
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        this.vx += dx * 0.00005;
        this.vy += dy * 0.00005;
      }

      // 速度限制
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 1) {
        this.vx = (this.vx / speed) * 1;
        this.vy = (this.vy / speed) * 1;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + '0.6)';
      ctx.fill();
    }
  }

  function init() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(97, 175, 239, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    animationId = requestAnimationFrame(animate);
  }

  // 鼠标跟踪
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // 窗口大小变化
  window.addEventListener('resize', function () {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // 页面不可见时暂停动画
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });

  init();
  animate();
});

// ---------------------------------------------------------------------------
// 控制台欢迎信息（极客范）
// ---------------------------------------------------------------------------
console.log(
  '%c AI Coder Hub %c https://github.com/alaiazheng ',
  'background: linear-gradient(135deg, #61afef, #c678dd); color: white; padding: 8px 16px; border-radius: 4px 0 0 4px; font-weight: bold; font-size: 14px;',
  'background: #282c34; color: #98c379; padding: 8px 16px; border-radius: 0 4px 4px 0; font-size: 14px;'
);

console.log(
  '%c 🤖 Powered by AI, for AI enthusiasts ',
  'color: #61afef; font-size: 12px; font-style: italic;'
);
