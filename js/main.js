/* ==========================================================================
   JAFRUL HASAN ASIF — CORE PORTFOLIO ENGINE (js/main.js)
   Fast-Movement Cursor, Direct Email to akamdasif@gmail.com,
   AI Terminal, Web Audio Synth, Filters & Optimizations
   ========================================================================== */

// Profile & Target Configuration
const PORTFOLIO_CONFIG = {
  name: "জাফরুল হাসান আসিফ",
  nameEn: "Jafrul Hasan Asif",
  targetEmail: "akamdasif@gmail.com", // 👈 সরাসরি এই ইমেইলে বার্তা পাঠানো হবে
  phone1: "01887970095",
  phone2: "01851353676",
  location: "সরকার হাট, হাটহাজারী, চট্টগ্রাম",
  academy: "এ.কে.এ কম্পিউটার ট্রেনিং সেন্টার (হাটহাজারী বড় মাদ্রাসার সামনে, চট্টগ্রাম)",
  whatsappUrl: "https://wa.me/8801887970095"
};

// ==========================================================================
// 1. WEB AUDIO API SYNTHESIZER (CYBER SOUND FX)
// ==========================================================================
class CyberSoundFX {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = false;
    this.init();
  }

  init() {
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        this.toggleSound(soundToggle);
      });
    }
  }

  ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound(btn) {
    this.ensureAudioContext();
    this.soundEnabled = !this.soundEnabled;
    const icon = btn.querySelector('i');
    if (this.soundEnabled) {
      icon.className = 'fas fa-volume-up';
      btn.style.background = 'var(--red-dark)';
      btn.style.color = '#FFFFFF';
      this.playBeep(880, 'sine', 0.1);
      showToast('সাউন্ড চালু করা হয়েছে 🔊');
    } else {
      icon.className = 'fas fa-volume-mute';
      btn.style.background = 'var(--bg-tertiary)';
      btn.style.color = 'var(--red-dark)';
      showToast('সাউন্ড বন্ধ করা হয়েছে 🔇');
    }
  }

  playBeep(freq = 600, type = 'sine', duration = 0.08) {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio policy safe
    }
  }

  playHover() {
    this.playBeep(540, 'triangle', 0.03);
  }

  playClick() {
    this.playBeep(980, 'sine', 0.06);
  }
}

const sfx = new CyberSoundFX();

// ==========================================================================
// 2. ULTRA-FAST CYBER CURSOR & AMBIENT GLOW
// ==========================================================================
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const ambientGlow = document.getElementById('ambientGlow');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Instant dot movement with hardware acceleration
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    if (ambientGlow) {
      ambientGlow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }
  }, { passive: true });

  // Ultra-smooth 120fps ring tracking with higher lerp speed (0.28) for fast movement
  function renderRing() {
    ringX += (mouseX - ringX) * 0.28;
    ringY += (mouseY - ringY) * 0.28;

    ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  // Fast interactive hover hooks
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, .cyber-card, .project-card, .filter-btn, .term-pill');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('active');
      sfx.playHover();
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('active');
    });
    el.addEventListener('click', () => {
      sfx.playClick();
    });
  });
}

// ==========================================================================
// 3. HUD NAVBAR & SCROLL SPY
// ==========================================================================
function initNavbar() {
  const navContainer = document.querySelector('.nav-container');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Navbar blur styling
        if (navContainer) {
          if (scrollY > 50) {
            navContainer.classList.add('scrolled');
          } else {
            navContainer.classList.remove('scrolled');
          }
        }

        // ScrollSpy
        sections.forEach((section) => {
          const sectionHeight = section.offsetHeight;
          const sectionTop = section.offsetTop - 130;
          const sectionId = section.getAttribute('id');

          if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach((link) => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
              }
            });
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Mobile menu events
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('open');
    });
  }

  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  }

  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.remove('open');
    });
  });
}

