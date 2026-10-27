/* ============================================================
   1. FOND ANIMÉ (canvas)
============================================================ */
(function(){
  const cvs = document.getElementById('bg');
  const ctx = cvs.getContext('2d');
  let W, H, particles = [];

  function resize(){
    W = cvs.width = window.innerWidth;
    H = cvs.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function heartPath(c, x, y, s){
    c.beginPath();
    c.moveTo(x, y + s * 0.3);
    c.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.3);
    c.bezierCurveTo(x - s * 0.5, y + s * 0.62, x, y + s * 0.85, x, y + s * 1.0);
    c.bezierCurveTo(x, y + s * 0.85, x + s * 0.5, y + s * 0.62, x + s * 0.5, y + s * 0.3);
    c.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.3);
    c.closePath();
  }

  function make(){
    const n = window.innerWidth < 600 ? 34 : 62;
    particles = [];
    for (let i = 0; i < n; i++){
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        s: Math.random() * 8 + 3,
        vy: -(Math.random() * 0.35 + 0.12),
        vx: (Math.random() - 0.5) * 0.22,
        a: Math.random() * 0.45 + 0.12,
        type: Math.random() > 0.62 ? 'heart' : 'dot',
        ph: Math.random() * Math.PI * 2
      });
    }
  }
  make();
  window.addEventListener('resize', make);

  let t = 0;
  function loop(){
    ctx.clearRect(0, 0, W, H);
    t += 0.01;
    for (const p of particles){
      p.y += p.vy;
      p.x += p.vx + Math.sin(t + p.ph) * 0.22;
      if (p.y < -30){ p.y = H + 30; p.x = Math.random() * W; }
      if (p.x < -30) p.x = W + 30;
      if (p.x > W + 30) p.x = -30;

      ctx.globalAlpha = p.a;
      if (p.type === 'heart'){
        ctx.fillStyle = '#c084fc';
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 14;
        heartPath(ctx, p.x, p.y, p.s);
        ctx.fill();
      } else {
        ctx.fillStyle = '#d8b4fe';
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s * 0.28, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ============================================================
   2. EMOJI BURST (utilisé partout)
============================================================ */
window.spawnHearts = function(n, cx, cy){
  const emojis = ['💜','💖','✨','💫','🖤','💗','😏','🥲','🙂','😅'];
  const baseX = cx != null ? cx : window.innerWidth / 2;
  const baseY = cy != null ? cy : window.innerHeight * 0.6;
  for (let i = 0; i < n; i++){
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'fly-heart';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = (baseX + (Math.random() - 0.5) * 220) + 'px';
      el.style.top = (baseY + (Math.random() - 0.5) * 80) + 'px';
      el.style.fontSize = (16 + Math.random() * 24) + 'px';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2800);
    }, i * 80);
  }
};

