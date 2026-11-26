const VOICES = [
  { id: 'f06', short: 'Simone', label: 'Simone (US)', desc: 'Confident Narrator' },
  { id: 'm3', short: 'Owen', label: 'Owen (US)', desc: 'Bright Host' },
  { id: 'd03', short: 'Amy', label: 'Amy (UK)', desc: 'Crisp News' },
  { id: 'd13', short: 'Jack', label: 'Jack (UK)', desc: 'British Studio' },
  { id: 'h013f', short: 'Magnus', label: 'Magnus (US)', desc: 'Deep Narrator' },
  { id: 's057b', short: 'Kenzie', label: 'Kenzie (US)', desc: 'Energetic' }
];

const RATES = [1, 1.25, 1.5, 2];

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const whole = Math.floor(seconds);
  const hrs = Math.floor(whole / 3600);
  const mins = Math.floor((whole % 3600) / 60);
  const secs = whole % 60;
  if (hrs > 0) {
    return hrs + ':' + String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  }
  return mins + ':' + String(secs).padStart(2, '0');
}

function encodeWav(floatSamples, sampleRate) {
  const numSamples = floatSamples.length;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);
  const writeStr = (offset, s) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, numSamples * 2, true);
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const clamped = Math.max(-1, Math.min(1, floatSamples[i]));
    view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF, true);
    offset += 2;
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

const state = {
  mode: 'idle', // idle | loading | playing | paused | fallback_playing | fallback_paused
  voice: 'f06',
  rateIdx: 0,
  chunks: [],
  chunkDurations: [],
  chunkStarts: [],
  totalDuration: 0,
  currentIndex: 0,
  chunkStartedAtCtx: 0,
  chunkOffsetSec: 0,
  scrubRatio: null,
  audioCtx: null,
  activeSource: null,
  worker: null,
  workerReady: false,
  token: 0,
  bufferMap: new Map(),
  pendingSynth: new Set(),
  useFallback: false,
  rafId: 0,
  downloadingWav: false
};

const els = {};

function cacheEls() {
  els.root = document.getElementById('blog-audio-player');
  els.playBtn = document.getElementById('tts-play-btn');
  els.icoPlay = document.getElementById('tts-ico-play');
  els.icoPause = document.getElementById('tts-ico-pause');
  els.icoSpin = document.getElementById('tts-ico-spin');
  els.elapsed = document.getElementById('tts-elapsed');
  els.remaining = document.getElementById('tts-remaining');
  els.scrubber = document.getElementById('tts-scrubber');
  els.waveTrack = document.getElementById('tts-wave-track');
  els.thumb = document.getElementById('tts-scrubber-thumb');
  els.speedBtn = document.getElementById('tts-speed-btn');
  els.voiceBtn = document.getElementById('tts-voice-btn');
  els.voiceLabel = document.getElementById('tts-voice-label');
  els.voiceMenu = document.getElementById('tts-voice-menu');
  els.downloadBtn = document.getElementById('tts-download-btn');
  els.statusText = document.getElementById('tts-status-text');
  els.metaText = document.getElementById('tts-meta-text');
}

