export function initParticles() {
  const canvas = document.getElementById('ambient-canvas');
  const cursorGlow = document.getElementById('cursor-glow');
  if (!canvas) return;

  const isTouchDevice = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const isSmallScreen = () => window.innerWidth <= 480;

  if (isTouchDevice() || isSmallScreen()) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let particles = [];
  let rafId = null;
  const mouse = { x: null, y: null, gx: 0, gy: 0, r: 110 };

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
  };

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.vx = (Math.random() - .5) * .35;
      this.vy = (Math.random() - .5) * .35;
      this.r  = Math.random() * 1.5 + .5;
      const cs = ['rgba(201,169,110,.3)', 'rgba(123,167,194,.25)', 'rgba(201,169,110,.18)'];
      this.c = cs[Math.floor(Math.random() * cs.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      if (mouse.x !== null) {
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 90) {
          const f = (90 - d) / 90;
          const a = Math.atan2(dy, dx);
          this.x += Math.cos(a) * f * 1.2;
          this.y += Math.sin(a) * f * 1.2;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.c;
      ctx.fill();
    }
  }

  const init = () => {
    particles = [];
    const density = window.innerWidth < 900 ? 35000 : 22000;
    const n = Math.min(Math.floor(canvas.width * canvas.height / density), 65);
    for (let i = 0; i < n; i++) particles.push(new Particle());
  };

  const drawEdges = () => {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (mouse.x !== null) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d < mouse.r) {
          ctx.strokeStyle = `rgba(201,169,110,${(1 - d / mouse.r) * .12})`;
          ctx.lineWidth = .8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 110) {
          ctx.strokeStyle = `rgba(201,169,110,${(1 - d / 110) * .06})`;
          ctx.lineWidth = .6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawEdges();

    if (cursorGlow && mouse.x !== null) {
      mouse.gx += (mouse.x - mouse.gx) * .09;
      mouse.gy += (mouse.y - mouse.gy) * .09;
      cursorGlow.style.transform = `translate3d(${mouse.gx - 130}px,${mouse.gy - 130}px,0)`;
      cursorGlow.style.opacity = '1';
    } else if (cursorGlow) {
      cursorGlow.style.opacity = '0';
    }

    rafId = requestAnimationFrame(animate);
  };

  window.addEventListener('resize', resize, { passive: true });
  resize();
  animate();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else animate();
  });
}