/* ============================================================
   3. BOUTON FUITARD
============================================================ */
(function(){
  const btnNo = document.getElementById('btnNo');
  const hint = document.getElementById('hint');
  let baseRect = null;
  let attempts = 0;

  const messages = [
    "Eh non 😅😅",
    "Raté ! 🙃🙃",
    "Tu es sûre de toi ? 😏😏",
    "Ce bouton n'existe pas pour toi 💜💜",
    "Essaie l'autre 🙂🙂",
    "Il est timide, celui-là 😅😅",
    "C'est impossible, ma princesse ✨✨",
    "Le destin a déjà choisi 💜💜",
    "Tu commences à fatiguer ? 😪😪",
    "Abandonne, il ne veut pas de toi 💜💜",
    "Sérieusement ? Encore ? 😑😑",
    "Le mauve te va tellement mieux 💜💜"
  ];

  const labels = [
    "Un simple mec",
    "Vraiment ?",
    "Tu insistes…",
    "Bon…",
    "Toujours pas 😌",
    "L'autre bouton est là 💜"
  ];

  function flee(e){
    if (e) e.preventDefault();
    if (!baseRect) baseRect = btnNo.getBoundingClientRect();

    const w = baseRect.width;
    const h = baseRect.height;
    const pad = 14;
    const maxX = Math.max(pad, window.innerWidth - w - pad);
    const maxY = Math.max(pad, window.innerHeight - h - pad);

    const tx = pad + Math.random() * (maxX - pad);
    const ty = pad + Math.random() * (maxY - pad);

    const dx = tx - baseRect.left;
    const dy = ty - baseRect.top;
    const rot = (Math.random() * 26 - 13).toFixed(1);
    const sc = Math.max(0.6, 1 - attempts * 0.04);

    btnNo.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${sc})`;

    attempts++;
    hint.textContent = messages[Math.min(attempts - 1, messages.length - 1)];
    hint.style.color = '#c084fc';

    const sp = btnNo.querySelector('span');
    if (sp) sp.textContent = labels[Math.min(attempts - 1, labels.length - 1)];

    if (attempts >= 6){
      hint.textContent = "Tu vois bien… ce bouton ne veut pas de toi. Clique sur l'autre 💜💜";
    }
  }

  btnNo.addEventListener('mouseenter', flee);
  btnNo.addEventListener('touchstart', flee, { passive: false });
  btnNo.addEventListener('click', flee);
})();

/* ============================================================
   4. TRANSITION VERS L'APP
============================================================ */
(function(){
  const gate = document.getElementById('gate');
  const app = document.getElementById('app');
  const btnYes = document.getElementById('btnYes');

  btnYes.addEventListener('click', function(){
    gate.classList.add('hidden');
    document.body.classList.remove('locked');
    setTimeout(() => {
      app.classList.add('show');
      window.scrollTo({ top: 0, behavior: 'instant' });
      spawnHearts(15);
      startMusic();
    }, 420);
  });
})();

/* ============================================================
   5. REVEAL AU SCROLL
============================================================ */
(function(){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ============================================================
   6. COMPTEUR
============================================================ */
(function(){
  const start = new Date('2025-05-28T00:00:00').getTime();
  const d = document.getElementById('cDays');
  const h = document.getElementById('cHours');
  const m = document.getElementById('cMin');
  const s = document.getElementById('cSec');

  function tick(){
    let diff = Math.max(0, Date.now() - start);
    d.textContent = Math.floor(diff / 86400000);
    h.textContent = String(Math.floor(diff / 3600000) % 24).padStart(2, '0');
    m.textContent = String(Math.floor(diff / 60000) % 60).padStart(2, '0');
    s.textContent = String(Math.floor(diff / 1000) % 60).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
})();

/* ============================================================
   7. QUIZ (10 questions, 5 cœurs)
============================================================ */
(function(){
  const QUIZ = [
    { q: "Quel surnom j'utilise tout le temps pour toi ?", a: ["Fofo", "Chérie", "Princesse", "Bébé"], c: 0 },
    { q: "C'est quoi la date de notre anniversaire de relation ?", a: ["28 Mai 2025", "28 Juin 2025", "14 Février 2025", "28 Mai 2024"], c: 0 },
    { q: "Tu vis dans quelle commune ?", a: ["Barumbu", "Gombe", "Limete", "Lemba"], c: 0 },
    { q: "Tu es en quelle classe ?", a: ["Terminale", "4ème année", "5ème année", "L'université"], c: 0 },
    { q: "Quelle musique te fait vibrer ?", a: ["La funk", "Le rap", "La rumba", "Le jazz"], c: 0 },
    { q: "Quel âge as-tu ?", a: ["16 ans", "15 ans", "17 ans", "18 ans"], c: 0 },
    { q: "Quelles sont tes couleurs préférées ?", a: ["Mauve et noir", "Rose et blanc", "Bleu et or", "Rouge et noir"], c: 0 },
    { q: "Quel est mon métier ?", a: ["Développeur web", "Médecin", "Ingénieur", "Avocat"], c: 0 },
    { q: "Qu'est-ce que j'utilise TOUT le temps, souvent en double ?", a: ["Les emojis", "Les points d'exclamation", "Les majuscules", "Les GIF"], c: 0 },
    { q: "Quel est ton prénom ?", a: ["Fortune", "Grâce", "Bénédicte", "Espérance"], c: 0 }
  ];

  const heartsEl = document.getElementById('hearts');
  const qIndex = document.getElementById('qIndex');
  const qText = document.getElementById('qText');
  const optionsEl = document.getElementById('options');
  const feedback = document.getElementById('feedback');

  let idx = 0, hearts = 5, locked = false, score = 0;
  const LETTERS = ['A','B','C','D'];

  function shuffled(q){
    const items = q.a.map((text, i) => ({ text, ok: i === q.c }));
    for (let i = items.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  function renderHearts(){
    heartsEl.innerHTML = '';
    for (let i = 0; i < 5; i++){
      const sp = document.createElement('span');
      sp.className = 'heart' + (i >= hearts ? ' lost' : '');
      sp.textContent = '💜';
      heartsEl.appendChild(sp);
    }
  }

  function renderQuestion(){
    locked = false;
    feedback.textContent = '';
    if (idx >= QUIZ.length){ return endQuiz(true); }

    const q = QUIZ[idx];
    qIndex.textContent = `Question ${idx + 1} / ${QUIZ.length}`;
    qText.textContent = q.q;
    optionsEl.innerHTML = '';

    shuffled(q).forEach((item, i) => {
      const b = document.createElement('button');
      b.className = 'opt';
      b.innerHTML = `<span class="bullet">${LETTERS[i]}</span><span>${item.text}</span>`;
      b.addEventListener('click', () => answer(b, item.ok));
      optionsEl.appendChild(b);
    });
  }

  function answer(btn, ok){
    if (locked) return;
    locked = true;
    Array.from(optionsEl.children).forEach(b => b.disabled = true);

    if (ok){
      btn.classList.add('correct');
      score++;
      feedback.textContent = '✅ Exactement ! Tu me connais trop bien 🥲🥲';
      feedback.style.color = '#86efac';
      const hs = heartsEl.children[hearts - 1];
      if (hs){ hs.classList.add('pop'); setTimeout(() => hs.classList.remove('pop'), 500); }
      setTimeout(() => { idx++; renderQuestion(); }, 1100);
    } else {
      btn.classList.add('wrong');
      hearts--;
      renderHearts();
      Array.from(optionsEl.children).forEach(b => {
        if (b !== btn && b.textContent.includes(QUIZ[idx].a[QUIZ[idx].c])) b.classList.add('correct');
      });
      feedback.textContent = '❌ Oups… tu perds un cœur 💔';
      feedback.style.color = '#fca5a5';
      setTimeout(() => {
        idx++;
        if (hearts <= 0) endQuiz(false);
        else renderQuestion();
      }, 1400);
    }
  }

  function endQuiz(won){
    qIndex.textContent = 'Terminé';
    qText.textContent = '';
    optionsEl.innerHTML = '';
    feedback.textContent = '';

    const box = document.createElement('div');
    box.className = 'quiz-end';

    if (won && hearts > 0){
      box.innerHTML = `
        <h3>🏆 Bravo ma Fofo !</h3>
        <p>Score : <b style="color:var(--mauve-3)">${score} / ${QUIZ.length}</b> — et il te reste <b style="color:var(--mauve-3)">${hearts}</b> cœur${hearts > 1 ? 's' : ''} 💜💜<br>
        Tu me connais par cœur… et moi je te connais encore mieux 🙂🙂</p>
        <button class="btn-reset" id="retry">Rejouer 🔄</button>`;
      spawnHearts(18);
    } else {
      box.innerHTML = `
        <h3>💔 Plus de cœurs…</h3>
        <p>Ce n'est pas grave, tu as déjà mon cœur à toi pour toujours 💜💜<br>
        Score : <b style="color:var(--mauve-3)">${score} / ${QUIZ.length}</b></p>
        <button class="btn-reset" id="retry">Réessayer 💜</button>`;
    }
    optionsEl.appendChild(box);
    document.getElementById('retry').addEventListener('click', () => {
      idx = 0; hearts = 5; score = 0;
      renderHearts();
      renderQuestion();
    });
  }

  renderHearts();
  renderQuestion();
})();

/* ============================================================
   8. SOUVENIRS (cartes à retourner)
============================================================ */
(function(){
  const cards = [
    { icon: '💜', title: 'Le premier jour', text: "Le 28 mai 2025, tout a commencé. Et je n'ai jamais voulu que ça s'arrête 🥲🥲" },
    { icon: '😅', title: 'Ton rire', text: "C'est la meilleure chose que j'entends dans ma journée. Même en audio compressé 😅😅" },
    { icon: '😏', title: 'Fofo', text: "Ce surnom, c'est le mien pour toi. Personne d'autre ne peut l'utiliser, c'est la règle 😏😏" },
    { icon: '🙃', title: 'Barumbu', text: "Quelque part dans cette commune, il y a la fille la plus incroyable du monde. Et elle est à moi (enfin… presque) 🙃🙃" },
    { icon: '🎶', title: 'La funk', text: "Dès que j'entends de la funk, je pense à toi. Et je souris tout seul, comme un idiot 🙂🙂" },
    { icon: '✨', title: 'Nous', text: "Il n'y a pas de mot pour décrire ce qu'on est. Enfin si : 'nous'. Et c'est le plus beau mot du monde 💜💜" }
  ];

  const grid = document.getElementById('flipGrid');
  cards.forEach(c => {
    const card = document.createElement('div');
    card.className = 'flip-card';
    card.innerHTML = `
      <div class="flip-inner">
        <div class="flip-face flip-front">
          <div class="flip-icon">${c.icon}</div>
          <div class="flip-title">${c.title}</div>
        </div>
        <div class="flip-face flip-back">
          <p>${c.text}</p>
        </div>
      </div>`;
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      if (card.classList.contains('flipped')){
        const rect = card.getBoundingClientRect();
        spawnHearts(3, rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    });
    grid.appendChild(card);
  });
})();

/* ============================================================
   9. GALERIE (multi-extensions supportées)
============================================================ */
(function(){
  const gallery = document.getElementById('gallery');
  const count = 6; // ← change ce chiffre si tu mets plus/moins de photos
  const icons = ['📷','💜','✨','🌸','💫','🖤'];
 const EXTS = ['jpg.jpeg', 'jpeg.jpeg', 'jpg', 'jpeg', 'png', 'webp'];

  for (let i = 1; i <= count; i++){
    const fig = document.createElement('figure');
    fig.className = 'photo';
    fig.innerHTML = `
      <div class="ph-fallback">
        <div class="ic">${icons[(i - 1) % icons.length]}</div>
        <div>Photo ${i}<br><span style="opacity:.6">photos/${i}.jpg</span></div>
      </div>`;

    const img = document.createElement('img');
    img.alt = `Souvenir ${i}`;
    img.style.display = 'none';

    // Essaie chaque extension dans l'ordre
    let extIndex = 0;
    function tryNextExt(){
      if (extIndex >= EXTS.length) return; // aucune extension n'a fonctionné
      const ext = EXTS[extIndex++];
      img.onload = () => {
        img.style.display = 'block';
        const fb = fig.querySelector('.ph-fallback');
        if (fb) fb.style.display = 'none';
      };
      img.onerror = tryNextExt;
      img.src = `photos/${i}.${ext}`;
    }
    tryNextExt();

    fig.appendChild(img);
    fig.addEventListener('click', (e) => spawnHearts(4, e.clientX, e.clientY));
    gallery.appendChild(fig);
  }
})();

/* ============================================================
   10. MUSIQUE (Web Audio API)
============================================================ */
let actx = null, master = null, delayNode = null;
let musicPlaying = false, schedTimer = null, step = 0;

const playBtn = document.getElementById('playBtn');
const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');
const waveEl = document.getElementById('wave');

(function(){
  for (let i = 0; i < 22; i++){
    const b = document.createElement('i');
    waveEl.appendChild(b);
  }
})();

const CHORDS = [
  [220.00, 261.63, 329.63, 440.00],
  [174.61, 220.00, 261.63, 349.23],
  [130.81, 196.00, 261.63, 329.63],
  [196.00, 246.94, 293.66, 392.00]
];
const PATTERN = [0, 2, 1, 3, 2, 1, 3, 2];

function initAudio(){
  if (actx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  actx = new AC();
  master = actx.createGain();
  master.gain.value = 0;
  master.connect(actx.destination);

  delayNode = actx.createDelay(1);
  delayNode.delayTime.value = 0.38;
  const fb = actx.createGain(); fb.gain.value = 0.3;
  const wet = actx.createGain(); wet.gain.value = 0.32;
  delayNode.connect(fb); fb.connect(delayNode);
  delayNode.connect(wet); wet.connect(master);
}

function tone(freq, time, dur, vol, type){
  const o = actx.createOscillator();
  const g = actx.createGain();
  o.type = type || 'sine';
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, time);
  g.gain.exponentialRampToValueAtTime(vol, time + 0.035);
  g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  o.connect(g);
  g.connect(master);
  g.connect(delayNode);
  o.start(time);
  o.stop(time + dur + 0.1);
}

function schedule(){
  const t = actx.currentTime + 0.08;
  const chordIdx = Math.floor(step / 8) % CHORDS.length;
  const ch = CHORDS[chordIdx];
  const n = ch[PATTERN[step % 8]] * 2;
  tone(n, t, 1.3, 0.05, 'sine');
  if (step % 8 === 0) tone(ch[0] / 2, t, 3.0, 0.085, 'sine');
  if (step % 8 === 4) tone(ch[0] / 2, t, 2.0, 0.05, 'triangle');
  if (step % 16 === 6) tone(ch[3] * 4, t, 0.6, 0.018, 'sine');
  step++;
  schedTimer = setTimeout(schedule, 320);
}

function startMusic(){
  initAudio();
  if (actx.state === 'suspended') actx.resume();
  if (musicPlaying) return;
  musicPlaying = true;
  master.gain.cancelScheduledValues(actx.currentTime);
  master.gain.setValueAtTime(master.gain.value, actx.currentTime);
  master.gain.linearRampToValueAtTime(0.55, actx.currentTime + 2.5);
  step = 0;
  schedule();
  setMusicUI(true);
}

function stopMusic(){
  if (!actx || !musicPlaying) return;
  musicPlaying = false;
  clearTimeout(schedTimer);
  master.gain.cancelScheduledValues(actx.currentTime);
  master.gain.setValueAtTime(master.gain.value, actx.currentTime);
  master.gain.linearRampToValueAtTime(0, actx.currentTime + 0.8);
  setMusicUI(false);
}

function setMusicUI(on){
  playBtn.classList.toggle('on', on);
  playBtn.textContent = on ? '❚❚' : '▶';
  musicToggle.classList.toggle('on', on);
  waveEl.classList.toggle('on', on);
  musicLabel.textContent = on ? 'En lecture 💜' : 'Musique';
}

playBtn.addEventListener('click', () => { musicPlaying ? stopMusic() : startMusic(); });
musicToggle.addEventListener('click', () => { musicPlaying ? stopMusic() : startMusic(); });

setInterval(() => {
  if (!waveEl.classList.contains('on')) return;
  Array.from(waveEl.children).forEach(b => {
    b.style.height = (12 + Math.random() * 88) + '%';
  });
}, 160);

/* ============================================================
   11. JEU : ATTRAPE LES CŒURS
============================================================ */
(function(){
  const container = document.getElementById('gameArea');
  const scoreEl = document.getElementById('gameScore');
  const timeEl = document.getElementById('gameTime');
  const startBtn = document.getElementById('startGame');
  const resultEl = document.getElementById('gameResult');

  let running = false;
  let hearts = [];

  function startGame(){
    if (running) return;
    running = true;
    hearts.forEach(h => h.el.remove());
    hearts = [];
    container.innerHTML = '';
    resultEl.textContent = '';
    let score = 0, timeLeft = 20;
    scoreEl.textContent = '0';
    timeEl.textContent = '20';
    startBtn.disabled = true;
    startBtn.textContent = 'En cours… 🙂🙂';

    const EMOJIS = ['💜','💖','🖤','💗','✨'];

    function spawn(){
      if (!running) return;
      const el = document.createElement('div');
      el.className = 'falling-heart';
      el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      const w = container.clientWidth;
      el.style.left = (Math.random() * (w - 50)) + 'px';
      el.style.top = '-50px';
      container.appendChild(el);

      const obj = { el, y: -50, speed: 1.6 + Math.random() * 1.8 };
      hearts.push(obj);

      el.addEventListener('click', (e) => {
        if (!running) return;
        e.stopPropagation();
        score++;
        scoreEl.textContent = score;
        el.classList.add('caught');
        setTimeout(() => el.remove(), 300);
        const i = hearts.indexOf(obj);
        if (i > -1) hearts.splice(i, 1);
        spawnHearts(2, e.clientX, e.clientY);
      });

      setTimeout(spawn, 380 + Math.random() * 420);
    }

    function animate(){
      if (!running) return;
      for (let i = hearts.length - 1; i >= 0; i--){
        const h = hearts[i];
        h.y += h.speed;
        h.el.style.top = h.y + 'px';
        if (h.y > container.clientHeight){
          h.el.remove();
          hearts.splice(i, 1);
        }
      }
      requestAnimationFrame(animate);
    }

    spawn();
    animate();

    const timer = setInterval(() => {
      timeLeft--;
      timeEl.textContent = timeLeft;
      if (timeLeft <= 0){
        running = false;
        clearInterval(timer);
        startBtn.disabled = false;
        startBtn.textContent = 'Rejouer 💜💜';
        hearts.forEach(h => h.el.remove());
        hearts = [];
        let msg = "";
        if (score >= 15) msg = `Incroyable ! ${score} cœurs 💜💜 Tu es la reine 🥲🥲`;
        else if (score >= 8) msg = `Très bien joué ! ${score} cœurs 🙂🙂`;
        else if (score >= 4) msg = `Pas mal ! ${score} cœurs 😏😏`;
        else msg = `C'est le cœur qui compte, pas le score 😅😅`;
        resultEl.textContent = msg;
        spawnHearts(10);
      }
    }, 1000);
  }

  startBtn.addEventListener('click', startGame);
})();