function getRate() {
  return RATES[state.rateIdx];
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
  const out = [];

  blocks.forEach((node) => {
    if (node.parentElement && node.parentElement.closest('h1, h2, h3, h4, p, li, blockquote')) return;
    let txt = (node.textContent || '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\$(\d[\d,]*)/g, '$1 dollars')
      .replace(/\s+/g, ' ')
      .trim();
    if (!txt) return;
    if (!/[.!?]$/.test(txt)) txt += '.';

    const sents = txt.match(/[^.!?]+[.!?]+/g) || [txt];
    let buf = '';
    for (const s of sents) {
      if ((buf + ' ' + s).trim().length > 220 && buf) {
        out.push(buf.trim());
        buf = s;
      } else {
        buf = (buf + ' ' + s).trim();
      }
    }
    if (buf) out.push(buf.trim());
  });

  return parts.concat(out).filter((s) => s.length > 2);
}

function ensureChunksComputed() {
  if (state.chunks.length > 0) return;
  state.chunks = extractArticleChunks();
  let acc = 0;
  state.chunkDurations = [];
  state.chunkStarts = [];
  for (const c of state.chunks) {
    const est = Math.max(1.2, c.length / 14.5);
    state.chunkStarts.push(acc);
    state.chunkDurations.push(est);
    acc += est;
  }
  state.totalDuration = acc || 1;
}

function recomputeTimelineOffsets() {
  let acc = 0;
  for (let i = 0; i < state.chunks.length; i++) {
    state.chunkStarts[i] = acc;
    acc += state.chunkDurations[i] || 1.2;
  }
  state.totalDuration = acc || 1;
}

function getLiveElapsedSeconds() {
  if (state.scrubRatio !== null) {
    return state.scrubRatio * state.totalDuration;
  }
  if (state.chunks.length === 0) return 0;
  const baseStart = state.chunkStarts[state.currentIndex] || 0;
  if (state.mode === 'playing' && state.activeSource && state.audioCtx) {
    const inChunk = Math.max(0, (state.audioCtx.currentTime - state.chunkStartedAtCtx) * getRate());
    const maxChunkDur = state.chunkDurations[state.currentIndex] || 0;
    return Math.min(state.totalDuration, baseStart + state.chunkOffsetSec + Math.min(inChunk, maxChunkDur));
  }
  return Math.min(state.totalDuration, baseStart + state.chunkOffsetSec);
}

function updateTimeDisplay() {
  if (!els.elapsed || !els.remaining) return;
  const elapsed = getLiveElapsedSeconds();
  const total = state.totalDuration || 1;
  const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));

  els.elapsed.textContent = formatTime(elapsed);
  els.remaining.textContent = '-' + formatTime(Math.max(0, total - elapsed));

  if (els.waveTrack) els.waveTrack.style.setProperty('--played', pct.toFixed(2) + '%');
  if (els.thumb) els.thumb.style.left = pct.toFixed(2) + '%';
  if (els.scrubber) els.scrubber.setAttribute('aria-valuenow', String(Math.round(pct)));
}

function startTimeLoop() {
  cancelAnimationFrame(state.rafId);
  const tick = () => {
    updateTimeDisplay();
    if (state.mode === 'playing' || state.mode === 'fallback_playing') {
      state.rafId = requestAnimationFrame(tick);
    }
  };
  state.rafId = requestAnimationFrame(tick);
}

function setIconState(which) {
  if (!els.icoPlay || !els.icoPause || !els.icoSpin) return;
  els.icoPlay.setAttribute('data-shown', which === 'play' ? 'true' : 'false');
  els.icoPause.setAttribute('data-shown', which === 'pause' ? 'true' : 'false');
  els.icoSpin.setAttribute('data-shown', which === 'spin' ? 'true' : 'false');
}

function updateMediaSession() {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
  const titleEl = document.getElementById('dyn-title');
  const title = titleEl ? titleEl.textContent.trim() : 'Resolvia Editorial';
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: 'Resolvia Studio',
      artwork: [{ src: '/brand/resolvia_r_logo.png', sizes: '192x192', type: 'image/png' }]
    });
    navigator.mediaSession.setActionHandler('play', () => {
      if (state.mode === 'paused' || state.mode === 'idle') handlePlayClick(state.audioCtx);
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      if (state.mode === 'playing' || state.mode === 'fallback_playing') handlePlayClick(state.audioCtx);
    });
    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      const targetSec = Math.max(0, getLiveElapsedSeconds() - (details.seekOffset || 10));
      seekToRatio(targetSec / (state.totalDuration || 1), state.audioCtx);
    });
    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      const targetSec = Math.min(state.totalDuration, getLiveElapsedSeconds() + (details.seekOffset || 10));
      seekToRatio(targetSec / (state.totalDuration || 1), state.audioCtx);
    });
    if (state.totalDuration > 0 && Number.isFinite(state.totalDuration)) {
      navigator.mediaSession.setPositionState({
        duration: state.totalDuration,
        playbackRate: getRate(),
        position: Math.min(getLiveElapsedSeconds(), state.totalDuration)
      });
    }
  } catch (e) {}
}

