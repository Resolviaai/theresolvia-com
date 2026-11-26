import { KaleTTS } from '/assets/js/kale-tts/js/kale-tts.mjs';

const MODEL_BASE = 'https://huggingface.co/KaleComputer/kale-tts-1-nano/resolve/main/';
const FRONTEND_BASE = MODEL_BASE + 'frontend/';
const ORT_CDN = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/';
const CACHE_NAME = 'resolvia-kale-tts-v1';

// Wrap fetch to transparently cache Hugging Face weights & data in Cache API and report progress
const nativeFetch = globalThis.fetch.bind(globalThis);
globalThis.fetch = async function(input, init) {
  const url = typeof input === 'string' ? input : (input && input.url ? input.url : '');
  const isModelAsset = url.startsWith('https://huggingface.co/KaleComputer/kale-tts-1-nano/');
  const isGet = !init || !init.method || init.method.toUpperCase() === 'GET';

  if (!isModelAsset || !isGet) {
    return nativeFetch(input, init);
  }

  let cache = null;
  try {
    if (typeof caches !== 'undefined') {
      cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(url);
      if (cached) {
        return cached;
      }
    }
  } catch (e) {
    // Cache API unavailable (e.g. restricted private browsing)
  }

  const res = await nativeFetch(input, init);
  if (!res.ok) return res;

  const contentLength = Number(res.headers.get('content-length') || 0);
  const fileName = url.split('/').pop().split('?')[0];

  if (res.body) {
    const reader = res.body.getReader();
    const chunks = [];
    let loaded = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.byteLength;
      if (contentLength > 100000) {
        self.postMessage({
          type: 'progress',
          file: fileName,
          loaded,
          total: contentLength,
          pct: Math.min(99, Math.round((loaded / contentLength) * 100))
        });
      }
    }

    const combined = new Uint8Array(loaded);
    let offset = 0;
    for (const c of chunks) {
      combined.set(c, offset);
      offset += c.byteLength;
    }

    const headers = new Headers(res.headers);
    headers.delete('content-encoding');
    headers.set('content-length', String(combined.byteLength));
    const bufferedResponse = new Response(combined.buffer, {
      status: res.status,
      statusText: res.statusText,
      headers
    });

    if (cache) {
      try {
        await cache.put(url, bufferedResponse.clone());
      } catch (e) {
        // Ignore quota errors cleanly
      }
    }

    return bufferedResponse;
  }

  return res;
};

let ttsInstance = null;
let initPromise = null;

async function ensureTTS({ lowEnd, voice }) {
  if (ttsInstance) return ttsInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    self.postMessage({ type: 'status', phase: 'runtime', message: 'Initializing local audio runtime...' });

    const ortMod = await import(ORT_CDN + 'ort.webgpu.min.mjs');
    const ort = ortMod.default || ortMod;

    if (ort && ort.env) {
      ort.env.logLevel = 'fatal';
      if (ort.env.wasm) {
        ort.env.wasm.wasmPaths = ORT_CDN;
        // Avoid SharedArrayBuffer requirement on static hosts without COOP/COEP
        ort.env.wasm.numThreads = self.crossOriginIsolated ? Math.min(navigator.hardwareConcurrency || 2, 4) : 1;
      }
    }

    let skipWebGPU = !!lowEnd;
    if (!skipWebGPU && typeof navigator !== 'undefined' && navigator.gpu) {
      const adapter = await navigator.gpu.requestAdapter().catch(() => null);
      if (!adapter || adapter.isFallbackAdapter || (adapter.info && adapter.info.isFallbackAdapter)) {
        skipWebGPU = true;
      }
    } else if (!skipWebGPU) {
      skipWebGPU = true;
    }

    self.postMessage({ type: 'status', phase: 'model', message: 'Loading voice model (cached once on device)...' });

    const loadOpts = skipWebGPU
      ? { ort, frontend: FRONTEND_BASE, graph: 'int8', executionProviders: ['wasm'], threads: 1, sessionOptions: { logSeverityLevel: 4 } }
      : { ort, frontend: FRONTEND_BASE, graph: 'auto', sessionOptions: { logSeverityLevel: 4 } };

    let tts = await KaleTTS.load(MODEL_BASE, loadOpts);

    // Preload chosen voice so subsequent chunks have zero network wait
    if (voice) {
      await tts.preload([voice]);
    }

    ttsInstance = tts;
    return tts;
  })();

  try {
    return await initPromise;
  } catch (err) {
    initPromise = null;
    throw err;
  }
}

self.onmessage = async (event) => {
  const msg = event.data || {};
  try {
    if (msg.type === 'init') {
      const tts = await ensureTTS({ lowEnd: !!msg.lowEnd, voice: msg.voice || 'f06' });
      self.postMessage({
        type: 'ready',
        backend: tts.backend,
        voices: tts.listVoices()
      });
      // Silently warm remaining voices in background so switching voices feels instant
      setTimeout(() => {
        tts.preload(['f06', 'm3', 'd03', 'd13', 'h013f', 's057b']).catch(() => {});
      }, 400);
    } else if (msg.type === 'synthesize') {
      const tts = await ensureTTS({ lowEnd: !!msg.lowEnd, voice: msg.voice || 'f06' });
      const { audio, sampleRate } = await tts.speak(msg.text, { voice: msg.voice || 'f06' });
      const bufferCopy = new Float32Array(audio);
      self.postMessage(
        {
          type: 'audio',
          token: msg.token,
          index: msg.index,
          text: msg.text,
          sampleRate,
          audio: bufferCopy
        },
        [bufferCopy.buffer]
      );
    }
  } catch (err) {
    self.postMessage({
      type: 'error',
      token: msg.token,
      index: msg.index,
      message: err && err.message ? err.message : String(err)
    });
  }
};
