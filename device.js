import { getFingerprint as getThumbmarkFingerprint } from '@thumbmarkjs/thumbmarkjs';
import { getCurrentBrowserFingerPrint as getBroprintFingerprint } from "@rajesh896/broprint.js";
import b4a from 'b4a';


async function convertToHex(data) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  return b4a.toString(dataBuffer, 'hex');
}

async function getCanvasFingerprint() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 'Unknown';
  ctx.textBaseline = 'alphabetic';
  ctx.font = '18px Arial';
  ctx.fillText('Hello, world!', 2, 20);
  return canvas.toDataURL();
}

async function getWebGLFingerprint() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return 'Unknown';
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  return debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';
}

async function getAudioFingerprint() {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const analyser = context.createAnalyser();
  oscillator.type = 'triangle';
  oscillator.connect(analyser);
  analyser.connect(context.destination);
  oscillator.start(0);
  const buffer = new Float32Array(analyser.frequencyBinCount);
  analyser.getFloatFrequencyData(buffer);
  oscillator.stop();
  return buffer.toString();
}

export async function getEnhancedFingerprint() {
  const [thumbmarkFingerprint, broprintFingerprint] = await Promise.all([
    getThumbmarkFingerprint(),
    getBroprintFingerprint()
  ]);

  const extraAttributes = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language || navigator.userLanguage,
    screenInfo: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      orientation: screen.orientation ? screen.orientation.type : 'Unknown'
    },
    hardwareConcurrency: navigator.hardwareConcurrency || 'Unknown',
    deviceMemory: navigator.deviceMemory || 'Unknown',
    networkInfo: navigator.connection ? {
      downlink: navigator.connection.downlink,
      effectiveType: navigator.connection.effectiveType
    } : 'Unknown',
    deviceSensors: {
      accelerometer: 'ondeviceorientation' in window ? 'Supported' : 'Not Supported',
      gyroscope: 'ondevicemotion' in window ? 'Supported' : 'Not Supported',
    },
    browserEngine: (navigator.userAgent.includes('AppleWebKit') ? 'WebKit' :
      navigator.userAgent.includes('Blink') ? 'Blink' :
        navigator.userAgent.includes('Gecko') ? 'Gecko' : 'Unknown'),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
    canvasFingerprint: await getCanvasFingerprint(),
    webGLFingerprint: await getWebGLFingerprint(),
    audioFingerprint: await getAudioFingerprint()
  };



  return {
    thumbmark: thumbmarkFingerprint,
    broprint: broprintFingerprint,
  };
}