function updateUI() {
  cacheEls();
  if (!els.playBtn) return;

  const vMeta = VOICES.find((v) => v.id === state.voice) || VOICES[0];
  if (els.voiceLabel) els.voiceLabel.textContent = vMeta.short;
  if (els.speedBtn) {
    const r = getRate();
    els.speedBtn.textContent = r + '×';
    els.speedBtn.setAttribute('aria-label', 'Playback speed ' + r + 'x');
  }

  if (state.mode === 'loading') {
    setIconState('spin');
    els.playBtn.setAttribute('aria-label', 'Loading voice engine');
  } else if (state.mode === 'playing' || state.mode === 'fallback_playing') {
    setIconState('pause');
    els.playBtn.setAttribute('aria-label', 'Pause');
    if (els.metaText) {
      els.metaText.textContent = state.useFallback ? 'Device Voice' : vMeta.short + ' · On-device AI';
    }
    if (els.statusText) {
      els.statusText.textContent = 'Section ' + (state.currentIndex + 1) + ' of ' + state.chunks.length + ' · Cached locally';
    }
    startTimeLoop();
  } else if (state.mode === 'paused' || state.mode === 'fallback_paused') {
    setIconState('play');
    els.playBtn.setAttribute('aria-label', 'Play');
    cancelAnimationFrame(state.rafId);
    if (els.statusText) els.statusText.textContent = 'Paused · Section ' + (state.currentIndex + 1) + ' of ' + state.chunks.length;
  } else {
    setIconState('play');
    els.playBtn.setAttribute('aria-label', 'Play');
    cancelAnimationFrame(state.rafId);
    if (els.statusText) els.statusText.textContent = 'Listen on your device · Zero server upload';
    if (els.metaText) els.metaText.textContent = vMeta.short + ' · Ready';
  }
  updateTimeDisplay();
}

function stopAudioSourceOnly() {
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
}

function stopAllAudio() {
  stopAudioSourceOnly();
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
    stopAudioSourceOnly();
    state.mode = 'idle';
    state.currentIndex = 0;
    state.chunkOffsetSec = 0;
    updateUI();
    return;
  }

  scheduleLookahead(sessionToken);

  const item = state.bufferMap.get(state.currentIndex);
  if (!item) {
    if (els.statusText) els.statusText.textContent = 'Synthesizing section ' + (state.currentIndex + 1) + '...';
    return;
  }

  const realDur = item.audio.length / item.sampleRate;
  if (Math.abs((state.chunkDurations[state.currentIndex] || 0) - realDur) > 0.1) {
    state.chunkDurations[state.currentIndex] = realDur;
    recomputeTimelineOffsets();
  }

  const ctx = state.audioCtx;
  const audioBuffer = ctx.createBuffer(1, item.audio.length, item.sampleRate);
  audioBuffer.copyToChannel(item.audio, 0);

  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.playbackRate.value = getRate();
  source.connect(ctx.destination);

  const playedIdx = state.currentIndex;
  const offset = Math.min(state.chunkOffsetSec || 0, Math.max(0, realDur - 0.05));
  state.chunkStartedAtCtx = ctx.currentTime;

  source.onended = () => {
    if (sessionToken !== state.token) return;
    state.activeSource = null;
    if (state.mode !== 'playing') return;
    state.currentIndex += 1;
    state.chunkOffsetSec = 0;
    playNextNeuralChunk(state.token);
  };

  state.activeSource = source;
  source.start(0, offset);
  updateUI();
  updateMediaSession();
}

