/**
 * CHUYỂN ĐỔI SỐ TỈNH KHÁNH HOÀ - NGÀY HỘI CÔNG NGHỆ SỐ 2026
 * Interactive Motion & Experience Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initSoundEngine();
  initDigitalOceanCanvas();
  initCountdown();
  initInteractiveMap();
  initAgendaTabs();
  initLivestreamSimulator();
  initPassGenerator();
  initCitizenQuiz();
  initAIAssistant();
  initNavbarScroll();
  initShareTools();
});

/* ===================================================================
   1. WEB AUDIO SYNTHESIZER (Cyber High-Tech Sound FX)
   =================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initSoundEngine() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.classList.toggle('muted', !soundEnabled);
    soundBtn.setAttribute('title', soundEnabled ? 'Tắt âm thanh tương tác' : 'Bật âm thanh tương tác');
    
    if (soundEnabled) {
      playCyberSound('beep', 880, 0.1);
      showToast('🔊 Đã bật hiệu ứng âm thanh số');
    } else {
      showToast('🔇 Đã tắt hiệu ứng âm thanh');
    }
  });

  // Attach hover sounds to buttons
  document.querySelectorAll('.btn, .nav-link, .tab-btn, .map-zone, .prompt-chip').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (soundEnabled) playCyberSound('blip', 600, 0.04);
    });
  });
}

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playCyberSound(type = 'beep', freq = 600, duration = 0.1) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'blip') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + duration);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    } else if (type === 'beep') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    } else if (type === 'success') {
      // Arpeggio chime
      [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(f, now + idx * 0.08);
        g.gain.setValueAtTime(0.06, now + idx * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.2);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(now + idx * 0.08);
        o.stop(now + idx * 0.08 + 0.2);
      });
      return;
    } else if (type === 'heart') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    }

    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {
    // Audio context silently handled
  }
}

/* ===================================================================
   2. DIGITAL OCEAN CANVAS (Particles & Cybernetic Mesh)
   =================================================================== */
function initDigitalOceanCanvas() {
  const canvas = document.getElementById('digital-ocean-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const particleCount = Math.floor((width * height) / 14000);
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(79, 172, 254, ',
        baseAlpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseVal: Math.random() * Math.PI
      });
    }
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Render interactive mesh lines & particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.pulseVal += p.pulseSpeed;

      // Bounce
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse influence (repel slightly & brighten)
      if (mouse.x !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 3;
          p.y -= (dy / dist) * force * 3;
        }
      }

      // Draw particle
      const currentAlpha = p.baseAlpha + Math.sin(p.pulseVal) * 0.15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + currentAlpha + ')';
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(0, 242, 254, 0.4)';
      ctx.fill();

      // Connect nearby particles to simulate digital ocean net
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          const lineAlpha = (1 - dist / 100) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.shadowBlur = 0;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   3. COUNTDOWN TIMER TO 24-10-2026 (08:00 AM)
   =================================================================== */
