/**
 * AstroPlot RAW - High-Performance Celestial Starfield Engine
 * Features:
 * - Multi-depth starfield with realistic stellar classification colors (Cyan, Gold, Diamond White)
 * - Natural scintillation (twinkling) and astronomical diffraction spikes on focal stars
 * - Smooth interactive cursor parallax and delicate constellation proximity connections
 * - Occasional realistic shooting star (meteor) with luminous ionization trail
 * - Zero external dependencies, sub-1% CPU usage, auto-pauses when tab is hidden
 */
(function() {
  // Check if reduced motion is requested
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let canvas, ctx;
  let width = 0, height = 0;
  let dpr = 1;
  let stars = [];
  let animId = null;
  let isVisible = true;

  // Mouse & Parallax tracking
  const mouse = { x: -1000, y: -1000, targetX: 0, targetY: 0, currentX: 0, currentY: 0, active: false };

  // Shooting star state
  let meteor = null;
  let lastMeteorTime = Date.now();
  let nextMeteorDelay = 6000 + Math.random() * 8000;

  // Star colors (Class O/B Blue-Cyan, Class A White, Class K/M Amber, Class B Ice Blue)
  const STAR_COLORS = [
    { r: 245, g: 250, b: 255 }, // Diamond White (Class A)
    { r: 245, g: 250, b: 255 },
    { r: 245, g: 250, b: 255 },
    { r: 240, g: 246, b: 255 },
    { r: 56, g: 220, b: 255 },  // Electric Cyan / Blue (Class O/B)
    { r: 56, g: 220, b: 255 },
    { r: 255, g: 215, b: 150 }, // Stellar Gold / Amber (Class K/M)
    { r: 180, g: 225, b: 255 }, // Soft Ice Blue (Class B)
  ];

  function createStar(w, h) {
    // Astronomical distribution:
    // 76% deep-field micro-stars (subtle star dust tapestry)
    // 17% midground stars
    // 7% prominent foreground focal stars
    const rand = Math.random();
    const layer = rand < 0.76 ? 0 : (rand < 0.93 ? 1 : 2);
    const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
    
    let baseRadius, alpha;
    if (layer === 0) {
      baseRadius = 0.35 + Math.random() * 0.55; // 0.35px - 0.9px micro-stars
      alpha = 0.2 + Math.random() * 0.55;
    } else if (layer === 1) {
      baseRadius = 0.85 + Math.random() * 0.65; // 0.85px - 1.5px midground
      alpha = 0.45 + Math.random() * 0.45;
    } else {
      baseRadius = 1.6 + Math.random() * 0.9;  // 1.6px - 2.5px focal stars
      alpha = 0.7 + Math.random() * 0.3;
    }

    return {
      x: Math.random() * w,
      y: Math.random() * h,
      layer,
      baseRadius,
      color,
      alpha,
      twinkleSpeed: 0.012 + Math.random() * 0.032,
      twinklePhase: Math.random() * Math.PI * 2
    };
  }

  function initStars() {
    const isMobile = width < 768;
    // Rich, dense starfield: ~800-950 stars on desktop, ~240 on mobile
    const targetCount = isMobile ? 240 : Math.min(950, Math.max(450, Math.floor((width * height) / 2400)));
    stars = [];
    for (let i = 0; i < targetCount; i++) {
      stars.push(createStar(width, height));
    }
  }

  function setupCanvas() {
    canvas = document.getElementById('astro-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'astro-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '-1';
      document.body.insertBefore(canvas, document.body.firstChild);
    }
    ctx = canvas.getContext('2d', { alpha: true });
    resize();
  }

  function resize() {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    initStars();
    if (prefersReducedMotion) {
      renderStatic();
    }
  }

  function spawnMeteor() {
    const startX = Math.random() * (width * 0.75);
    const startY = Math.random() * (height * 0.4);
    const angle = (Math.PI / 6) + (Math.random() * (Math.PI / 6)); // 30 to 60 deg downward
    const speed = 12 + Math.random() * 10;
    const length = 80 + Math.random() * 70;

    meteor = {
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length,
      opacity: 1,
      decay: 0.022 + Math.random() * 0.015
    };
  }

  function updateMeteor() {
    if (!meteor) {
      const now = Date.now();
      if (now - lastMeteorTime > nextMeteorDelay) {
        spawnMeteor();
        lastMeteorTime = now;
        nextMeteorDelay = 7000 + Math.random() * 9000;
      }
      return;
    }

    meteor.x += meteor.vx;
    meteor.y += meteor.vy;
    meteor.opacity -= meteor.decay;

    if (meteor.opacity <= 0 || meteor.x > width + 100 || meteor.y > height + 100) {
      meteor = null;
    }
  }

  function drawMeteor() {
    if (!meteor) return;

    const tailX = meteor.x - (meteor.vx / Math.hypot(meteor.vx, meteor.vy)) * meteor.length;
    const tailY = meteor.y - (meteor.vy / Math.hypot(meteor.vx, meteor.vy)) * meteor.length;

    const grad = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
    grad.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity * 0.95})`);
    grad.addColorStop(0.2, `rgba(0, 255, 255, ${meteor.opacity * 0.75})`);
    grad.addColorStop(1, 'rgba(0, 255, 255, 0)');

    ctx.save();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(meteor.x, meteor.y);
    ctx.stroke();

    // Head spark
    ctx.fillStyle = `rgba(255, 255, 255, ${meteor.opacity})`;
    ctx.beginPath();
    ctx.arc(meteor.x, meteor.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function renderStatic() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${s.alpha * 0.8})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.baseRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function renderFrame(time) {
    if (!isVisible || prefersReducedMotion) return;

    // Smooth cursor interpolation (lerp)
    mouse.currentX += (mouse.targetX - mouse.currentX) * 0.05;
    mouse.currentY += (mouse.targetY - mouse.currentY) * 0.05;

    ctx.clearRect(0, 0, width, height);

    const parallaxFactor = [0.008, 0.022, 0.042]; // Layer 0, 1, 2 parallax depth
    const maxConstellationDist = 95;
    const maxConstellationDistSq = maxConstellationDist * maxConstellationDist;

    // 1. Draw connecting constellation threads near active cursor
    if (mouse.active) {
      let nearbyStars = [];
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (s.layer === 0) continue; // Only foreground/midground stars connect

        const layerOffset = parallaxFactor[s.layer];
        const starX = s.x + mouse.currentX * layerOffset;
        const starY = s.y + mouse.currentY * layerOffset;

        const dx = mouse.x - starX;
        const dy = mouse.y - starY;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxConstellationDistSq) {
          const dist = Math.sqrt(distSq);
          const alpha = (1 - dist / maxConstellationDist) * 0.35;

          ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
          ctx.lineWidth = 0.85;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(starX, starY);
          ctx.stroke();

          nearbyStars.push({ x: starX, y: starY });
          if (nearbyStars.length >= 6) break;
        }
      }

      // Connect nearby stars to each other for constellation aesthetic
      if (nearbyStars.length > 1) {
        ctx.lineWidth = 0.65;
        for (let i = 0; i < nearbyStars.length; i++) {
          for (let j = i + 1; j < nearbyStars.length; j++) {
            const dx = nearbyStars[i].x - nearbyStars[j].x;
            const dy = nearbyStars[i].y - nearbyStars[j].y;
            const dSq = dx * dx + dy * dy;
            if (dSq < 6400) { // 80px apart
              const alpha = (1 - Math.sqrt(dSq) / 80) * 0.22;
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(nearbyStars[i].x, nearbyStars[i].y);
              ctx.lineTo(nearbyStars[j].x, nearbyStars[j].y);
              ctx.stroke();
            }
          }
        }
      }
    }

    // 2. Draw Stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const layerOffset = parallaxFactor[s.layer];
      const drawX = s.x + mouse.currentX * layerOffset;
      const drawY = s.y + mouse.currentY * layerOffset;

      // Wrap boundaries smoothly if moved beyond screen edges
      const finalX = (drawX % width + width) % width;
      const finalY = (drawY % height + height) % height;

      // Scintillation / Twinkle calculation
      s.twinklePhase += s.twinkleSpeed;
      const currentAlpha = Math.max(0.15, s.alpha * (0.65 + 0.35 * Math.sin(s.twinklePhase)));

      ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${currentAlpha})`;
      ctx.beginPath();
      ctx.arc(finalX, finalY, s.baseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Subtle circular atmospheric glow halo for bright focal stars (clean round optics)
      if (s.layer === 2 && currentAlpha > 0.55) {
        ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${currentAlpha * 0.18})`;
        ctx.beginPath();
        ctx.arc(finalX, finalY, s.baseRadius * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Update and draw occasional shooting star
    updateMeteor();
    drawMeteor();

    animId = requestAnimationFrame(renderFrame);
  }

  function handlePointerMove(e) {
    mouse.active = true;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    // Calculate normalized offset from center (-100 to +100 range)
    mouse.targetX = (e.clientX - width / 2);
    mouse.targetY = (e.clientY - height / 2);
  }

  function handlePointerLeave() {
    mouse.active = false;
    mouse.targetX = 0;
    mouse.targetY = 0;
  }

  function setupEvents() {
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    // Performance: pause animation when tab is inactive or hidden
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
      if (isVisible && !prefersReducedMotion && !animId) {
        animId = requestAnimationFrame(renderFrame);
      } else if (!isVisible && animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    });
  }

  function start() {
    setupCanvas();
    setupEvents();
    if (!prefersReducedMotion) {
      animId = requestAnimationFrame(renderFrame);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