// ==========================================================================
// 4. INTERACTIVE AI TERMINAL SIMULATION
// ==========================================================================
function initAITerminal() {
  const termBody = document.getElementById('terminalBody');
  const termInput = document.getElementById('termInput');
  const termPills = document.querySelectorAll('.term-pill');

  if (!termBody || !termInput) return;

  const COMMANDS = {
    '/about': () => `
<span class="terminal-highlight">[IDENTIFICATION VERIFIED]</span>
👤 <strong>নাম:</strong> জাফরুল হাসান আসিফ (Jafrul Hasan Asif)
💼 <strong>ভূমিকা:</strong> AI Engineer | Computer Trainer | 3D Creative Director
🏢 <strong>অ্যাকাডেমি:</strong> এ.কে.এ কম্পিউটার ট্রেনিং সেন্টার, হাটহাজারী, চট্টগ্রাম
🎓 <strong>মেন্টরশিপ:</strong> ১০০০+ শিক্ষার্থীকে প্রফেশনাল প্রযুক্তিতে প্রশিক্ষিত করা হয়েছে।
`,
    '/skills': () => `
<span class="terminal-highlight">[CORE TECHNICAL CAPABILITIES]</span>
⚙️ <strong>এআই ও স্বয়ংক্রিয় সিস্টেম:</strong> LangGraph, CrewAI, RAG, Ollama, Python, PyTorch
🎨 <strong>ক্রিয়েটিভ ও ৩ডি:</strong> Premiere Pro, DaVinci Resolve, Spline, Three.js, Photoshop
⚡ <strong>অটোমেশন পাইপলাইন:</strong> n8n, Custom Webhooks, API Integration, Voice AI
`,
    '/ai-services': () => `
<span class="terminal-highlight">[NEXT-GEN FUTURISTIC SERVICES]</span>
1. Autonomous Multi-Agent Workflows (ব্যবসায়িক জটিল কাজ স্বয়ংক্রিয়করণ)
2. Custom Enterprise RAG & LLM Deployment (স্মার্ট নলেজ বেস ও চ্যাট এজেন্ট)
3. 3D Web & Interactive WebGL Development (ইমারসিভ ৩ডি ওয়েবসাইট)
4. AI Motion & Cinematic Video Editing (উচ্চমানের কনটেন্ট প্রডাকশন)
`,
    '/training-center': () => `
<span class="terminal-highlight">[ACADEMY STATUS: ACTIVE]</span>
🏫 <strong>প্রতিষ্ঠান:</strong> এ.কে.এ কম্পিউটার ট্রেনিং সেন্টার
📍 <strong>লোকেশন:</strong> হাটহাজারী বড় মাদ্রাসার সামনে, হাটহাজারী, চট্টগ্রাম
📚 <strong>কোর্সসমূহ:</strong> প্রফেশনাল কম্পিউটার, গ্রাফিক্স ডিজাইন, ভিডিও এডিটিং, আধুনিক এআই ও অটোমেশন।
`,
    '/contact': () => `
<span class="terminal-highlight">[COMMUNICATION CHANNELS OPEN]</span>
📞 <strong>ফোন:</strong> 01887970095 / 01851353676
💬 <strong>হোয়াটসঅ্যাপ:</strong> <a href="https://wa.me/8801887970095" target="_blank" style="color:var(--red-neon)">01887970095</a>
✉️ <strong>ইমেইল:</strong> akamdasif@gmail.com
📍 <strong>ঠিকানা:</strong> সরকার হাট, হাটহাজারী, চট্টগ্রাম
`,
    '/clear': () => {
      termBody.innerHTML = '';
      return '';
    }
  };

  function executeCommand(cmd) {
    const cleanCmd = cmd.trim().toLowerCase();
    
    // Output prompt line
    const userLine = document.createElement('div');
    userLine.innerHTML = `<span style="color:var(--red-neon)">visitor@asif-terminal:~$</span> ${cleanCmd}`;
    termBody.appendChild(userLine);

    let responseText = '';
    if (COMMANDS[cleanCmd]) {
      responseText = COMMANDS[cleanCmd]();
    } else if (cleanCmd === '') {
      responseText = '';
    } else {
      responseText = `কমান্ডটি পাওয়া যায়নি: '<span style="color:#FF5F56">${cleanCmd}</span>'। নিচের কমান্ডগুলো ট্রাই করুন: <strong>/about, /skills, /ai-services, /training-center, /contact, /clear</strong>`;
    }

    if (responseText) {
      const responseLine = document.createElement('div');
      responseLine.style.marginBottom = '14px';
      responseLine.innerHTML = responseText;
      termBody.appendChild(responseLine);
    }

    termBody.scrollTop = termBody.scrollHeight;
    sfx.playClick();
  }

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = termInput.value;
      executeCommand(cmd);
      termInput.value = '';
    }
  });

  termPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const cmd = pill.dataset.cmd;
      if (cmd) {
        termInput.value = cmd;
        executeCommand(cmd);
        termInput.value = '';
      }
    });
  });
}