function initCountdown() {
  // Target: October 24, 2026 at 08:00:00 (GMT+7)
  const targetDate = new Date('2026-10-24T08:00:00+07:00').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ===================================================================
   4. INTERACTIVE 3D FLOOR PLAN (Sơ đồ triển lãm Quảng Trường 2/4)
   =================================================================== */
const zoneData = {
  'zone-a': {
    title: 'Khu A: Sân Khấu Chính & Lễ Khai Mạc / Bế Mạc',
    desc: 'Trung tâm của ngày hội đối diện bờ biển Nha Trang, nơi diễn ra Lễ khai mạc trọng thể (8h00 ngày 24-10) và Bế mạc (14h00 ngày 26-10) với hơn 1.000 đại biểu.',
    status: 'Trực tiếp • Sức chứa 1.000+ ghế',
    booths: [
      'Khu vực khách mời cấp cao & Lãnh đạo tỉnh Khánh Hòa',
      'Hệ thống màn hình LED cong Holographic 360 độ',
      'Trung tâm điều khiển phát sóng trực tiếp (Broadcasting Hub)'
    ]
  },
  'zone-b': {
    title: 'Khu B: Trình Diễn AI & Robot Thông Minh',
    desc: 'Không gian công nghệ đột phá với các robot dịch vụ đón tiếp, cánh tay robot công nghiệp tự động hóa, camera AI phân tích hành vi và xử lý ngôn ngữ tự nhiên.',
    status: 'Tương tác 100% • 18 Gian hàng AI Tech',
    booths: [
      'Trải nghiệm giao tiếp với Robot trợ lý hình người',
      'Trình diễn xe tự hành thông minh & thiết bị bay không người lái (Drone)',
      'Hệ sinh thái giải pháp AI cho Doanh nghiệp & Đô thị'
    ]
  },
  'zone-c': {
    title: 'Khu C: Thực Tế Ảo VR/AR & Metaverse Nha Trang',
    desc: 'Khu vực tái hiện bản sao số (Digital Twin) di tích Tháp Bà Ponagar, danh thắng Vịnh Nha Trang và không gian trải nghiệm kính thực tế hỗn hợp cao cấp.',
    status: 'Trải nghiệm miễn phí • 12 Booth VR/AR',
    booths: [
      'Kính thực tế ảo du ngoạn vịnh biển Nha Trang 2026',
      'Game công nghệ số: Khám phá xứ Trầm Metaverse',
      'Phòng chiếu số không gian 3D Immersive đa chiều'
    ]
  },
  'zone-d': {
    title: 'Khu D: Mega Livestream Studio OCOP Xứ Trầm',
    desc: 'Sân khấu Livestream đa nền tảng kết hợp các sàn TMĐT lớn (TikTok Shop, Shopee, Postmart) quảng bá nông sản số, Yến sào Khánh Hòa, Trầm hương và xoài Cam Lâm.',
    status: 'Đang hoạt động • 15 Gian hàng OCOP số',
    booths: [
      'Studio Mega Livestream chuyên nghiệp cùng KOC/KOL nổi tiếng',
      'Quầy trải nghiệm thanh toán mã QR không tiền mặt',
      'Trạm cấp mã định danh số & truy xuất nguồn gốc Blockchain'
    ]
  },
  'zone-e': {
    title: 'Khu E: Dịch Vụ Công Dân Số & An Toàn Mạng',
    desc: 'Hướng dẫn công dân sử dụng dịch vụ công trực tuyến 2 cấp, kích hoạt định danh VNeID, cấp chữ ký số cá nhân và lớp tập huấn kỹ năng phòng chống lừa đảo trực tuyến.',
    status: 'Phục vụ người dân • 15 Bàn tư vấn 1-1',
    booths: [
      'Tổ Công nghệ số cộng đồng hướng dẫn công dân 1-chạm',
      'Đấu trường Cyber Defense: Nhận diện thủ đoạn lừa đảo mạng',
      'Khu cấp chữ ký số công dân & thẻ y tế thông minh'
    ]
  }
};

function initInteractiveMap() {
  const zones = document.querySelectorAll('.map-zone');
  const titleEl = document.getElementById('zone-title');
  const descEl = document.getElementById('zone-desc');
  const statusEl = document.getElementById('zone-status');
  const boothsEl = document.getElementById('zone-booths');

  if (!zones.length || !titleEl) return;

  zones.forEach(zone => {
    zone.addEventListener('click', () => {
      const zoneId = zone.getAttribute('data-zone');
      if (!zoneData[zoneId]) return;

      playCyberSound('beep', 750, 0.08);

      // Highlight active zone
      zones.forEach(z => z.classList.remove('active'));
      zone.classList.add('active');

      // Update panel with smooth transition
      const data = zoneData[zoneId];
      titleEl.textContent = data.title;
      descEl.textContent = data.desc;
      statusEl.textContent = data.status;

      boothsEl.innerHTML = data.booths
        .map(b => `<li><i class="fas fa-check-circle"></i> ${b}</li>`)
        .join('');
    });
  });
}

/* ===================================================================
   5. INTERACTIVE AGENDA / TIMELINE TABS
   =================================================================== */
function initAgendaTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn[data-day]');
  const timelineNodes = document.querySelectorAll('.timeline-node[data-day]');

  if (!tabBtns.length || !timelineNodes.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playCyberSound('blip', 650, 0.06);

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetDay = btn.getAttribute('data-day');

      timelineNodes.forEach(node => {
        if (targetDay === 'all' || node.getAttribute('data-day') === targetDay) {
          node.style.display = 'block';
          node.style.animation = 'slideUp 0.35s ease';
        } else {
          node.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   6. MEGA LIVESTREAM SIMULATOR
   =================================================================== */
function initLivestreamSimulator() {
  const heartBtn = document.getElementById('btn-send-heart');
  const heartsLayer = document.getElementById('hearts-layer');
  const chatBox = document.getElementById('stream-chat-container');
  const viewerCountEl = document.getElementById('live-viewers-count');
  const commentInput = document.getElementById('stream-comment-input');

  if (!heartBtn || !heartsLayer) return;

  // Floating hearts trigger
  heartBtn.addEventListener('click', () => {
    createFloatingHeart();
    playCyberSound('heart');
  });

  function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = ['❤️', '💖', '🔥', '✨', '⚡'][Math.floor(Math.random() * 5)];
    heart.style.left = `${Math.random() * 40}px`;
    heart.style.fontSize = `${Math.random() * 0.8 + 1.2}rem`;
    heartsLayer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 2000);
  }

  // Simulated live comments feed
  const simulatedComments = [
    { name: 'Hoàng Long', text: 'Chất lượng Yến sào Khánh Hòa Sanest chuẩn 5 sao!', badge: 'Khách VIP' },
    { name: 'Ngọc Lan - Nha Trang', text: 'Trầm hương xông phòng mùi rất thanh và thư thái ❤️', badge: 'Đã mua' },
    { name: 'Bác Ba Cam Lâm', text: 'Xoài sấy dẻo có truy xuất QR nguồn gốc rất yên tâm.', badge: 'Đã xác thực' },
    { name: 'Minh Tuấn (Đà Nẵng)', text: 'Có giao hàng nhanh ra Đà Nẵng trong ngày hội không?', badge: 'Hỏi đáp' },
    { name: 'Thu Thảo Tech', text: 'Vừa chốt đơn combo Yến + Trầm hương nhận vé Metaverse!', badge: 'Đã mua' },
    { name: 'Văn Hùng (Cam Ranh)', text: 'Chính quyền số 2 cấp xử lý dịch vụ công rất tiện.', badge: 'Công dân số' }
  ];

  let commentIdx = 0;
  setInterval(() => {
    if (!chatBox) return;
    const c = simulatedComments[commentIdx % simulatedComments.length];
    commentIdx++;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.innerHTML = `<span class="author">${c.name}</span>: ${c.text} <span class="item-badge">${c.badge}</span>`;
    chatBox.appendChild(bubble);

    // Keep max 5 comments
    while (chatBox.children.length > 5) {
      chatBox.removeChild(chatBox.firstChild);
    }
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 3500);

  // User comments in simulation
  if (commentInput) {
    commentInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && commentInput.value.trim() !== '') {
        const text = commentInput.value.trim();
        commentInput.value = '';

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        bubble.style.borderLeftColor = '#00f5a0';
        bubble.innerHTML = `<span class="author" style="color:#00f5a0">Bạn</span>: ${text} <span class="item-badge" style="color:#00f5a0; background:rgba(0,245,160,0.15)">Vừa gửi</span>`;
        chatBox.appendChild(bubble);
        chatBox.scrollTop = chatBox.scrollHeight;

        createFloatingHeart();
        playCyberSound('beep', 900, 0.08);
      }
    });
  }

  // Fluctuating viewers
  setInterval(() => {
    if (!viewerCountEl) return;
    const current = parseInt(viewerCountEl.textContent.replace(/\D/g, '')) || 1420;
    const delta = Math.floor(Math.random() * 15) - 7;
    viewerCountEl.textContent = `${(current + delta).toLocaleString()} đang xem`;
  }, 4000);
}

/* ===================================================================
   7. HOLOGRAPHIC VIP PASS GENERATOR
   =================================================================== */
function initPassGenerator() {
  const nameInput = document.getElementById('pass-input-name');
  const orgInput = document.getElementById('pass-input-org');
  const roleSelect = document.getElementById('pass-input-role');
  const btnGenerate = document.getElementById('btn-generate-pass');
  const btnDownload = document.getElementById('btn-download-pass');

  const cardName = document.getElementById('pass-display-name');
  const cardOrg = document.getElementById('pass-display-org');
  const cardRole = document.getElementById('pass-display-role');
  const cardCode = document.getElementById('pass-display-code');
  const holoCard = document.getElementById('holo-pass-card');
  const qrCanvas = document.getElementById('pass-qr-canvas');

  if (!nameInput || !holoCard) return;

  function renderPass() {
    const name = nameInput.value.trim() || 'NGUYỄN VĂN AN';
    const org = orgInput.value.trim() || 'UBND Tỉnh Khánh Hoà';
    const role = roleSelect.value || 'ĐẠI BIỂU DANH DỰ';

    cardName.textContent = name.toUpperCase();
    cardOrg.textContent = org;
    cardRole.textContent = role;

    // Generate unique Pass ID
    const randomHash = Math.random().toString(36).substring(2, 6).toUpperCase();
    const passCode = `KH26-${randomHash}-VIP`;
    cardCode.textContent = passCode;

    drawSyntheticQRCode(qrCanvas, passCode + '-' + name);
    playCyberSound('success');
    showToast('🎫 Thẻ số Metaverse đã được cập nhật thành công!');
  }

  if (btnGenerate) {
    btnGenerate.addEventListener('click', (e) => {
      e.preventDefault();
      renderPass();
    });
  }

  // 3D Tilt Effect on mousemove over Pass Card
  holoCard.addEventListener('mousemove', (e) => {
    const rect = holoCard.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 14;
    const rotY = (x / (rect.width / 2)) * 14;

    holoCard.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  });

  holoCard.addEventListener('mouseleave', () => {
    holoCard.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
  });

  // Download pass mock
  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      playCyberSound('success');
      showToast('📥 Đang xuất thẻ số độ phân giải cao...');
      setTimeout(() => {
        window.print();
      }, 700);
    });
  }

  // Initialize first render
  renderPass();
}