/* ============================================================
   12. RAISONS + CÂLINS
============================================================ */
(function(){
  const reasons = [
    "Parce que ton rire est la plus belle musique, même avant la funk 🙂🙂",
    "Parce que tu es la plus belle de tout Barumbu — et de tout Kinshasa 💜💜",
    "Parce que tu es en terminale, mais tu as déjà diplômé mon cœur 😏😏",
    "Parce que quand je t'appelle « Fofo », tout le reste s'arrête 🥲🥲",
    "Parce que le 28 mai 2025 restera la plus belle date de ma vie 💜💜",
    "Parce que tu as 16 ans et déjà plus de classe que tout le monde 🙂🙂",
    "Parce que le mauve et le noir ont été inventés pour toi ✨✨",
    "Parce que même quand tu boudes, tu es adorable 😅😅",
    "Parce que je ne peux pas imaginer une journée sans te parler 💜💜",
    "Parce que tu es Fortune, et que c'est déjà tout dire 🥲🥲",
    "Parce que ton sourire répare mes pires journées 🙂🙂",
    "Parce que je suis développeur web… et que tu es le plus beau projet de ma vie 💻💜",
    "Parce que tu n'as même pas idée de l'effet que tu me fais 😏😏",
    "Parce qu'avec toi, même le silence est agréable 💜💜",
    "Parce que je t'aime aujourd'hui plus qu'hier, et moins que demain 🥲🥲",
    "Parce que tu mérites tout l'amour du monde, et je compte bien te le donner 💜💜",
    "Parce que je pourrais passer des heures à te regarder sans rien dire 🙂🙂",
    "Parce que même tes messages de 3 heures du matin me font sourire 😅😅"
  ];

  const txt = document.getElementById('reasonText');
  const btn = document.getElementById('reasonBtn');
  let last = -1;

  btn.addEventListener('click', (e) => {
    let i;
    do { i = Math.floor(Math.random() * reasons.length); } while (i === last && reasons.length > 1);
    last = i;
    txt.classList.remove('anim');
    void txt.offsetWidth;
    txt.textContent = reasons[i];
    txt.classList.add('anim');
    spawnHearts(3, e.clientX, e.clientY);
  });

  document.getElementById('hugBtn').addEventListener('click', (e) => {
    spawnHearts(14, e.clientX, e.clientY);
    txt.textContent = "Câlin reçu 🤗🤗 … et renvoyé, multiplié par mille 💜💜";
    txt.classList.remove('anim');
    void txt.offsetWidth;
    txt.classList.add('anim');
  });

  document.getElementById('finalBtn').addEventListener('click', (e) => {
    spawnHearts(24, e.clientX, e.clientY);
  });
})();

