let canvas = null;
let ctx = null;
let activeEffects = [];
let animationFrameId = null;

function getThemeColor() {
  return window.getComputedStyle(document.documentElement).getPropertyValue('--ac').trim() || '#c9a96e';
}

function initCanvas() {
  canvas = document.createElement('canvas');
  canvas.id = 'interaction-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-3'; // Render behind page elements in the distant background
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize, { passive: true });
  resize();
}

const createSquares = (x, y) => {
  const list = [];
  const count = 5 + Math.floor(Math.random() * 4); // 5 to 8 particles
  
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.8 + Math.random() * 1.8; // gentle speed
    list.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.5, // gentle upward drift
      size: 2 + Math.floor(Math.random() * 3), // 2px to 4px (very small and subtle)
      rotation: Math.random() * Math.PI * 2,
      vRotation: (Math.random() - 0.5) * 0.15, // slower rotation
      life: 0.8, // starts slightly transparent
      decay: 0.02 + Math.random() * 0.015,
      isHollow: Math.random() > 0.6,
    });
  }
  return list;
};

function updateAndDraw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const accentColor = getThemeColor();
  
  for (let i = activeEffects.length - 1; i >= 0; i--) {
    const effect = activeEffects[i];
    effect.age += 16.67;
    const progress = effect.age / effect.duration;
    
    if (progress >= 1.0) {
      activeEffects.splice(i, 1);
      continue;
    }
    
    effect.squares.forEach(sq => {
      sq.x += sq.vx;
      sq.y += sq.vy;
      sq.vy += 0.05; // tiny gravity
      sq.vx *= 0.95; // gentle damping
      sq.rotation += sq.vRotation;
      sq.life -= sq.decay;
      
      if (sq.life > 0) {
        ctx.save();
        ctx.translate(sq.x, sq.y);
        ctx.rotate(sq.rotation);
        ctx.globalAlpha = sq.life * 0.7; // cap max opacity for subtlety
        ctx.strokeStyle = accentColor;
        ctx.fillStyle = accentColor;
        ctx.lineWidth = 1;
        
        if (sq.isHollow) {
          ctx.strokeRect(-sq.size / 2, -sq.size / 2, sq.size, sq.size);
        } else {
          ctx.fillRect(-sq.size / 2, -sq.size / 2, sq.size, sq.size);
        }
        ctx.restore();
      }
    });
  }
  
  if (activeEffects.length > 0) {
    animationFrameId = requestAnimationFrame(updateAndDraw);
  } else {
    animationFrameId = null;
  }
}

export function initCracks() {
  window.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Left click only
    
    const target = e.target;
    if (!target) return;
    const style = window.getComputedStyle(target);
    
    // Ignore interactive targets
    if (
      style.cursor === 'pointer' ||
      target.closest('a') ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('select') ||
      target.closest('[role="button"]') ||
      target.closest('.theme-btn') ||
      target.closest('.filter-btn') ||
      target.closest('.nav-link') ||
      target.closest('.timeline-toggle') ||
      target.closest('.skills-toggle') ||
      target.closest('.project-toggle') ||
      target.closest('.project-card') ||
      target.closest('.terminal-header') ||
      target.closest('.copy-btn')
    ) {
      return;
    }
    
    if (!canvas) {
      initCanvas();
    }
    
    const x = e.clientX;
    const y = e.clientY;
    
    const newImpact = {
      x,
      y,
      age: 0,
      duration: 600, // shorter animation window
      squares: createSquares(x, y),
    };
    
    activeEffects.push(newImpact);
    
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(updateAndDraw);
    }
  });
}