/**
 * Procedural Matrix QR Code Canvas Generator
 */
function drawSyntheticQRCode(canvas, dataStr) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = '#0a1128';
  const gridSize = 19;
  const cellSize = size / gridSize;

  // Simple deterministic seed from string
  let seed = 0;
  for (let i = 0; i < dataStr.length; i++) {
    seed = (seed + dataStr.charCodeAt(i) * 31) % 10000;
  }

  function pseudoRand() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  // Draw 3 corner position squares
  function drawCorner(r, c) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          ctx.fillRect((c + j) * cellSize, (r + i) * cellSize, cellSize, cellSize);
        }
      }
    }
  }

  drawCorner(0, 0);
  drawCorner(0, gridSize - 7);
  drawCorner(gridSize - 7, 0);

  // Fill pseudo random dots
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const inCorner1 = r < 7 && c < 7;
      const inCorner2 = r < 7 && c >= gridSize - 7;
      const inCorner3 = r >= gridSize - 7 && c < 7;
      if (!inCorner1 && !inCorner2 && !inCorner3) {
        if (pseudoRand() > 0.5) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize - 0.5, cellSize - 0.5);
        }
      }
    }
  }
}

/* ===================================================================
   8. MINI GAME: THỬ THÁCH CÔNG DÂN SỐ KHÁNH HÒA 2026
   =================================================================== */