/* ============================================================
   13. SECRET (lettres à révéler)
============================================================ */
(function(){
  const SECRET = "FORTUNE";
  const heartsEl = document.getElementById('secretHearts');
  const msgEl = document.getElementById('secretMessage');
  let revealed = 0;

  for (let i = 0; i < SECRET.length; i++){
    const h = document.createElement('div');
    h.className = 'secret-heart';
    h.textContent = '💜';
    h.addEventListener('click', (e) => {
      if (h.classList.contains('revealed')) return;
      h.classList.add('revealed');
      h.textContent = SECRET[i];
      revealed++;
      spawnHearts(3, e.clientX, e.clientY);
      if (revealed === SECRET.length){
        msgEl.textContent = "Ce prénom, c'est mon endroit préféré au monde 💜💜";
        msgEl.classList.add('done');
        spawnHearts(20);
      } else {
        msgEl.textContent = `Encore ${SECRET.length - revealed} lettre${SECRET.length - revealed > 1 ? 's' : ''} 🙂🙂`;
      }
    });
    heartsEl.appendChild(h);
  }
})();

/* ============================================================
   14. NAV DOTS ACTIVE
============================================================ */
(function(){
  const links = Array.from(document.querySelectorAll('.dots a'));
  const sections = links.map(a => document.querySelector(a.getAttribute('href')));
  window.addEventListener('scroll', () => {
    let active = 0;
    sections.forEach((s, i) => {
      if (s && s.getBoundingClientRect().top < window.innerHeight * 0.4) active = i;
    });
    links.forEach((l, i) => l.classList.toggle('active', i === active));
  }, { passive: true });
})();