function startFallbackSpeech() {
  if (!window.speechSynthesis) {
    state.mode = 'idle';
    if (els.statusText) els.statusText.textContent = 'Audio playback unavailable in this browser.';
    updateUI();
    return;
  }

  state.useFallback = true;
  state.mode = 'fallback_playing';
  const sessionToken = state.token;

  function speakChunk(idx) {
    if (sessionToken !== state.token || state.mode !== 'fallback_playing') return;
    if (idx >= state.chunks.length) {
      stopAudioSourceOnly();
      state.mode = 'idle';
      state.currentIndex = 0;
      updateUI();
      return;
    }

    state.currentIndex = idx;
    state.chunkOffsetSec = 0;
    updateUI();

    const utter = new SpeechSynthesisUtterance(state.chunks[idx]);
    utter.lang = 'en-US';
    utter.rate = getRate();
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

function ensureWorker(audioCtx, onReadyCallback) {
  if (audioCtx) state.audioCtx = audioCtx;
  ensureChunksComputed();
  if (state.chunks.length === 0) return;

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const devMem = navigator.deviceMemory || 8;
  if (typeof Worker === 'undefined' || typeof WebAssembly === 'undefined' || (isMobile && devMem <= 2)) {
    startFallbackSpeech();
    return;
  }

  if (state.workerReady) {
    if (onReadyCallback) onReadyCallback();
    return;
  }

  state.mode = 'loading';
  updateUI();

  if (!state.worker) {
    state.worker = new Worker('/assets/js/blog-tts-worker.js?v=3', { type: 'module' });
    state.worker.onmessage = (e) => {
      const msg = e.data || {};
      if (msg.type === 'progress') {
        if (state.mode === 'loading' && els.statusText) {
          els.statusText.textContent = 'Downloading AI voice (' + msg.pct + '%) · Cached once on device';
        }
      } else if (msg.type === 'status') {
        if (state.mode === 'loading' && els.statusText) {
          els.statusText.textContent = msg.message;
        }
      } else if (msg.type === 'ready') {
        state.workerReady = true;
        if (onReadyCallback) {
          onReadyCallback();
          onReadyCallback = null;
        } else if (state.mode === 'loading') {
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
    state.worker.onerror = () => {
      stopAllAudio();
      state.token += 1;
      startFallbackSpeech();
    };
  }

  state.worker.postMessage({
    type: 'init',
    voice: state.voice,
    lowEnd: isMobile || devMem <= 4
  });
}

export function handlePlayClick(audioCtx) {
  cacheEls();
  if (state.mode === 'idle') {
    state.useFallback = false;
    ensureWorker(audioCtx, () => {
      state.mode = 'playing';
      updateUI();
      playNextNeuralChunk(state.token);
    });
  } else if (state.mode === 'playing') {
    if (state.audioCtx && state.activeSource) {
      state.chunkOffsetSec += (state.audioCtx.currentTime - state.chunkStartedAtCtx) * getRate();
    }
    stopAudioSourceOnly();
    state.mode = 'paused';
    updateUI();
    updateMediaSession();
  } else if (state.mode === 'paused') {
    state.mode = 'playing';
    updateUI();
    playNextNeuralChunk(state.token);
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

export function seekToRatio(ratio, audioCtx) {
  cacheEls();
  if (audioCtx) state.audioCtx = audioCtx;
  ensureChunksComputed();
  const clamped = Math.min(0.999, Math.max(0, ratio));
  const targetSec = clamped * state.totalDuration;

  let chosenIdx = 0;
  let innerOffset = 0;
  for (let i = 0; i < state.chunks.length; i++) {
    const start = state.chunkStarts[i];
    const dur = state.chunkDurations[i];
    if (targetSec >= start && targetSec < start + dur) {
      chosenIdx = i;
      innerOffset = Math.max(0, targetSec - start);
      break;
    }
    chosenIdx = i;
  }

  const wasPlaying = state.mode === 'playing' || state.mode === 'fallback_playing' || state.mode === 'idle';
  stopAudioSourceOnly();
  state.currentIndex = chosenIdx;
  state.chunkOffsetSec = state.bufferMap.has(chosenIdx) ? innerOffset : 0;

  if (state.useFallback) {
    if (wasPlaying) startFallbackSpeech();
    else updateUI();
    return;
  }

  if (wasPlaying) {
    ensureWorker(state.audioCtx, () => {
      state.mode = 'playing';
      updateUI();
      playNextNeuralChunk(state.token);
    });
  } else {
    updateUI();
  }
}

export function cycleSpeed() {
  state.rateIdx = (state.rateIdx + 1) % RATES.length;
  if (state.activeSource) {
    state.activeSource.playbackRate.value = getRate();
  } else if (state.mode === 'fallback_playing') {
    stopAudioSourceOnly();
    startFallbackSpeech();
  }
  updateUI();
  updateMediaSession();
}

export async function handleDownload(audioCtx) {
  cacheEls();
  if (state.downloadingWav) return;
  if (state.useFallback) {
    if (els.statusText) els.statusText.textContent = 'WAV export requires on-device AI voice mode.';
    return;
  }

  state.downloadingWav = true;
  if (audioCtx) state.audioCtx = audioCtx;
  ensureChunksComputed();
  if (els.statusText) els.statusText.textContent = 'Preparing downloadable WAV audio...';

  ensureWorker(state.audioCtx, async () => {
    try {
      const sampleRate = 24000;
      const missingIndices = [];
      for (let i = 0; i < state.chunks.length; i++) {
        if (!state.bufferMap.has(i)) missingIndices.push(i);
      }

      if (missingIndices.length > 0 && state.worker) {
        const exportToken = state.token + 1000;
        let completed = 0;
        await new Promise((resolve, reject) => {
          const prevHandler = state.worker.onmessage;
          state.worker.onmessage = (e) => {
            const msg = e.data || {};
            if (msg.token === exportToken && msg.type === 'audio') {
              state.bufferMap.set(msg.index, { audio: msg.audio, sampleRate: msg.sampleRate });
              completed += 1;
              if (els.statusText) {
                els.statusText.textContent = 'Rendering WAV (' + completed + '/' + missingIndices.length + ')...';
              }
              if (completed >= missingIndices.length) {
                state.worker.onmessage = prevHandler;
                resolve();
              }
            } else if (msg.token === exportToken && msg.type === 'error') {
              state.worker.onmessage = prevHandler;
              reject(new Error(msg.message));
            } else if (prevHandler) {
              prevHandler(e);
            }
          };

          for (const idx of missingIndices) {
            state.worker.postMessage({
              type: 'synthesize',
              token: exportToken,
              index: idx,
              text: state.chunks[idx],
              voice: state.voice
            });
          }
        });
      }

      let totalLen = 0;
      const gapSamples = Math.floor(0.12 * sampleRate);
      const parts = [];
      for (let i = 0; i < state.chunks.length; i++) {
        const item = state.bufferMap.get(i);
        if (item && item.audio) {
          parts.push(item.audio);
          totalLen += item.audio.length + gapSamples;
        }
      }

      const merged = new Float32Array(totalLen);
      let pos = 0;
      for (const p of parts) {
        merged.set(p, pos);
        pos += p.length + gapSamples;
      }

      const blob = encodeWav(merged, sampleRate);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const slug = window.location.pathname.replace(/^\/|\/$/g, '').split('/').pop() || 'resolvia-article';
      a.href = url;
      a.download = slug + '.wav';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      if (els.statusText) els.statusText.textContent = 'WAV audio downloaded.';
    } catch (err) {
      if (els.statusText) els.statusText.textContent = 'WAV export unavailable on this device.';
    } finally {
      state.downloadingWav = false;
      updateUI();
    }
  });
}

let boundOnce = false;
export function bindPlayerControls() {
  if (boundOnce) return;
  boundOnce = true;
  cacheEls();
  ensureChunksComputed();
  updateUI();

  if (els.speedBtn) {
    els.speedBtn.addEventListener('click', cycleSpeed);
  }

  if (els.downloadBtn) {
    els.downloadBtn.addEventListener('click', () => handleDownload(state.audioCtx));
  }

  if (els.scrubber) {
    let dragging = false;
    const ratioFromEvent = (clientX) => {
      const rect = els.scrubber.getBoundingClientRect();
      return Math.min(1, Math.max(0, (clientX - rect.left) / (rect.width || 1)));
    };
    els.scrubber.addEventListener('pointerdown', (e) => {
      dragging = true;
      els.scrubber.classList.add('is-dragging');
      els.scrubber.setPointerCapture(e.pointerId);
      state.scrubRatio = ratioFromEvent(e.clientX);
      updateTimeDisplay();
    });
    els.scrubber.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      state.scrubRatio = ratioFromEvent(e.clientX);
      updateTimeDisplay();
    });
    els.scrubber.addEventListener('pointerup', (e) => {
      if (!dragging) return;
      dragging = false;
      els.scrubber.classList.remove('is-dragging');
      const r = ratioFromEvent(e.clientX);
      state.scrubRatio = null;
      seekToRatio(r, state.audioCtx);
    });
    els.scrubber.addEventListener('keydown', (e) => {
      let delta = 0;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -5;
      else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = 5;
      else if (e.key === 'PageDown') delta = -15;
      else if (e.key === 'PageUp') delta = 15;
      if (delta !== 0) {
        e.preventDefault();
        const targetSec = Math.min(state.totalDuration, Math.max(0, getLiveElapsedSeconds() + delta));
        seekToRatio(targetSec / (state.totalDuration || 1), state.audioCtx);
      }
    });
  }

  if (els.root) {
    els.root.addEventListener('keydown', (e) => {
      if (e.key === ' ' && !e.target.closest('button, a')) {
        e.preventDefault();
        handlePlayClick(state.audioCtx);
      }
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
      state.voice = btn.getAttribute('data-voice-id');
      els.voiceMenu.style.display = 'none';
      els.voiceMenu.querySelectorAll('button[data-voice-id]').forEach((b) => {
        const active = b.getAttribute('data-voice-id') === state.voice;
        b.style.background = active ? 'rgba(47,134,247,0.18)' : 'transparent';
        b.style.color = active ? '#ffffff' : 'rgba(238,241,248,0.78)';
      });

      const wasActive = state.mode === 'playing' || state.mode === 'paused';
      stopAllAudio();
      state.chunkOffsetSec = 0;
      if (wasActive) {
        state.mode = 'playing';
        updateUI();
        if (els.statusText) {
          const vShort = (VOICES.find((v) => v.id === state.voice) || VOICES[0]).short;
          els.statusText.textContent = 'Switching to ' + vShort + '...';
        }
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