const quizQuestions = [
  {
    q: 'Chủ đề chính của Ngày hội Công nghệ số tỉnh Khánh Hòa năm 2026 là gì?',
    options: [
      'Chuyển đổi số toàn diện - Kết nối toàn cầu',
      'Chuyển đổi số tỉnh Khánh Hòa: Từ kiến trúc, nền tảng, dữ liệu đến kết quả thực chất, nâng cao hiệu quả quản trị địa phương',
      'Ứng dụng trí tuệ nhân tạo và kinh tế biển đảo',
      'Phát triển hạ tầng viễn thông và đô thị thông minh 5G'
    ],
    correct: 1
  },
  {
    q: 'Ngày hội Công nghệ số tỉnh Khánh Hòa năm 2026 diễn ra vào thời gian và địa điểm nào?',
    options: [
      'Từ 10-12/10/2026 tại Công viên Yến Phi',
      'Từ 24-26/10/2026 tại Quảng trường 2 tháng 4, TP. Nha Trang',
      'Từ 15-18/10/2026 tại Trung tâm Hội nghị 46 Trần Phú',
      'Từ 01-03/11/2026 tại Khu đô thị Mỹ Gia'
    ],
    correct: 1
  },
  {
    q: 'Tỉnh Khánh Hòa định hướng xúc tiến đầu tư xây dựng hạ tầng số chiến lược nào tại phường Tây Nha Trang?',
    options: [
      'Trung tâm dữ liệu đa mục tiêu và Khu công nghệ số tập trung',
      'Nhà máy lắp ráp điện thoại thông minh',
      'Cảng hàng hải quốc tế số hóa',
      'Trung tâm hội chợ nông sản Tây Nam'
    ],
    correct: 0
  },
  {
    q: 'Công dân Khánh Hòa cần làm gì khi nhận cuộc gọi tự xưng cơ quan công an yêu cầu chuyển tiền bảo mật?',
    options: [
      'Chuyển tiền ngay để chứng minh không vi phạm',
      'Cung cấp mật khẩu OTP ngân hàng để xác thực tài khoản',
      'Tuyệt đối không chuyển tiền, không cung cấp OTP và báo ngay cho cơ quan chức năng/Tổ CNS cộng đồng',
      'Tải ứng dụng lạ từ đường link lạ theo hướng dẫn'
    ],
    correct: 2
  }
];

function initCitizenQuiz() {
  let currentStep = 0;
  let score = 0;

  const stepTag = document.getElementById('quiz-step');
  const titleEl = document.getElementById('quiz-title');
  const optionsBox = document.getElementById('quiz-options');
  const progressFill = document.getElementById('quiz-progress');
  const cardBody = document.getElementById('quiz-card-body');
  const resultPanel = document.getElementById('quiz-result');
  const scoreEl = document.getElementById('quiz-score-val');
  const btnRestart = document.getElementById('btn-restart-quiz');

  if (!titleEl || !optionsBox) return;

  function loadQuestion(idx) {
    const qData = quizQuestions[idx];
    stepTag.textContent = `CÂU HỎI 0${idx + 1} / 0${quizQuestions.length}`;
    titleEl.textContent = qData.q;
    progressFill.style.width = `${((idx + 1) / quizQuestions.length) * 100}%`;

    optionsBox.innerHTML = '';
    qData.options.forEach((opt, oIdx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `<span><strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt}</span> <i class="fas fa-chevron-right"></i>`;

      btn.addEventListener('click', () => {
        handleAnswer(oIdx, qData.correct, btn);
      });
      optionsBox.appendChild(btn);
    });
  }

  function handleAnswer(selected, correct, clickedBtn) {
    const allBtns = optionsBox.querySelectorAll('.quiz-option-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    if (selected === correct) {
      score += 25;
      clickedBtn.classList.add('selected-correct');
      playCyberSound('success');
    } else {
      clickedBtn.classList.add('selected-wrong');
      allBtns[correct].classList.add('selected-correct');
      playCyberSound('beep', 300, 0.2);
    }

    setTimeout(() => {
      currentStep++;
      if (currentStep < quizQuestions.length) {
        loadQuestion(currentStep);
      } else {
        showResults();
      }
    }, 1200);
  }

  function showResults() {
    cardBody.style.display = 'none';
    resultPanel.style.display = 'block';
    resultPanel.style.animation = 'slideUp 0.4s ease';
    scoreEl.textContent = `${score} / 100 ĐIỂM`;
    playCyberSound('success');
  }

  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      currentStep = 0;
      score = 0;
      resultPanel.style.display = 'none';
      cardBody.style.display = 'block';
      loadQuestion(0);
      playCyberSound('beep');
    });
  }

  loadQuestion(0);
}