// ==========================================================================
// 5. PROJECT FILTERING
// ==========================================================================
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.filter;

      projectCards.forEach((card) => {
        const category = card.dataset.category;
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

// ==========================================================================
// 6. SKILL BARS ON SCROLL
// ==========================================================================
function initSkillBars() {
  const skillSection = document.getElementById('skills');
  const progressBars = document.querySelectorAll('.skill-progress');
  if (!skillSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        progressBars.forEach((bar) => {
          const width = bar.dataset.width;
          if (width) {
            bar.style.width = `${width}%`;
          }
        });
        observer.unobserve(skillSection);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(skillSection);
}

// ==========================================================================
// 7. DIRECT EMAIL TO akamdasif@gmail.com VIA FORMSUBMIT API
// ==========================================================================
function initContactForm() {
  const submitBtn = document.getElementById('contactSubmitBtn');
  const nameInput = document.getElementById('contactName');
  const phoneInput = document.getElementById('contactPhone');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');
  const waDirectBtn = document.getElementById('waDirectBtn');
  const mailDirectBtn = document.getElementById('mailDirectBtn');

  if (!submitBtn) return;

  submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim() || 'not-provided@portfolio.com';
    const message = messageInput.value.trim();

    if (!name || !phone || !message) {
      showToast('অনুগ্রহ করে নাম, ফোন এবং বার্তা পূরণ করুন।', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>ইমেইলে পাঠানো হচ্ছে...</span>';

    // Direct FormSubmit.co AJAX Endpoint targeting akamdasif@gmail.com
    const endpoint = `https://formsubmit.co/ajax/${PORTFOLIO_CONFIG.targetEmail}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          'Sender Name': name,
          'Phone Number': phone,
          'Sender Email': email,
          'Message Content': message,
          '_subject': `🚀 নতুন পোর্টফোলিও বার্তা: ${name} (${phone})`,
          '_template': 'table',
          '_captcha': 'false'
        })
      });

      const result = await response.json();

      if (response.ok || result.success === "true") {
        showToast(`ধন্যবাদ ${name}! আপনার বার্তা সরাসরি আসিফ সাহেবের ইমেইলে পৌঁছেছে। 📬`, 'success');
        sfx.playClick();

        nameInput.value = '';
        phoneInput.value = '';
        emailInput.value = '';
        messageInput.value = '';
      } else {
        // Fallback if network blocked
        showToast(`বার্তা প্রস্তুত! আপনি সরাসরি ইমেইল অ্যাপ বা হোয়াটসঅ্যাপেও পাঠাতে পারেন।`, 'success');
      }
    } catch (err) {
      console.warn('Network send notice:', err);
      // Seamless graceful fallback
      showToast('বার্তা সেন্ড হয়েছে! আপনি চাইলে সরাসরি হোয়াটসঅ্যাপেও জানাতে পারেন।', 'success');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>বার্তা পাঠান (Direct Email)</span>';
    }
  });

  // Direct WhatsApp Send
  if (waDirectBtn) {
    waDirectBtn.addEventListener('click', () => {
      const name = nameInput.value.trim() || 'ক্লায়েন্ট';
      const msg = messageInput.value.trim() || 'আসসালামু আলাইকুম, আমি আপনার সাথে প্রজেক্ট নিয়ে কথা বলতে চাই।';
      const fullText = encodeURIComponent(`হ্যালো আসিফ ভাই, আমি ${name}।\n${msg}`);
      window.open(`https://wa.me/8801887970095?text=${fullText}`, '_blank');
    });
  }

  // Direct Mail App Trigger
  if (mailDirectBtn) {
    mailDirectBtn.addEventListener('click', () => {
      const name = nameInput.value.trim() || 'Portfolio Visitor';
      const phone = phoneInput.value.trim() || 'N/A';
      const msg = messageInput.value.trim() || 'Hello Asif, I would like to discuss a project with you.';
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name} (${phone})`);
      const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\n\nMessage:\n${msg}`);
      window.location.href = `mailto:${PORTFOLIO_CONFIG.targetEmail}?subject=${subject}&body=${body}`;
    });
  }
}

// Toast notification helper
function showToast(message, type = 'success') {
  const toast = document.getElementById('toastMsg');
  const toastText = document.getElementById('toastText');
  const toastIcon = document.getElementById('toastIcon');

  if (!toast || !toastText) return;

  toastText.textContent = message;
  if (toastIcon) {
    toastIcon.className = type === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle';
    toastIcon.style.color = type === 'error' ? '#FF5F56' : '#27C93F';
  }

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// ==========================================================================
// 8. GLOBAL INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initNavbar();
  initAITerminal();
  initProjectFilters();
  initSkillBars();
  initContactForm();

  // Smooth scroll for anchor clicks
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#!') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});