/* ============================================================
   VIDÉO avec fallback intelligent
============================================================ */
(function(){
  const video = document.getElementById('myVideo');
  const fallback = document.getElementById('videoFallback');
  const fallbackText = document.getElementById('videoFallbackText');
  if (!video || !fallback) return;

  // On teste plusieurs extensions (au cas où le fichier ait un nom bizarre)
  const EXTS = ['mp4', 'mp4.mp4', 'm4v', 'webm', 'mov', 'ogg'];
  let idx = 0, loaded = false;

  function tryNext(){
    if (loaded) return;
    if (idx >= EXTS.length){
      fallbackText.innerHTML = 'La vidéo ne s\'affiche pas 😅😅<br><span style="opacity:.6;font-size:.82em">Vérifie que le fichier s\'appelle bien video.mp4</span>';
      return;
    }
    video.src = `video.${EXTS[idx++]}`;
  }

  // Quand la vidéo est prête → on cache le fallback
  video.addEventListener('loadedmetadata', () => {
    loaded = true;
    fallback.style.display = 'none';
    // Petite astuce : va à 0.1s pour afficher une image de preview
    try { video.currentTime = 0.1; } catch(e) {}
  });

  // Si ça plante → on essaie l'extension suivante
  video.addEventListener('error', () => {
    if (!loaded) tryNext();
  });

  tryNext();
})();