/* ===================================================================
   9. INTERACTIVE FLOATING AI ASSISTANT ("Trợ Lý Số Khánh Hòa")
   =================================================================== */
function initAIAssistant() {
  const launcher = document.getElementById('ai-chat-launcher');
  const chatWindow = document.getElementById('ai-chat-window');
  const btnClose = document.getElementById('btn-close-chat');
  const btnClear = document.getElementById('btn-ai-clear');
  const chatMessages = document.getElementById('ai-messages-list');
  const inputEl = document.getElementById('ai-chat-input');
  const btnSend = document.getElementById('btn-send-ai');
  const chips = document.querySelectorAll('.prompt-chip');
  const providerBadge = document.getElementById('ai-provider-badge');

  if (!launcher || !chatWindow) return;

  // Hệ thống mã hóa khóa API
  const DEFAULT_DEEPSEEK_KEY = atob('c2stNmJjZDIxMDJhZTQ1NDIxYWE5NjlkNjE3MmM2MzA2NGY=');
  const DEFAULT_GEMINI_KEY = atob('QVEuQWI4Uk42SkRIa1E3WTJjcEhIUGt0Y3pEdHdpY2RJaHFLZjBDUEZCMFRCMnZtNEtzNnc=');

  const CDSKH_AI_CONFIG = {
    provider: localStorage.getItem('cdskh_ai_provider') || 'deepseek',
    deepseekKey: localStorage.getItem('cdskh_deepseek_key') || DEFAULT_DEEPSEEK_KEY,
    geminiKey: localStorage.getItem('cdskh_gemini_key') || DEFAULT_GEMINI_KEY,
    geminiModel: 'gemini-3.8-flash',
    deepseekModel: 'deepseek-chat',
    maxHistory: 10
  };

  // Kho tri thức toàn diện: Khoa học công nghệ, Đổi mới sáng tạo, Chuyển đổi số & Sự kiện Khánh Hòa 2026
  const SYSTEM_KNOWLEDGE = `
Bạn là "Trợ lý AI Ngày Hội Công Nghệ Số Tỉnh Khánh Hòa 2026" - Cổng thông tin tương tác chính thức cdskh.online.
BẠN LÀ CHUYÊN GIA HÀNG ĐẦU VỀ:
1. KHOA HỌC CÔNG NGHỆ (Science & Technology):
   - Trí tuệ nhân tạo (AI): Generative AI, Large Language Models (LLM), Thị giác máy tính (Computer Vision), Xử lý ngôn ngữ tự nhiên (NLP), Robot thông minh phục vụ xã hội.
   - Công nghệ số tiên phong: Thực tế ảo/tăng cường (VR/AR), Bản sao số (Digital Twin), Metaverse, Điện toán đám mây (Cloud Computing), Dữ liệu lớn (Big Data), Internet kết nối vạn vật (IoT), Blockchain bảo mật chuỗi cung ứng.
   - An toàn, an ninh mạng và bảo vệ dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP.

2. ĐỔI MỚI SÁNG TẠO (Innovation):
   - Hệ sinh thái Khởi nghiệp Đổi mới sáng tạo (Startup Ecosystem) theo Nghị quyết 09-NQ/TW của Bộ Chính trị về xây dựng, phát triển tỉnh Khánh Hòa.
   - Trung tâm nghiên cứu phát triển (R&D), vườn ươm doanh nghiệp công nghệ số, chuyển giao công nghệ cao.
   - Ứng dụng khoa học công nghệ vào kinh tế biển, nuôi biển công nghệ cao, du lịch thông minh, năng lượng tái tạo và kinh tế xanh bền vững.

3. CHUYỂN ĐỔI SỐ (Digital Transformation - CĐS) TỈNH KHÁNH HÒA:
   - 3 Trụ cột quốc gia & 4 Trụ cột tỉnh Khánh Hòa:
     + Chính quyền số: Nền tảng dữ liệu dùng chung, Trung tâm Giám sát điều hành thông minh (IOC Khánh Hòa), 100% dịch vụ công trực tuyến toàn trình, họp không giấy, số hóa hồ sơ thủ tục hành chính.
     + Kinh tế số: Nông nghiệp số, OCOP số (Yến sào Sanest Khánh Hòa, Trầm hương Vạn Giã, Xoài Cam Lâm, Tỏi Ninh Hòa), thanh toán không dùng tiền mặt, chợ số, sàn TMĐT.
     + Xã hội số: Công dân số, tài khoản định danh điện tử VNeID, sổ sức khỏe điện tử, học bạ số, tổ công nghệ số cộng đồng phủ kín từng thôn xóm/tổ dân phố.
     + Nền tảng & Kiến trúc: Kiến trúc Chính quyền điện tử Khánh Hòa 2.0 hướng tới Chính quyền số, liên thông dữ liệu thời gian thực.

4. THÔNG TIN SỰ KIỆN "NGÀY HỘI CÔNG NGHỆ SỐ TỈNH KHÁNH HÒA NĂM 2026":
   - Thời gian: 24 đến 26/10/2026 (Khởi động: 10/10/2026; Diễn đàn kết nối doanh nghiệp: 07/10/2026).
   - Địa điểm: Quảng trường 2 tháng 4, đường Trần Phú, TP. Nha Trang, tỉnh Khánh Hòa (trước Tháp Trầm Hương & bãi biển Nha Trang).
   - Chủ đề: "Chuyển đổi số tỉnh Khánh Hòa: Từ kiến trúc, nền tảng, dữ liệu đến kết quả thực chất, nâng cao hiệu quả quản trị địa phương".
   - Cơ quan chủ trì: UBND Tỉnh Khánh Hòa • Sở Thông tin và Truyền thông Khánh Hòa.
   - Hotline hỗ trợ: 0258 3822 019 | Email: stttt@khanhhoa.gov.vn | Website: https://cdskh.online/
   - Điểm nhấn sự kiện: Triển lãm Robot AI tương tác, Sa bàn 3D Metaverse Vịnh Nha Trang, Mega Livestream OCOP số, Đăng ký thẻ VIP Metaverse định danh QR, Thử thách số nhận quà công nghệ.

QUY TẮC PHỤC VỤ:
- Xưng hô: "Xin chào quý khách/đồng chí! Tôi là Trợ lý AI Chuyển đổi số Khánh Hòa".
- Trả lời chuyên nghiệp, khoa học, chính xác, súc tích, văn phong hiện đại, khích lệ tinh thần đổi mới sáng tạo và chuyển đổi số thực chất.
- Định dạng Markdown đẹp mắt (gạch đầu dòng, in đậm từ khóa, icon công nghệ).
`;

  let chatHistory = [
    {
      role: 'assistant',
      content: 'Xin chào quý khách! Tôi là **Trợ lý AI Ngày hội Công nghệ số tỉnh Khánh Hòa năm 2026** (kết hợp song song *DeepSeek & Google Gemini*). Tôi sẵn sàng giải đáp mọi thắc mắc về **khoa học công nghệ, đổi mới sáng tạo, chuyển đổi số**, lịch trình sự kiện và thẻ đại biểu VIP.'
    }
  ];

  // Helper Markdown to HTML
  function formatMarkdown(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/(?:^|\n)[*-]\s+(.+)/g, '\n<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
    html = html.replace(/(0258[\s.]?\d{3}[\s.]?\d{3})/g, '<a href="tel:$1" style="color:var(--cyan-core); text-decoration:underline;"><strong>$1</strong></a>');
    html = html.replace(/\n\n+/g, '<br><br>').replace(/\n/g, '<br>');
    return html;
  }

  // Fallback thông minh
  function getSmartFallbackReply(query) {
    const q = query.toLowerCase();

    if (q.includes('xu hướng') || q.includes('đổi mới sáng tạo') || q.includes('khoa học công nghệ') || q.includes('kh&cn') || q.includes('đmst')) {
      return `🚀 <strong>Xu hướng Khoa học công nghệ & Đổi mới sáng tạo 2026:</strong><br><br>` +
        `• <strong>Trí tuệ nhân tạo tạo sinh (Generative AI) & LLM:</strong> Tự động hóa dịch vụ công, trợ lý số hành chính công phục vụ người dân 24/7.<br>` +
        `• <strong>Bản sao số (Digital Twin) & Đô thị thông minh:</strong> Mô phỏng không gian số 3D đô thị Nha Trang, phân tích dòng chảy du lịch và dự báo quy hoạch.<br>` +
        `• <strong>Kinh tế biển công nghệ cao:</strong> Ứng dụng IoT giám sát môi trường biển, công nghệ viễn thám và truy xuất nguồn gốc thủy sản xuất khẩu.<br>` +
        `• <strong>An ninh mạng & Bảo vệ dữ liệu số:</strong> Áp dụng kiến trúc Zero-Trust bảo vệ an toàn thông tin cơ quan nhà nước và doanh nghiệp.`;
    }

    if (q.includes('chuyển đổi số') || q.includes('4 trụ cột') || q.includes('trụ cột') || q.includes('cđs')) {
      return `💡 <strong>4 Trụ Cột Chuyển Đổi Số Tỉnh Khánh Hòa:</strong><br><br>` +
        `1. <strong>Chính quyền số vững mạnh:</strong> Xây dựng nền tảng dữ liệu tập trung, Trung tâm Giám sát điều hành thông minh (IOC Khánh Hòa), 100% hồ sơ xử lý trực tuyến toàn trình.<br>` +
        `2. <strong>Kinh tế số bứt phá:</strong> Số hóa nông nghiệp OCOP, phát triển du lịch thông minh Nha Trang, thương mại điện tử và thúc đẩy thanh toán không dùng tiền mặt.<br>` +
        `3. <strong>Xã hội số nhân văn:</strong> Phát triển công dân số, phổ cập danh tính điện tử VNeID, y tế thông minh, học bạ số và mạng lưới Tổ công nghệ số cộng đồng.<br>` +
        `4. <strong>Đổi mới sáng tạo & Nhân lực số:</strong> Phát triển hệ sinh thái khởi nghiệp sáng tạo, thu hút nhân tài công nghệ cao về vùng đất xứ Trầm biển xanh.`;
    }

    if (q.includes('thời gian') || q.includes('khi nào') || q.includes('lịch') || q.includes('chương trình')) {
      return `📅 <strong>Lịch trình Ngày hội Công nghệ số 2026:</strong><br><br>` +
        `• Khởi động phong trào số: Ngày 10-10-2026.<br>` +
        `• Diễn đàn kết nối DN & xúc tiến ĐT công nghệ: Ngày 07-10-2026.<br>` +
        `• <strong>Ngày hội chính thức:</strong> Từ ngày <strong>24 đến 26-10-2026</strong> tại Quảng trường 2/4 Nha Trang.<br>` +
        `• Khai mạc trọng thể: 08:00 sáng ngày 24-10-2026.<br>` +
        `• Bế mạc & Trao giải thưởng số: 14:00 chiều ngày 26-10-2026.`;
    }

    if (q.includes('địa điểm') || q.includes('ở đâu') || q.includes('bản đồ')) {
      return `📍 <strong>Địa điểm tổ chức:</strong><br><br>` +
        `Khu vực <strong>Quảng trường 2 tháng 4</strong>, đường Trần Phú, TP. Nha Trang, tỉnh Khánh Hòa (ngay trước biểu tượng Tháp Trầm Hương lịch sử, hướng nhìn vịnh biển Nha Trang).`;
    }

    if (q.includes('ai') || q.includes('robot') || q.includes('metaverse') || q.includes('trải nghiệm')) {
      return `🤖 <strong>Không gian Trải nghiệm Công nghệ đỉnh cao:</strong><br><br>` +
        `• Trình diễn Robot hình người & Robot dịch vụ thông minh hỗ trợ đại biểu.<br>` +
        `• Sa bàn 3D Metaverse Vịnh Nha Trang và các di sản văn hóa Khánh Hòa số hóa.<br>` +
        `• Gần 60 gian hàng công nghệ giới thiệu giải pháp AI, Cloud, Big Data từ các tập đoàn công nghệ hàng đầu Việt Nam và quốc tế.`;
    }

    if (q.includes('vé') || q.includes('thẻ') || q.includes('vip') || q.includes('đăng ký')) {
      return `🎫 <strong>Đăng ký Vé / Thẻ Đại Biểu VIP Metaverse:</strong><br><br>` +
        `Sự kiện <strong>hoàn toàn miễn phí</strong> cho nhân dân và du khách!<br>` +
        `Quý khách có thể kéo tới khu vực <strong>"Tạo Thẻ VIP Metaverse"</strong> ngay trên trang web cdskh.online để nhập thông tin và nhận ngay thẻ số hóa định danh mã QR độc quyền!`;
    }

    return `Dạ, Cổng thông tin Ngày hội Công nghệ số tỉnh Khánh Hòa năm 2026 (cdskh.online) luôn sẵn sàng giải đáp mọi câu hỏi về khoa học công nghệ, chuyển đổi số và đổi mới sáng tạo! Quý khách có thể liên hệ trực tiếp đường dây nóng <strong>0258 3822 019</strong> (Sở TT&TT tỉnh Khánh Hòa).`;
  }

  // Gọi DeepSeek API
  async function callDeepSeekAPI(messages) {
    const formattedMessages = [
      { role: 'system', content: SYSTEM_KNOWLEDGE },
      ...messages.slice(-CDSKH_AI_CONFIG.maxHistory)
    ];

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CDSKH_AI_CONFIG.deepseekKey}`
      },
      body: JSON.stringify({
        model: CDSKH_AI_CONFIG.deepseekModel,
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 650
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`DeepSeek API error (${response.status}): ${err}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  // Gọi Google Gemini API
  async function callGeminiAPI(messages) {
    const contents = messages.slice(-CDSKH_AI_CONFIG.maxHistory).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${CDSKH_AI_CONFIG.geminiModel}:generateContent?key=${CDSKH_AI_CONFIG.geminiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: SYSTEM_KNOWLEDGE }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 650
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${err}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  // Request điều phối song song
  async function requestAIResponse(userText) {
    chatHistory.push({ role: 'user', content: userText });

    const primary = CDSKH_AI_CONFIG.provider;
    const backup = primary === 'deepseek' ? 'gemini' : 'deepseek';

    try {
      if (primary === 'deepseek') {
        const reply = await callDeepSeekAPI(chatHistory);
        if (reply) return { reply, provider: 'DeepSeek AI' };
      } else {
        const reply = await callGeminiAPI(chatHistory);
        if (reply) return { reply, provider: 'Gemini AI' };
      }
    } catch (e1) {
      console.warn(`[CDSKH AI] Primary ${primary} failed, trying backup ${backup}:`, e1.message);
      try {
        if (backup === 'deepseek') {
          const reply = await callDeepSeekAPI(chatHistory);
          if (reply) return { reply, provider: 'DeepSeek AI (Backup)' };
        } else {
          const reply = await callGeminiAPI(chatHistory);
          if (reply) return { reply, provider: 'Gemini AI (Backup)' };
        }
      } catch (e2) {
        console.warn(`[CDSKH AI] Both AI APIs failed, using local smart knowledge:`, e2.message);
      }
    }

    const fallback = getSmartFallbackReply(userText);
    return { reply: fallback, provider: 'Trợ lý số Khánh Hòa' };
  }

  // Event Listeners
  launcher.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    if (typeof playCyberSound === 'function') playCyberSound('beep', 800, 0.08);
  });

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      chatWindow.classList.remove('active');
    });
  }

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (confirm('Quý khách có muốn làm mới phiên trò chuyện Trợ lý AI không?')) {
        chatHistory = [chatHistory[0]];
        chatMessages.innerHTML = `
          <div class="msg msg-bot">
            Xin chào quý khách! Tôi là <strong>Trợ lý AI Ngày hội Công nghệ số tỉnh Khánh Hòa năm 2026</strong>. Tôi sẵn sàng giải đáp mọi thắc mắc về <strong>khoa học công nghệ, đổi mới sáng tạo, chuyển đổi số</strong>, lịch trình sự kiện và thẻ đại biểu VIP.
          </div>
        `;
      }
    });
  }

  // Đổi nhanh Provider bằng cách bấm vào badge
  if (providerBadge) {
    providerBadge.addEventListener('click', () => {
      CDSKH_AI_CONFIG.provider = CDSKH_AI_CONFIG.provider === 'deepseek' ? 'gemini' : 'deepseek';
      localStorage.setItem('cdskh_ai_provider', CDSKH_AI_CONFIG.provider);
      providerBadge.textContent = CDSKH_AI_CONFIG.provider === 'deepseek' ? 'DeepSeek AI' : 'Gemini AI';
      providerBadge.style.color = CDSKH_AI_CONFIG.provider === 'deepseek' ? 'var(--cyan-core)' : '#f59e0b';
      if (typeof showToast === 'function') {
        showToast(`Đã chuyển sang mô hình ưu tiên: ${CDSKH_AI_CONFIG.provider === 'deepseek' ? 'DeepSeek AI' : 'Google Gemini AI'}`);
      }
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const promptText = chip.getAttribute('data-prompt') || chip.textContent.trim();
      sendUserMessage(promptText);
    });
  });

  if (btnSend && inputEl) {
    btnSend.addEventListener('click', () => {
      const text = inputEl.value.trim();
      if (text) {
        sendUserMessage(text);
        inputEl.value = '';
      }
    });

    inputEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const text = inputEl.value.trim();
        if (text) {
          sendUserMessage(text);
          inputEl.value = '';
        }
      }
    });
  }

  async function sendUserMessage(text) {
    const userMsg = document.createElement('div');
    userMsg.className = 'msg msg-user';
    userMsg.textContent = text;
    chatMessages.appendChild(userMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (typeof playCyberSound === 'function') playCyberSound('blip', 700, 0.05);

    // Typing indicator
    const typingMsg = document.createElement('div');
    typingMsg.className = 'msg msg-bot';
    typingMsg.innerHTML = '<i class="fas fa-circle-notch fa-spin" style="color:var(--cyan-core);"></i> <em>Trợ lý AI đang xử lý dữ liệu và suy luận...</em>';
    chatMessages.appendChild(typingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    btnSend.disabled = true;

    try {
      const { reply, provider } = await requestAIResponse(text);
      typingMsg.remove();
      chatHistory.push({ role: 'assistant', content: reply });

      const botMsg = document.createElement('div');
      botMsg.className = 'msg msg-bot';
      botMsg.innerHTML = `
        ${formatMarkdown(reply)}
        <div style="font-size:0.62rem; color:#64748b; margin-top:6px; text-align:right;">⚡ Được xử lý bởi <strong>${provider}</strong></div>
      `;
      chatMessages.appendChild(botMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      if (typeof playCyberSound === 'function') playCyberSound('beep', 1000, 0.08);
    } catch (err) {
      typingMsg.remove();
      const botMsg = document.createElement('div');
      botMsg.className = 'msg msg-bot';
      botMsg.innerHTML = formatMarkdown(getSmartFallbackReply(text));
      chatMessages.appendChild(botMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } finally {
      btnSend.disabled = false;
      inputEl.focus();
    }
  }
}

/* ===================================================================
   10. NAVBAR SCROLL & SMOOTH LINKS
   =================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      playCyberSound('blip');
    });
  }
}

/* ===================================================================
   11. SHARE & TOAST UTILITIES
   =================================================================== */
function initShareTools() {
  const shareFbBtns = document.querySelectorAll('.facebook-share-btn');
  shareFbBtns.forEach(b => {
    b.addEventListener('click', () => {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
      playCyberSound('beep');
    });
  });

  const copyBtns = document.querySelectorAll('.btn-copy-link');
  copyBtns.forEach(b => {
    b.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 Đã sao chép liên kết vào bộ nhớ tạm!');
      playCyberSound('success');
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
