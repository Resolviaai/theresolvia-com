const VOICES = [
  { id: 'f06', label: 'Simone (US)', desc: 'Confident Narrator' },
  { id: 'm3', label: 'Owen (US)', desc: 'Bright Host' },
  { id: 'd03', label: 'Amy (UK)', desc: 'Crisp News' },
  { id: 'd13', label: 'Jack (UK)', desc: 'British Studio' },
  { id: 'h013f', label: 'Magnus (US)', desc: 'Deep Narrator' },
  { id: 's057b', label: 'Kenzie (US)', desc: 'Energetic' }
];

const SPEEDS = [1.0, 1.25, 1.5, 2.0];
const ICON_PLAY = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>';
const ICON_PAUSE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect></svg>';
const ICON_SPIN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" style="animation: ttsSpin 0.9s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>';

let state = {
  mode: 'idle', // idle | loading | playing | paused | fallback_playing | fallback_paused | error
  voice: 'f06',
  speedIdx: 0,
  chunks: [],
  currentIndex: 0,
  audioCtx: null,
  activeSource: null,
  worker: null,
  workerReady: false,
  token: 0,
  bufferMap: new Map(),
  pendingSynth: new Set(),
  useFallback: false
};

const els = {};

function cacheEls() {
  els.playBtn = document.getElementById('tts-play-btn');
  els.stopBtn = document.getElementById('tts-stop-btn');
  els.statusText = document.getElementById('tts-status-text');
  els.metaText = document.getElementById('tts-meta-text');
  els.progressBar = document.getElementById('tts-progress-fill');
  els.speedBtn = document.getElementById('tts-speed-btn');
  els.voiceBtn = document.getElementById('tts-voice-btn');
  els.voiceLabel = document.getElementById('tts-voice-label');
  els.voiceMenu = document.getElementById('tts-voice-menu');
}

function getSpeed() {
  return SPEEDS[state.speedIdx];
}

function extractArticleChunks() {
  const titleEl = document.getElementById('dyn-title');
  const bodyEl = document.getElementById('dyn-article-body');
  const parts = [];

  if (titleEl && titleEl.textContent.trim()) {
    parts.push(titleEl.textContent.trim() + '.');
  }

  if (!bodyEl) return parts;

  const clone = bodyEl.cloneNode(true);
  clone.querySelectorAll('script, style, svg, .katex, .katex-mathml, img, iframe').forEach((n) => n.remove());
  clone.querySelectorAll('table').forEach((tbl) => {
    const p = document.createElement('p');
    p.textContent = 'See the comparison table on screen.';
    tbl.replaceWith(p);
  });

  const blocks = clone.querySelectorAll('h1, h2, h3, h4, p, li, blockquote');
  const rawSentences = [];

  blocks.forEach((node) => {
    // Skip nested blocks (e.g. p inside blockquote or li) to avoid duplicates
    if (node.parentElement && node.parentElement.closest('h1, h2, h3, h4, p, li, blockquote')) return;
    let txt = (node.textContent || '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\$(\d[\d,]*)/g, '$1 dollars')
      .replace(/\s+/g, ' ')
      .trim();
    if (!txt) return;
    if (!/[.!?]$/.test(txt)) txt += '.';

    // Split long paragraphs cleanly by sentence boundaries (~220 char soft limit)
    const sents = txt.match(/[^.!?]+[.!?]+/g) || [txt];
    let buf = '';
    for (const s of sents) {
      if ((buf + ' ' + s).trim().length > 220 && buf) {
        rawSentences.push(buf.trim());
        buf = s;
      } else {
        buf = (buf + ' ' + s).trim();
      }
    }
    if (buf) rawSentences.push(buf.trim());
  });

  return parts.concat(rawSentences).filter((s) => s.length > 2);
}

function updateUI() {
  if (!els.playBtn) return;
  const vMeta = VOICES.find((v) => v.id === state.voice) || VOICES[0];
  if (els.voiceLabel) els.voiceLabel.textContent = vMeta.label;
  if (els.speedBtn) els.speedBtn.textContent = getSpeed().toFixed(2).replace(/\.00$/, '.0') + 'x';

  if (state.mode === 'loading') {
    els.playBtn.innerHTML = ICON_SPIN;
    els.playBtn.setAttribute('aria-label', 'Loading local voice model');
    if (els.stopBtn) els.stopBtn.style.display = 'inline-flex';
  } else if (state.mode === 'playing' || state.mode === 'fallback_playing') {
    els.playBtn.innerHTML = ICON_PAUSE;
    els.playBtn.setAttribute('aria-label', 'Pause audio');
    if (els.stopBtn) els.stopBtn.style.display = 'inline-flex';
    const pct = state.chunks.length > 0 ? Math.round(((state.currentIndex + 1) / state.chunks.length) * 100) : 0;
    if (els.progressBar) els.progressBar.style.width = pct + '%';
    if (els.statusText) {
      els.statusText.textContent = state.useFallback
        ? `Playing (${state.currentIndex + 1}/${state.chunks.length}) · Device Voice`
        : `Playing (${state.currentIndex + 1}/${state.chunks.length}) · ${vMeta.label}`;
    }
  } else if (state.mode === 'paused' || state.mode === 'fallback_paused') {
    els.playBtn.innerHTML = ICON_PLAY;
    els.playBtn.setAttribute('aria-label', 'Resume audio');
    if (els.stopBtn) els.stopBtn.style.display = 'inline-flex';
    if (els.statusText) els.statusText.textContent = `Paused (${state.currentIndex + 1}/${state.chunks.length})`;
  } else {
    els.playBtn.innerHTML = ICON_PLAY;
    els.playBtn.setAttribute('aria-label', 'Listen to article');
    if (els.stopBtn) els.stopBtn.style.display = 'none';
    if (els.progressBar) els.progressBar.style.width = '0%';
    if (els.statusText) els.statusText.textContent = 'Listen to this article';
    if (els.metaText) els.metaText.textContent = 'Runs locally on your device · No server upload';
  }
}

function stopAllAudio() {
  state.token += 1;
  if (state.activeSource) {
    try {
      state.activeSource.onended = null;
      state.activeSource.stop();
    } catch (e) {}
    state.activeSource = null;
  }
  if (state.audioCtx && state.audioCtx.state === 'suspended') {
    state.audioCtx.resume().catch(() => {});
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }
  state.bufferMap.clear();
  state.pendingSynth.clear();
}

function scheduleLookahead(sessionToken) {
  if (state.useFallback || !state.worker) return;
  const LOOKAHEAD = 2;
  for (let i = state.currentIndex; i < Math.min(state.chunks.length, state.currentIndex + LOOKAHEAD + 1); i++) {
    if (!state.bufferMap.has(i) && !state.pendingSynth.has(i)) {
      state.pendingSynth.add(i);
      state.worker.postMessage({
        type: 'synthesize',
        token: sessionToken,
        index: i,
        text: state.chunks[i],
        voice: state.voice
      });
    }
  }
}

function playNextNeuralChunk(sessionToken) {
  if (sessionToken !== state.token || state.mode !== 'playing') return;

  if (state.currentIndex >= state.chunks.length) {
    stopAllAudio();
    state.mode = 'idle';
    state.currentIndex = 0;
    updateUI();
    return;
  }

  scheduleLookahead(sessionToken);

  const item = state.bufferMap.get(state.currentIndex);
  if (!item) {
    if (els.metaText) els.metaText.textContent = 'Preparing next section...';
    return;
  }

  if (els.metaText) els.metaText.textContent = 'On-device AI voice · Cached locally';
  updateUI();

  const ctx = state.audioCtx;
  const audioBuffer = ctx.createBuffer(1, item.audio.length, item.sampleRate);
  audioBuffer.copyToChannel(item.audio, 0);

  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.playbackRate.value = getSpeed();
  source.connect(ctx.destination);

  const playedIdx = state.currentIndex;
  source.onended = () => {
    if (sessionToken !== state.token) return;
    state.activeSource = null;
    if (state.mode !== 'playing') return;
    state.bufferMap.delete(playedIdx);
    state.currentIndex += 1;
    playNextNeuralChunk(sessionToken);
  };

  state.activeSource = source;
  source.start(0);
}

function startFallbackSpeech() {
  if (!window.speechSynthesis) {
    state.mode = 'idle';
    if (els.metaText) els.metaText.textContent = 'Audio playback is unsupported in this browser.';
    updateUI();
    return;
  }

  state.useFallback = true;
  state.mode = 'fallback_playing';
  const sessionToken = state.token;

  function speakChunk(idx) {
    if (sessionToken !== state.token || state.mode !== 'fallback_playing') return;
    if (idx >= state.chunks.length) {
      stopAllAudio();
      state.mode = 'idle';
      state.currentIndex = 0;
      updateUI();
      return;
    }

    state.currentIndex = idx;
    updateUI();
    if (els.metaText) els.metaText.textContent = 'Native device voice · 0 MB download';

    const utter = new SpeechSynthesisUtterance(state.chunks[idx]);
    utter.lang = 'en-US';
    utter.rate = getSpeed();
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find((v) => /en[-_]US|en[-_]GB/i.test(v.lang) && !v.localService) || voices.find((v) => /en/i.test(v.lang));
    if (pref) utter.voice = pref;

    utter.onend = () => {
      if (sessionToken !== state.token || state.mode !== 'fallback_playing') return;
      speakChunk(idx + 1);
    };
    utter.onerror = () => {
      if (sessionToken !== state.token) return;
      speakChunk(idx + 1);
    };
    window.speechSynthesis.speak(utter);
  }

  speakChunk(state.currentIndex);
}

function initWorkerAndPlay(audioCtx) {
  state.audioCtx = audioCtx;
  state.chunks = extractArticleChunks();
  if (state.chunks.length === 0) return;

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const devMem = navigator.deviceMemory || 8;
  // Very constrained phones (<= 2 GB RAM) or no Worker/WASM support fall back cleanly to OS speech
  if (typeof Worker === 'undefined' || typeof WebAssembly === 'undefined' || (isMobile && devMem <= 2)) {
    startFallbackSpeech();
    return;
  }

  state.mode = 'loading';
  updateUI();
  const sessionToken = state.token;

  if (!state.worker) {
    state.worker = new Worker('/assets/js/blog-tts-worker.js', { type: 'module' });
    state.worker.onmessage = (e) => {
      const msg = e.data || {};
      if (msg.type === 'progress') {
        if (state.mode === 'loading') {
          if (els.progressBar) els.progressBar.style.width = msg.pct + '%';
          if (els.statusText) els.statusText.textContent = `Downloading AI voice (${msg.pct}%)`;
          if (els.metaText) els.metaText.textContent = 'Cached on your device after first load';
        }
      } else if (msg.type === 'status') {
        if (state.mode === 'loading' && els.statusText) {
          els.statusText.textContent = msg.message;
        }
      } else if (msg.type === 'ready') {
        state.workerReady = true;
        if (state.mode === 'loading') {
          state.mode = 'playing';
          updateUI();
          playNextNeuralChunk(state.token);
        }
      } else if (msg.type === 'audio') {
        if (msg.token !== state.token) return;
        state.pendingSynth.delete(msg.index);
        state.bufferMap.set(msg.index, { audio: msg.audio, sampleRate: msg.sampleRate });
        if (msg.index === state.currentIndex && !state.activeSource && state.mode === 'playing') {
          playNextNeuralChunk(state.token);
        }
      } else if (msg.type === 'error') {
        console.warn('Local AI voice fallback triggered:', msg.message);
        if (state.mode === 'loading' || msg.index === state.currentIndex) {
          stopAllAudio();
          state.token += 1;
          startFallbackSpeech();
        }
      }
    };
    state.worker.onerror = (err) => {
      console.warn('TTS worker error, using device voice fallback:', err);
      stopAllAudio();
      state.token += 1;
      startFallbackSpeech();
    };
  }

  if (state.workerReady) {
    state.mode = 'playing';
    updateUI();
    playNextNeuralChunk(sessionToken);
  } else {
    state.worker.postMessage({
      type: 'init',
      voice: state.voice,
      lowEnd: isMobile || devMem <= 4
    });
  }
}

export function handlePlayClick(audioCtx) {
  cacheEls();
  if (state.mode === 'idle' || state.mode === 'error') {
    state.currentIndex = 0;
    state.useFallback = false;
    initWorkerAndPlay(audioCtx);
  } else if (state.mode === 'playing') {
    state.mode = 'paused';
    if (state.audioCtx && state.audioCtx.state === 'running') {
      state.audioCtx.suspend().catch(() => {});
    }
    updateUI();
  } else if (state.mode === 'paused') {
    state.mode = 'playing';
    if (state.audioCtx && state.audioCtx.state === 'suspended') {
      state.audioCtx.resume().catch(() => {});
    }
    updateUI();
    if (!state.activeSource) playNextNeuralChunk(state.token);
  } else if (state.mode === 'fallback_playing') {
    state.mode = 'fallback_paused';
    if (window.speechSynthesis) window.speechSynthesis.pause();
    updateUI();
  } else if (state.mode === 'fallback_paused') {
    state.mode = 'fallback_playing';
    if (window.speechSynthesis) window.speechSynthesis.resume();
    updateUI();
  }
}

export function bindPlayerControls() {
  cacheEls();

  if (els.stopBtn) {
    els.stopBtn.addEventListener('click', () => {
      stopAllAudio();
      state.mode = 'idle';
      state.currentIndex = 0;
      updateUI();
    });
  }

  if (els.speedBtn) {
    els.speedBtn.addEventListener('click', () => {
      state.speedIdx = (state.speedIdx + 1) % SPEEDS.length;
      if (state.activeSource) {
        state.activeSource.playbackRate.value = getSpeed();
      } else if (state.mode === 'fallback_playing') {
        stopAllAudio();
        state.token += 1;
        startFallbackSpeech();
      }
      updateUI();
    });
  }

  if (els.voiceBtn && els.voiceMenu) {
    els.voiceMenu.innerHTML = VOICES.map((v) => `
      <button type="button" data-voice-id="${v.id}" style="width:100%; padding:8px 12px; border:0; border-radius:8px; background:${v.id === state.voice ? 'rgba(47,134,247,0.18)' : 'transparent'}; color:${v.id === state.voice ? '#ffffff' : 'rgba(238,241,248,0.78)'}; font-size:12.5px; text-align:left; cursor:pointer; display:flex; justify-content:space-between; align-items:center; gap:8px;">
        <span style="font-weight:${v.id === state.voice ? '600' : '500'};">${v.label}</span>
        <span style="font-size:11px; color:rgba(238,241,248,0.45);">${v.desc}</span>
      </button>
    `).join('');

    els.voiceBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = els.voiceMenu.style.display === 'block';
      els.voiceMenu.style.display = open ? 'none' : 'block';
    });

    els.voiceMenu.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-voice-id]');
      if (!btn) return;
      const newVoice = btn.getAttribute('data-voice-id');
      state.voice = newVoice;
      els.voiceMenu.style.display = 'none';
      bindMenuActiveStyles();

      if (state.mode === 'playing' || state.mode === 'paused') {
        stopAllAudio();
        state.token += 1;
        state.mode = 'playing';
        updateUI();
        playNextNeuralChunk(state.token);
      } else {
        updateUI();
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#tts-voice-wrapper')) {
        els.voiceMenu.style.display = 'none';
      }
    });
  }

  window.addEventListener('pagehide', () => stopAllAudio());
}

function bindMenuActiveStyles() {
  if (!els.voiceMenu) return;
  els.voiceMenu.querySelectorAll('button[data-voice-id]').forEach((btn) => {
    const active = btn.getAttribute('data-voice-id') === state.voice;
    btn.style.background = active ? 'rgba(47,134,247,0.18)' : 'transparent';
    btn.style.color = active ? '#ffffff' : 'rgba(238,241,248,0.78)';
  });
}
