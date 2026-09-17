/**
 * Time Wanderers - Cinematic Experience, Floor Vision & Palm Hand Gesture Interaction
 * - Invisible camera floor circle detection for initial entry
 * - MediaPipe Hands real-time open palm tracking & closed fist selection
 * - Interactive civilization boundary glow (Indus Valley Civilisation)
 * - Full-screen expedition video screen transition
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleSystem();
  initParallax();
  initAudioAndInteractions();
  initFloorCircleVision();
  initMapAndPalmInteraction();
});

/* ==========================================================================
   Atmospheric Golden Dust Particle System
   ========================================================================== */
function initParticleSystem() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  const particleCount = 65;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class DustParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.2 + 0.8;
      this.speedY = -(Math.random() * 0.35 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.targetOpacity = this.opacity;
      this.hue = Math.random() > 0.3 ? 42 : 35;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.008) * 0.2;
      this.opacity += (Math.random() - 0.5) * 0.04;
      if (this.opacity < 0.1) this.opacity = 0.1;
      if (this.opacity > 0.8) this.opacity = 0.8;

      if (this.y < -10 || this.x < -20 || this.x > width + 20) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 85%, 70%, ${this.opacity})`;
      ctx.shadowColor = `hsla(${this.hue}, 90%, 60%, 0.6)`;
      ctx.shadowBlur = this.size * 3.5;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new DustParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   Smooth Ambient Parallax Effect
   ========================================================================== */
function initParallax() {
  const bgParallax = document.getElementById('bg-parallax');
  const logo = document.getElementById('main-logo');
  
  if (!bgParallax || !logo) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth) - 0.5;
    const normY = (e.clientY / window.innerHeight) - 0.5;
    targetX = normX * 16;
    targetY = normY * 12;
  });

  function renderParallax() {
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    bgParallax.style.transform = `translate3d(${-currentX * 0.6}px, ${-currentY * 0.6}px, 0) scale(1.02)`;
    logo.style.transform = `translate3d(${currentX * 0.8}px, ${currentY * 0.8}px, 0)`;

    requestAnimationFrame(renderParallax);
  }

  renderParallax();
}

/* ==========================================================================
   Global Audio System (Web Audio API)
   ========================================================================== */
let audioCtx = null;
let ambientGainNode = null;
let ambientNoiseNode = null;
let isSoundActive = false;

function initAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playAncientChime(customNotes) {
  initAudioContext();
  if (!audioCtx) return;

  const notes = customNotes || [220, 277.18, 329.63, 440, 554.37, 659.25];
  const now = audioCtx.currentTime;

  notes.forEach((freq, index) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = index % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now + index * 0.08);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12 / (index + 1), now + index * 0.08 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 3.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now + index * 0.08);
    osc.stop(now + index * 0.08 + 4.0);
  });
}

function playPortalWarpSound() {
  initAudioContext();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(110, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.8);
  osc.frequency.exponentialRampToValueAtTime(440, now + 1.4);

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(400, now);
  filter.frequency.linearRampToValueAtTime(3200, now + 0.7);
  filter.frequency.exponentialRampToValueAtTime(600, now + 1.5);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.15, now + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 1.6);

  setTimeout(() => {
    playAncientChime([329.63, 440, 554.37, 659.25, 880]);
  }, 400);
}

let landingAmbientAudio = null;
let ambientFadeInterval = null;
let userHasInteracted = false;

function getLandingAmbientAudio() {
  if (!landingAmbientAudio) {
    landingAmbientAudio = document.getElementById('landing-ambient-audio');
    if (!landingAmbientAudio) {
      landingAmbientAudio = new Audio('Indus Valley Soundscape (Take 1).mp3');
      landingAmbientAudio.loop = true;
      landingAmbientAudio.preload = 'auto';
    }
  }
  return landingAmbientAudio;
}

function playLandingAmbientMusic(targetVolume = 0.65, durationMs = 1800) {
  const audio = getLandingAmbientAudio();
  if (!audio) return;

  if (ambientFadeInterval) {
    clearInterval(ambientFadeInterval);
    ambientFadeInterval = null;
  }

  isSoundActive = true;
  const soundToggle = document.getElementById('sound-toggle');
  const soundIconOff = document.querySelector('.sound-icon-off');
  const soundIconOn = document.querySelector('.sound-icon-on');
  if (soundIconOff) soundIconOff.classList.add('hidden');
  if (soundIconOn) soundIconOn.classList.remove('hidden');
  if (soundToggle) soundToggle.classList.add('active');

  if (audio.paused) {
    audio.volume = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.log('Audio playback waiting for user gesture:', err);
      });
    }
  }

  const steps = 25;
  const stepTime = Math.max(16, durationMs / steps);
  const startVol = audio.volume;
  let step = 0;

  ambientFadeInterval = setInterval(() => {
    step++;
    const progress = step / steps;
    audio.volume = Math.max(0, Math.min(1, startVol + (targetVolume - startVol) * progress));
    if (step >= steps) {
      audio.volume = targetVolume;
      clearInterval(ambientFadeInterval);
      ambientFadeInterval = null;
    }
  }, stepTime);
}

function stopLandingAmbientMusic(durationMs = 1000) {
  const audio = getLandingAmbientAudio();
  if (!audio) return;

  if (ambientFadeInterval) {
    clearInterval(ambientFadeInterval);
    ambientFadeInterval = null;
  }

  const soundToggle = document.getElementById('sound-toggle');
  const soundIconOff = document.querySelector('.sound-icon-off');
  const soundIconOn = document.querySelector('.sound-icon-on');
  if (soundIconOff) soundIconOff.classList.remove('hidden');
  if (soundIconOn) soundIconOn.classList.add('hidden');
  if (soundToggle) soundToggle.classList.remove('active');

  const steps = 20;
  const stepTime = Math.max(16, durationMs / steps);
  const startVol = audio.volume;
  let step = 0;

  ambientFadeInterval = setInterval(() => {
    step++;
    const progress = step / steps;
    audio.volume = Math.max(0, Math.min(1, startVol * (1 - progress)));
    if (step >= steps || audio.volume <= 0.02) {
      audio.volume = 0;
      audio.pause();
      clearInterval(ambientFadeInterval);
      ambientFadeInterval = null;
    }
  }, stepTime);

  // Stop any active narration
  if (currentVoiceAudio) {
    try { currentVoiceAudio.pause(); } catch(e) {}
    currentVoiceAudio = null;
  }
  if (window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch(e) {}
  }
}

/* ==========================================================================
   CINEMATIC VOICE NARRATION FOR GESTURES
   - Plays high-fidelity studio voice clips (assets/audio/voice_*.mp3)
   - Seamless fallback to Web Speech Synthesis if audio is blocked
   - Smart interval deduplication so user is never spammed
   ========================================================================== */
let currentVoiceAudio = null;
let lastVoicePlayed = {};

function playVoiceNarration(name, textFallback, minIntervalMs = 3500) {
  if (!isSoundActive) return;

  const now = performance.now();
  if (lastVoicePlayed[name] && (now - lastVoicePlayed[name] < minIntervalMs)) {
    return;
  }
  lastVoicePlayed[name] = now;

  // Stop previous voice narration if still speaking
  if (currentVoiceAudio) {
    try {
      currentVoiceAudio.pause();
      currentVoiceAudio.currentTime = 0;
    } catch (e) {}
    currentVoiceAudio = null;
  }
  if (window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch(e) {}
  }

  const audioPath = `assets/audio/${name}.mp3`;
  const audio = new Audio(audioPath);
  audio.volume = 0.95;
  currentVoiceAudio = audio;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      // Fallback to Web Speech API
      if (window.speechSynthesis && textFallback) {
        try {
          const utter = new SpeechSynthesisUtterance(textFallback);
          utter.rate = 0.95;
          utter.pitch = 1.0;
          window.speechSynthesis.speak(utter);
        } catch(e) {}
      }
    });
  }
}

function initAudioAndInteractions() {
  const soundToggle = document.getElementById('sound-toggle');

  if (soundToggle) {
    soundToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      userHasInteracted = true;
      isSoundActive = !isSoundActive;
      if (isSoundActive) {
        playLandingAmbientMusic(0.65, 1200);
      } else {
        stopLandingAmbientMusic(800);
      }
    });
  }

  // Auto-play ambient music & guide user on the first slide
  const startOnUserAction = () => {
    if (!userHasInteracted) {
      userHasInteracted = true;
      if (currentScreen === 'landing') {
        playLandingAmbientMusic(0.65, 2000);
        setTimeout(() => {
          if (currentScreen === 'landing') {
            playVoiceNarration('voice_circle_step', 'Step into the circle to begin your journey across time.');
          }
        }, 1200);
      }
    }
  };

  window.addEventListener('click', startOnUserAction, { once: false });
  window.addEventListener('keydown', startOnUserAction, { once: false });
  window.addEventListener('touchstart', startOnUserAction, { once: false });

  const sceneContainer = document.getElementById('scene-container');
  if (sceneContainer) {
    sceneContainer.addEventListener('pointerdown', startOnUserAction);
  }
}

/* ==========================================================================
   GLOBAL STATE & SCREEN TRANSITIONS
   ========================================================================== */
let currentScreen = 'landing'; // 'landing' | 'map' | 'video'
let canTrigger = true;
let walkState = 'idle'; // 'idle' | 'walking' | 'dancer_spotted' | 'blowing_dust' | 'dancing_girl_info' | 'museum_display' | 'time_travel' | 'journey_complete'
let keyboardStepping = false;
let keyboardFast = false;
let twoHandsInitialClose = false;
let twoHandsMinDist = 1.0;
let museumAutoTimer = null;

function showMapScreen() {
  if (currentScreen === 'map' || !canTrigger) return;
  canTrigger = false;
  currentScreen = 'map';
  walkState = 'idle';

  stopLandingAmbientMusic(1000);

  const sceneContainer = document.getElementById('scene-container');
  const mapScreen = document.getElementById('map-screen');
  const videoScreen = document.getElementById('video-screen');
  const warpOverlay = document.getElementById('warp-overlay');
  const palmCursor = document.getElementById('palm-cursor');

  playPortalWarpSound();
  warpOverlay.classList.add('active');

  setTimeout(() => {
    sceneContainer.classList.add('hidden');
    videoScreen.classList.add('hidden');
    mapScreen.classList.remove('hidden');

    if (palmCursor) {
      palmCursor.style.opacity = '1';
    }

    setTimeout(() => {
      warpOverlay.classList.remove('active');
      setTimeout(() => { canTrigger = true; }, 600);
      playVoiceNarration('voice_map_explore', 'Raise your hand to explore ancient civilizations. Hover over the Indus Valley Civilisation to enter.');
    }, 200);
  }, 450);
}

function showVideoScreen() {
  if (currentScreen === 'video' || !canTrigger) return;
  canTrigger = false;
  currentScreen = 'video';
  walkState = 'walking';
  twoHandsInitialClose = false;
  twoHandsMinDist = 1.0;

  const mapScreen = document.getElementById('map-screen');
  const videoScreen = document.getElementById('video-screen');
  const warpOverlay = document.getElementById('warp-overlay');
  const palmCursor = document.getElementById('palm-cursor');
  const expeditionVideo = document.getElementById('expedition-video');
  const videoPlaceholder = document.getElementById('video-placeholder');
  const walkingHud = document.getElementById('walking-hud');
  const zoomPrompt = document.getElementById('zoom-prompt');
  const statueCard = document.getElementById('statue-card');
  const museumActions = document.getElementById('museum-actions');

  if (walkingHud) {
    walkingHud.classList.remove('hidden');
    walkingHud.classList.remove('active');
  }
  if (zoomPrompt) zoomPrompt.classList.add('hidden');
  if (statueCard) statueCard.classList.add('hidden');
  if (museumActions) museumActions.classList.add('hidden');

  // Play ancient selection resonance chord
  playAncientChime([293.66, 349.23, 440, 587.33, 880]);
  warpOverlay.classList.add('active');

  setTimeout(() => {
    mapScreen.classList.add('hidden');
    videoScreen.classList.remove('hidden');

    // Hide palm cursor during walking expedition
    if (palmCursor) {
      palmCursor.style.opacity = '0';
    }

    const dustVideo = document.getElementById('dust-video');
    const museumVideo = document.getElementById('museum-video');
    const timetravelVideo = document.getElementById('timetravel-video');
    const dancingGirlVideo = document.getElementById('dancing-girl-video');
    const lastVideo = document.getElementById('last-video');
    const blowInstruction = document.getElementById('blow-instruction');
    const timetravelGesture = document.getElementById('timetravel-gesture');
    if (dustVideo) {
      dustVideo.pause();
      dustVideo.classList.add('hidden');
    }
    if (museumVideo) {
      museumVideo.pause();
      museumVideo.classList.add('hidden');
    }
    if (dancingGirlVideo) {
      dancingGirlVideo.pause();
      dancingGirlVideo.classList.add('hidden');
    }
    if (lastVideo) {
      lastVideo.pause();
      lastVideo.classList.add('hidden');
    }
    hideAllTimeTravel();

    if (expeditionVideo) {
      expeditionVideo.classList.remove('hidden');
      expeditionVideo.currentTime = 0;
      expeditionVideo.playbackRate = 1.0;
      expeditionVideo.pause();
      if (videoPlaceholder) videoPlaceholder.classList.add('hidden');
    }

    setTimeout(() => {
      warpOverlay.classList.remove('active');
      setTimeout(() => { canTrigger = true; }, 600);
      playVoiceNarration('voice_walk', 'March your legs or walk in place to move forward through the ruins.');
    }, 200);
  }, 450);
}

function returnToMap() {
  if (currentScreen !== 'video' || !canTrigger) return;
  canTrigger = false;
  currentScreen = 'map';
  walkState = 'idle';

  const mapScreen = document.getElementById('map-screen');
  const videoScreen = document.getElementById('video-screen');
  const warpOverlay = document.getElementById('warp-overlay');
  const palmCursor = document.getElementById('palm-cursor');
  const expeditionVideo = document.getElementById('expedition-video');
  const dustVideo = document.getElementById('dust-video');
  const museumVideo = document.getElementById('museum-video');
  const timetravelVideo = document.getElementById('timetravel-video');
  const museumActions = document.getElementById('museum-actions');
  const timetravelGesture = document.getElementById('timetravel-gesture');
  const walkingHud = document.getElementById('walking-hud');
  const zoomPrompt = document.getElementById('zoom-prompt');
  const blowInstruction = document.getElementById('blow-instruction');
  const statueCard = document.getElementById('statue-card');

  stopWindAudio();
  hideAllTimeTravel();
  if (expeditionVideo) {
    expeditionVideo.pause();
    expeditionVideo.classList.remove('hidden');
  }
  if (dustVideo) {
    dustVideo.pause();
    dustVideo.classList.add('hidden');
  }
  if (museumVideo) {
    museumVideo.pause();
    museumVideo.classList.add('hidden');
  }
  const dancingGirlVideo = document.getElementById('dancing-girl-video');
  const lastVideo = document.getElementById('last-video');
  if (dancingGirlVideo) {
    dancingGirlVideo.pause();
    dancingGirlVideo.classList.add('hidden');
  }
  if (lastVideo) {
    lastVideo.pause();
    lastVideo.classList.add('hidden');
  }
  if (museumActions) {
    museumActions.classList.add('hidden');
  }
  if (walkingHud) {
    walkingHud.classList.remove('active');
    walkingHud.classList.remove('hidden');
  }
  if (zoomPrompt) zoomPrompt.classList.add('hidden');
  if (blowInstruction) blowInstruction.classList.add('hidden');
  if (statueCard) statueCard.classList.add('hidden');
  if (museumAutoTimer) {
    clearTimeout(museumAutoTimer);
    museumAutoTimer = null;
  }
  smoothedRollVelocity = 0;

  playPortalWarpSound();
  warpOverlay.classList.add('active');

  setTimeout(() => {
    videoScreen.classList.add('hidden');
    mapScreen.classList.remove('hidden');

    if (palmCursor) {
      palmCursor.style.opacity = '1';
    }

    setTimeout(() => {
      warpOverlay.classList.remove('active');
      setTimeout(() => { canTrigger = true; }, 600);
      playVoiceNarration('voice_map_explore', 'Raise your hand to explore ancient civilizations. Hover over the Indus Valley Civilisation to enter.');
    }, 200);
  }, 400);
}

function returnToLanding(force) {
  if (currentScreen === 'landing') return;
  if (!force && !canTrigger) return;
  canTrigger = false;
  currentScreen = 'landing';
  walkState = 'idle';

  const sceneContainer = document.getElementById('scene-container');
  const mapScreen = document.getElementById('map-screen');
  const videoScreen = document.getElementById('video-screen');
  const warpOverlay = document.getElementById('warp-overlay');
  const palmCursor = document.getElementById('palm-cursor');

  // Clean up all video elements
  const allVideos = ['expedition-video', 'dust-video', 'museum-video', 'timetravel-video', 'timetravel-video-reverse', 'dancing-girl-video', 'last-video'];
  allVideos.forEach(id => {
    const v = document.getElementById(id);
    if (v) { v.pause(); v.classList.add('hidden'); }
  });

  hideAllTimeTravel();
  stopWindAudio();

  // Hide all UI overlays
  const overlayIds = ['walking-hud', 'zoom-prompt', 'blow-instruction', 'statue-card', 'museum-actions', 'timetravel-gesture'];
  overlayIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  if (museumAutoTimer) {
    clearTimeout(museumAutoTimer);
    museumAutoTimer = null;
  }

  playPortalWarpSound();
  warpOverlay.classList.add('active');

  setTimeout(() => {
    mapScreen.classList.add('hidden');
    videoScreen.classList.add('hidden');
    sceneContainer.classList.remove('hidden');

    playLandingAmbientMusic(0.65, 1800);

    if (palmCursor) {
      palmCursor.style.opacity = '0';
    }

    setTimeout(() => {
      warpOverlay.classList.remove('active');
      setTimeout(() => { canTrigger = true; }, 1000);
      // Play welcome narration for the new session
      setTimeout(() => {
        if (currentScreen === 'landing') {
          playVoiceNarration('voice_circle_step', 'Step into the circle to begin your journey across time.');
        }
      }, 1200);
    }, 200);
  }, 400);
}

/* ==========================================================================
   PHYSICAL MARCHING & DANCING GIRL ZOOM CONTROLLER
   ========================================================================== */
let lastLegMotionTime = 0;
let marchingEnergySmoothed = 0;
let stepHistory = [];

function processMarchingVision(currentLuma, prevLuma, procW, procH) {
  if (walkState !== 'walking') return;

  const startY = (procH * 0.35) | 0;
  let legDiffSum = 0;
  let legCount = 0;

  for (let y = startY; y < procH; y++) {
    const row = y * procW;
    for (let x = 0; x < procW; x++) {
      const idx = row + x;
      legDiffSum += Math.abs(currentLuma[idx] - prevLuma[idx]);
      legCount++;
    }
  }

  const rawMotion = legCount > 0 ? (legDiffSum / legCount) : 0;
  const now = performance.now();
  marchingEnergySmoothed = marchingEnergySmoothed * 0.7 + rawMotion * 0.3;

  // Detect distinct step pulses (bursts of motion in leg area)
  if (rawMotion > 5.5 && now - lastLegMotionTime > 240) {
    lastLegMotionTime = now;
    stepHistory.push(now);
    stepHistory = stepHistory.filter(t => now - t <= 2000);
  }

  const isRecentlyMoving = (now - lastLegMotionTime < 600);
  const stepsPerSec = stepHistory.length / 2.0;

  updateWalkingPlayback(isRecentlyMoving, stepsPerSec, marchingEnergySmoothed);
}

function updateWalkingPlayback(isStepping, cadence, energy) {
  const video = document.getElementById('expedition-video');
  const hud = document.getElementById('walking-hud');
  const meterBar = document.getElementById('walking-meter-bar');
  const statusText = document.getElementById('walking-status-text');
  const speedBadge = document.getElementById('walking-speed-badge');

  if (!video || currentScreen !== 'video' || walkState !== 'walking') return;

  const active = isStepping || keyboardStepping;

  if (active) {
    if (hud) hud.classList.add('active');

    let rate = 1.0;
    let label = 'Marching';
    let meterWidth = 60;

    if (keyboardFast || cadence > 2.0 || energy > 13.0) {
      rate = 1.55;
      label = 'Brisk Walk';
      meterWidth = 98;
    } else if (cadence < 1.1 && energy < 7.0 && !keyboardFast) {
      rate = 0.85;
      label = 'Slow Walk';
      meterWidth = 35;
    } else {
      rate = 1.05;
      label = 'Marching';
      meterWidth = 65;
    }

    video.playbackRate = rate;
    if (video.paused) {
      video.play().catch(() => {});
    }

    if (meterBar) meterBar.style.width = `${meterWidth}%`;
    if (statusText) statusText.textContent = 'Exploring Indus Valley...';
    if (speedBadge) speedBadge.textContent = label;
  } else {
    // Stopped
    if (hud) hud.classList.remove('active');
    if (!video.paused) {
      video.pause();
    }
    if (meterBar) meterBar.style.width = '0%';
    if (statusText) statusText.textContent = 'March your legs to walk';
    if (speedBadge) speedBadge.textContent = 'Idle';
  }
}

function onDancerSpotted() {
  if (walkState !== 'walking') return;
  walkState = 'dancer_spotted';
  twoHandsInitialClose = false;
  twoHandsMinDist = 1.0;

  const video = document.getElementById('expedition-video');
  const hud = document.getElementById('walking-hud');
  const zoomPrompt = document.getElementById('zoom-prompt');

  if (video) {
    video.pause();
    video.currentTime = 22.0;
  }

  playAncientChime([440, 554.37, 659.25, 880]);

  if (hud) hud.classList.add('hidden');
  if (zoomPrompt) zoomPrompt.classList.remove('hidden');
  playVoiceNarration('voice_zoom', 'An ancient artifact spotted! Spread both hands apart to zoom in.');
}

function triggerDancerZoom() {
  if (walkState !== 'dancer_spotted') return;
  walkState = 'blowing_dust';

  const expeditionVideo = document.getElementById('expedition-video');
  const dustVideo = document.getElementById('dust-video');
  const museumVideo = document.getElementById('museum-video');
  const museumActions = document.getElementById('museum-actions');
  const timetravelVideo = document.getElementById('timetravel-video');
  const timetravelGesture = document.getElementById('timetravel-gesture');
  const zoomPrompt = document.getElementById('zoom-prompt');
  const statueCard = document.getElementById('statue-card');
  const blowInstruction = document.getElementById('blow-instruction');
  const warpOverlay = document.getElementById('warp-overlay');

  playPortalWarpSound();
  playAncientChime([587.33, 739.99, 880]);

  if (zoomPrompt) zoomPrompt.classList.add('hidden');
  if (statueCard) statueCard.classList.add('hidden');
  if (museumActions) museumActions.classList.add('hidden');
  if (museumVideo) {
    museumVideo.pause();
    museumVideo.classList.add('hidden');
  }
  hideAllTimeTravel();
  if (warpOverlay) warpOverlay.classList.add('active');

  setTimeout(() => {
    if (expeditionVideo) {
      expeditionVideo.pause();
      expeditionVideo.classList.add('hidden');
    }

    if (dustVideo) {
      dustVideo.currentTime = 0;
      dustVideo.playbackRate = 1.0;
      dustVideo.pause();
      dustVideo.classList.remove('hidden');
    }

    if (blowInstruction) blowInstruction.classList.remove('hidden');
    playVoiceNarration('voice_blow', 'Blow air or wipe the screen to clear the dust off the bronze sculpture.');

    // Request & start audio blow detector
    initAudioBlowDetector();

    setTimeout(() => {
      if (warpOverlay) warpOverlay.classList.remove('active');
    }, 250);
  }, 350);
}

/* ==========================================================================
   INTERACTIVE DUST BLOWING & ACOUSTIC BREATH SENSING
   ========================================================================== */
let audioAnalyser = null;
let micStream = null;
let micDataArray = null;
let isManualBlowing = false;
let windAudioNode = null;
let isBlowLoopRunning = false;

async function initAudioBlowDetector() {
  if (audioAnalyser) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') await audioCtx.resume();

    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioCtx.createMediaStreamSource(micStream);
    audioAnalyser = audioCtx.createAnalyser();
    audioAnalyser.fftSize = 512;
    audioAnalyser.smoothingTimeConstant = 0.25;
    source.connect(audioAnalyser);
    micDataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
  } catch (err) {
    console.log('Microphone for blow detection not available or denied:', err);
  }

  if (!isBlowLoopRunning) {
    isBlowLoopRunning = true;
    requestAnimationFrame(updateBlowingLoop);
  }
}

function checkMicBlowEnergy() {
  if (!audioAnalyser || !micDataArray) return 0;
  audioAnalyser.getByteFrequencyData(micDataArray);

  // Blowing generates turbulence in low frequency bins (approx 30Hz - 350Hz)
  let lowSum = 0;
  for (let i = 1; i <= 8; i++) {
    lowSum += micDataArray[i];
  }
  const lowAvg = lowSum / 8;

  if (lowAvg > 50) {
    return Math.min(1.0, Math.max(0.0, (lowAvg - 45) / 85));
  }
  return 0;
}

function startWindAudio() {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (windAudioNode) return;

    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 450;
    filter.Q.value = 1.0;

    const gain = audioCtx.createGain();
    gain.gain.value = 0.08;

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    whiteNoise.start();

    windAudioNode = { source: whiteNoise, gain: gain, filter: filter };
  } catch(e) {}
}

function stopWindAudio() {
  if (windAudioNode) {
    try {
      windAudioNode.source.stop();
      windAudioNode.source.disconnect();
    } catch(e) {}
    windAudioNode = null;
  }
}

function updateBlowingLoop() {
  if (currentScreen === 'video' && walkState === 'blowing_dust') {
    const dustVideo = document.getElementById('dust-video');
    const blowInstruction = document.getElementById('blow-instruction');
    const blowMeterBar = document.getElementById('blow-meter-bar');
    const blowStatusText = document.getElementById('blow-status-text');

    let intensity = checkMicBlowEnergy();
    if (isManualBlowing) {
      intensity = Math.max(intensity, 0.9);
    }

    const duration = (dustVideo && dustVideo.duration && !isNaN(dustVideo.duration)) ? dustVideo.duration : 9.8;
    const currentT = dustVideo ? dustVideo.currentTime : 0;
    const progress = Math.min(100, Math.max(0, Math.round((currentT / Math.min(duration, 9.8)) * 100)));

    if (blowMeterBar) {
      blowMeterBar.style.width = `${progress}%`;
    }

    if (currentT >= 9.75 || progress >= 100) {
      onDustCleared();
      return;
    }

    if (intensity > 0.22) {
      if (dustVideo) {
        dustVideo.playbackRate = 1.8 + intensity * 0.6;
        if (dustVideo.paused) dustVideo.play().catch(() => {});
      }
      if (blowInstruction) blowInstruction.classList.add('blowing');
      if (blowStatusText) blowStatusText.textContent = progress > 0 ? `Wiping off dust... ${progress}%` : 'Wipe off the dust';
      startWindAudio();
    } else {
      if (dustVideo && !dustVideo.paused) {
        dustVideo.pause();
      }
      if (blowInstruction) blowInstruction.classList.remove('blowing');
      if (blowStatusText) blowStatusText.textContent = progress > 0 ? `Wiping off the dust (${progress}%)` : 'Wipe off the dust';
      stopWindAudio();
    }
  }

  requestAnimationFrame(updateBlowingLoop);
}

function onDustCleared() {
  if (walkState !== 'blowing_dust') return;
  walkState = 'dancing_girl_info';

  const dustVideo = document.getElementById('dust-video');
  const dancingGirlVideo = document.getElementById('dancing-girl-video');
  const blowInstruction = document.getElementById('blow-instruction');
  const statueCard = document.getElementById('statue-card');
  const museumActions = document.getElementById('museum-actions');

  stopWindAudio();

  if (dustVideo) {
    dustVideo.pause();
    dustVideo.classList.add('hidden');
  }

  if (blowInstruction) blowInstruction.classList.add('hidden');

  if (statueCard) {
    statueCard.classList.add('hidden');
  }

  if (museumActions) {
    museumActions.classList.add('hidden');
  }

  playAncientChime([587.33, 739.99, 880, 1174.66, 1479.98]);
  playVoiceNarration('voice_dancing_girl', 'Here is the Dancing Girl of Mohenjo-daro, one of the most famous bronze artifacts of the Indus Valley Civilisation.', 2000);

  // Play Dancing Girl info video first
  if (dancingGirlVideo) {
    dancingGirlVideo.classList.remove('hidden');
    dancingGirlVideo.currentTime = 0;
    dancingGirlVideo.playbackRate = 1.0;
    const playPromise = dancingGirlVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.log('Dancing Girl video play notification:', err);
      });
    }
  }
}

function onDancingGirlEnded() {
  if (walkState !== 'dancing_girl_info') return;
  walkState = 'museum_display';

  const dancingGirlVideo = document.getElementById('dancing-girl-video');
  const museumVideo = document.getElementById('museum-video');

  if (dancingGirlVideo) {
    dancingGirlVideo.pause();
    dancingGirlVideo.classList.add('hidden');
  }

  // Seamlessly transition and play the Museum UI Animation Video
  if (museumVideo) {
    museumVideo.classList.remove('hidden');
    museumVideo.currentTime = 0;
    museumVideo.playbackRate = 1.0;
    const playPromise = museumVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.log('Museum UI video play notification:', err);
      });
    }
  }
}

function replayBlow() {
  walkState = 'blowing_dust';
  const dustVideo = document.getElementById('dust-video');
  const museumVideo = document.getElementById('museum-video');
  const timetravelVideo = document.getElementById('timetravel-video');
  const museumActions = document.getElementById('museum-actions');
  const timetravelGesture = document.getElementById('timetravel-gesture');
  const statueCard = document.getElementById('statue-card');
  const blowInstruction = document.getElementById('blow-instruction');

  hideAllTimeTravel();
  if (statueCard) statueCard.classList.add('hidden');
  if (museumActions) museumActions.classList.add('hidden');
  if (museumAutoTimer) {
    clearTimeout(museumAutoTimer);
    museumAutoTimer = null;
  }

  if (museumVideo) {
    museumVideo.pause();
    museumVideo.classList.add('hidden');
  }
  const dancingGirlVideo = document.getElementById('dancing-girl-video');
  if (dancingGirlVideo) {
    dancingGirlVideo.pause();
    dancingGirlVideo.classList.add('hidden');
  }

  if (blowInstruction) blowInstruction.classList.remove('hidden');
  playVoiceNarration('voice_blow', 'Blow air or wipe the screen to clear the dust off the bronze sculpture.');

  if (dustVideo) {
    dustVideo.currentTime = 0;
    dustVideo.playbackRate = 1.0;
    dustVideo.pause();
    dustVideo.classList.remove('hidden');
  }

  initAudioBlowDetector();
}

function replayWalk() {
  walkState = 'walking';
  twoHandsInitialClose = false;

  const expeditionVideo = document.getElementById('expedition-video');
  const dustVideo = document.getElementById('dust-video');
  const museumVideo = document.getElementById('museum-video');
  const timetravelVideo = document.getElementById('timetravel-video');
  const museumActions = document.getElementById('museum-actions');
  const timetravelGesture = document.getElementById('timetravel-gesture');
  const statueCard = document.getElementById('statue-card');
  const zoomPrompt = document.getElementById('zoom-prompt');
  const blowInstruction = document.getElementById('blow-instruction');
  const hud = document.getElementById('walking-hud');

  stopWindAudio();
  hideAllTimeTravel();

  if (statueCard) statueCard.classList.add('hidden');
  if (museumActions) museumActions.classList.add('hidden');
  if (museumAutoTimer) {
    clearTimeout(museumAutoTimer);
    museumAutoTimer = null;
  }
  if (zoomPrompt) zoomPrompt.classList.add('hidden');
  if (blowInstruction) blowInstruction.classList.add('hidden');

  if (museumVideo) {
    museumVideo.pause();
    museumVideo.classList.add('hidden');
  }

  const dancingGirlVid = document.getElementById('dancing-girl-video');
  if (dancingGirlVid) {
    dancingGirlVid.pause();
    dancingGirlVid.classList.add('hidden');
  }

  if (dustVideo) {
    dustVideo.pause();
    dustVideo.classList.add('hidden');
  }

  if (expeditionVideo) {
    expeditionVideo.currentTime = 0;
    expeditionVideo.playbackRate = 1.0;
    expeditionVideo.pause();
    expeditionVideo.classList.remove('hidden');
  }

  if (hud) {
    hud.classList.remove('hidden');
    hud.classList.remove('active');
  }
  playVoiceNarration('voice_walk', 'March your legs or walk in place to move forward through the ruins.');
}

/* ==========================================================================
   FOREARM ROLLING TIME TRAVEL CONTROLLER & SEAMLESS DUAL-VIDEO ENGINE
   - True continuous 2-hand angle tracking with persistent hand identity
   - Clockwise rolling detects user intent -> plays forward smoothly to 2500 BCE
   - Anticlockwise rolling detects user intent -> plays backward smoothly to Present Day
   - Seamless non-stop playback from start to end without pausing or stutter
   ========================================================================== */
let trackedHandA = null;
let trackedHandB = null;
let lastRollAngle = null;
let lastSingleAngle = null;
let rollAccumulator = 0;
let lastGestureActiveTimestamp = 0;
let timeTravelDirection = 'idle'; // 'idle' | 'forward' | 'reverse' | 'arrived' | 'present'
let timeTravelLoopStarted = false;
let isKeyboardRollingCW = false;
let isKeyboardRollingCCW = false;

function hideAllTimeTravel() {
  pauseTimeTravel();
  const fwdVideo = document.getElementById('timetravel-video');
  const revVideo = document.getElementById('timetravel-video-reverse');
  const gestureEl = document.getElementById('timetravel-gesture');
  if (fwdVideo) {
    fwdVideo.pause();
    fwdVideo.classList.add('hidden');
  }
  if (revVideo) {
    revVideo.pause();
    revVideo.classList.add('hidden');
  }
  if (gestureEl) {
    gestureEl.classList.add('hidden');
    gestureEl.classList.remove('rolling-cw', 'rolling-ccw');
  }
}

function enterTimeTravel() {
  if (currentScreen !== 'video') return;
  walkState = 'time_travel';

  const museumVideo = document.getElementById('museum-video');
  const dustVideo = document.getElementById('dust-video');
  const expeditionVideo = document.getElementById('expedition-video');
  const timetravelVideo = document.getElementById('timetravel-video');
  const timetravelVideoRev = document.getElementById('timetravel-video-reverse');
  const museumActions = document.getElementById('museum-actions');
  const timetravelGesture = document.getElementById('timetravel-gesture');
  const gesturePill = document.getElementById('tt-gesture-pill');
  const warpOverlay = document.getElementById('warp-overlay');

  playPortalWarpSound();
  playAncientChime([329.63, 440, 554.37, 659.25, 880]);

  if (warpOverlay) warpOverlay.classList.add('active');

  setTimeout(() => {
    if (museumVideo) {
      museumVideo.pause();
      museumVideo.classList.add('hidden');
    }
    if (dustVideo) {
      dustVideo.pause();
      dustVideo.classList.add('hidden');
    }
    if (expeditionVideo) {
      expeditionVideo.pause();
      expeditionVideo.classList.add('hidden');
    }
    if (museumActions) {
      museumActions.classList.add('hidden');
    }
    const dancingGirlVid = document.getElementById('dancing-girl-video');
    if (dancingGirlVid) {
      dancingGirlVid.pause();
      dancingGirlVid.classList.add('hidden');
    }

    const walkingHud = document.getElementById('walking-hud');
    const zoomPrompt = document.getElementById('zoom-prompt');
    const blowInstruction = document.getElementById('blow-instruction');
    const palmCursor = document.getElementById('palm-cursor');
    if (walkingHud) walkingHud.classList.add('hidden');
    if (zoomPrompt) zoomPrompt.classList.add('hidden');
    if (blowInstruction) blowInstruction.classList.add('hidden');
    if (palmCursor) palmCursor.style.opacity = '0';

    if (timetravelVideo) {
      timetravelVideo.muted = true;
      timetravelVideo.currentTime = 0;
      timetravelVideo.pause();
      timetravelVideo.classList.remove('hidden');
    }
    if (timetravelVideoRev) {
      timetravelVideoRev.muted = true;
      timetravelVideoRev.currentTime = 0;
      timetravelVideoRev.pause();
      timetravelVideoRev.classList.add('hidden');
    }

    if (timetravelGesture) {
      timetravelGesture.classList.remove('hidden', 'rolling-cw', 'rolling-ccw');
    }
    if (gesturePill) {
      gesturePill.textContent = 'Roll Forearms';
    }

    // Reset tracking state
    timeTravelDirection = 'idle';
    rollAccumulator = 0;
    trackedHandA = null;
    trackedHandB = null;
    lastRollAngle = null;
    lastSingleAngle = null;
    lastGestureActiveTimestamp = 0;

    startTimeTravelLoop();

    setTimeout(() => {
      if (warpOverlay) warpOverlay.classList.remove('active');
      playVoiceNarration('voice_roll_forward', 'Roll your hands forward to travel into the ancient past.');
    }, 250);
  }, 350);
}

function startTimeTravelForward() {
  if (walkState !== 'time_travel') return;
  const fwdVideo = document.getElementById('timetravel-video');
  const revVideo = document.getElementById('timetravel-video-reverse');
  const gestureEl = document.getElementById('timetravel-gesture');
  const pillEl = document.getElementById('tt-gesture-pill');
  if (!fwdVideo) return;

  // Hide reverse video if visible
  if (revVideo) {
    revVideo.pause();
    revVideo.classList.add('hidden');
  }

  fwdVideo.classList.remove('hidden');
  fwdVideo.currentTime = 0;

  // One-trigger: play forward from start to end, no user control
  timeTravelDirection = 'forward';
  lastGestureActiveTimestamp = performance.now();
  if (gestureEl) {
    gestureEl.classList.add('rolling-cw');
    gestureEl.classList.remove('rolling-ccw');
  }
  playVoiceNarration('voice_roll_forward', 'Traveling into the ancient past...', 8000);

  fwdVideo.play().catch(() => {});
}

function startTimeTravelReverse() {
  if (walkState !== 'time_travel') return;
  const fwdVideo = document.getElementById('timetravel-video');
  const revVideo = document.getElementById('timetravel-video-reverse');
  const gestureEl = document.getElementById('timetravel-gesture');
  const pillEl = document.getElementById('tt-gesture-pill');
  if (!revVideo) return;

  const duration = (revVideo.duration && !isNaN(revVideo.duration) && revVideo.duration > 0) ? revVideo.duration : 10.0;

  // If we were currently in forward, arrived, or idle, seamlessly synchronize position
  if ((timeTravelDirection === 'forward' || timeTravelDirection === 'idle' || timeTravelDirection === 'arrived') && fwdVideo) {
    fwdVideo.pause();
    const fwdTime = fwdVideo.currentTime;
    const syncedRevTime = Math.max(0, Math.min(duration, duration - fwdTime));
    revVideo.currentTime = syncedRevTime;
    fwdVideo.classList.add('hidden');
  }

  revVideo.classList.remove('hidden');

  // If already at the start (Present Day, 0s)
  if (revVideo.currentTime >= duration - 0.08) {
    revVideo.currentTime = duration;
    revVideo.pause();
    if (fwdVideo) fwdVideo.currentTime = 0;
    timeTravelDirection = 'present';
    if (pillEl) pillEl.textContent = 'Present Day (0%)';
    if (gestureEl) gestureEl.classList.remove('rolling-cw', 'rolling-ccw');
    return;
  }

  // Play reverse continuously without stops
  timeTravelDirection = 'reverse';
  lastGestureActiveTimestamp = performance.now();
  if (gestureEl) {
    gestureEl.classList.add('rolling-ccw');
    gestureEl.classList.remove('rolling-cw');
  }
  playVoiceNarration('voice_roll_backward', 'Roll your hands backward to return to the present day.', 8000);

  revVideo.play().catch(() => {});
}

function applyRollRotation(dAngle) {
  if (walkState !== 'time_travel') return;
  // If time travel video is already playing forward, ignore further rolling
  if (timeTravelDirection === 'forward' || timeTravelDirection === 'arrived') return;

  const now = performance.now();
  if (now - lastGestureActiveTimestamp > 400) {
    rollAccumulator = 0;
  }
  lastGestureActiveTimestamp = now;

  // Accumulate angle to detect intentional rolling direction
  rollAccumulator += dAngle;

  // Clockwise rolling -> one-trigger: play forward video from start to end
  if (rollAccumulator > 0.16) {
    rollAccumulator = 0;
    startTimeTravelForward();
  }
  // Ignore anticlockwise — no reverse in simplified mode
}

function triggerTimeTravelForward() {
  startTimeTravelForward();
}

function triggerTimeTravelBackward() {
  // No-op in simplified mode
}

function pauseTimeTravel() {
  const fwdVideo = document.getElementById('timetravel-video');
  const revVideo = document.getElementById('timetravel-video-reverse');
  const gestureEl = document.getElementById('timetravel-gesture');
  const pillEl = document.getElementById('tt-gesture-pill');

  if (fwdVideo) fwdVideo.pause();
  if (revVideo) revVideo.pause();
  timeTravelDirection = 'idle';

  if (gestureEl) gestureEl.classList.remove('rolling-cw', 'rolling-ccw');
  if (pillEl && walkState === 'time_travel') pillEl.textContent = 'Roll Forearms';
}

function onTimeTravelComplete() {
  // Wait 5 seconds after time travel arrived, then play last video
  setTimeout(() => {
    if (walkState !== 'time_travel') return;
    walkState = 'journey_complete';

    hideAllTimeTravel();
    playVoiceNarration('voice_last_video', 'Your journey across time is now complete.', 2000);

    const lastVideo = document.getElementById('last-video');
    if (lastVideo) {
      lastVideo.classList.remove('hidden');
      lastVideo.currentTime = 0;
      lastVideo.playbackRate = 1.0;
      const playPromise = lastVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Last video play notification:', err);
          // If video can't play, just return to landing after a delay
          setTimeout(() => onLastVideoEnded(), 3000);
        });
      }
    } else {
      // No last video found, return to landing
      setTimeout(() => returnToLanding(), 3000);
    }
  }, 5000);
}

function onLastVideoEnded() {
  if (walkState !== 'journey_complete') return;

  const lastVideo = document.getElementById('last-video');
  if (lastVideo) {
    lastVideo.pause();
    lastVideo.classList.add('hidden');
  }

  // Reset to landing screen for a new session
  returnToLanding(true);
}

function handleForearmRolling(landmarksList) {
  if (walkState !== 'time_travel' || !landmarksList || landmarksList.length === 0) return;

  if (landmarksList.length >= 2) {
    // Extract mirrored centroid of each hand
    const lm0 = landmarksList[0];
    const lm1 = landmarksList[1];

    const p0x = 1.0 - (lm0[0].x + lm0[5].x + lm0[9].x + lm0[17].x) * 0.25;
    const p0y = (lm0[0].y + lm0[5].y + lm0[9].y + lm0[17].y) * 0.25;

    const p1x = 1.0 - (lm1[0].x + lm1[5].x + lm1[9].x + lm1[17].x) * 0.25;
    const p1y = (lm1[0].y + lm1[5].y + lm1[9].y + lm1[17].y) * 0.25;

    // Persistent Hand Matching: Prevents hand identity flipping when hands cross
    if (!trackedHandA || !trackedHandB) {
      trackedHandA = { x: p0x, y: p0y };
      trackedHandB = { x: p1x, y: p1y };
    } else {
      const distSame = Math.hypot(p0x - trackedHandA.x, p0y - trackedHandA.y) +
                       Math.hypot(p1x - trackedHandB.x, p1y - trackedHandB.y);
      const distSwap = Math.hypot(p0x - trackedHandB.x, p0y - trackedHandB.y) +
                       Math.hypot(p1x - trackedHandA.x, p1y - trackedHandA.y);

      if (distSame <= distSwap) {
        trackedHandA.x += (p0x - trackedHandA.x) * 0.75;
        trackedHandA.y += (p0y - trackedHandA.y) * 0.75;
        trackedHandB.x += (p1x - trackedHandB.x) * 0.75;
        trackedHandB.y += (p1y - trackedHandB.y) * 0.75;
      } else {
        trackedHandA.x += (p1x - trackedHandA.x) * 0.75;
        trackedHandA.y += (p1y - trackedHandA.y) * 0.75;
        trackedHandB.x += (p0x - trackedHandB.x) * 0.75;
        trackedHandB.y += (p0y - trackedHandB.y) * 0.75;
      }
    }

    const dx = trackedHandB.x - trackedHandA.x;
    const dy = trackedHandB.y - trackedHandA.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 0.035) {
      const angle = Math.atan2(dy, dx);

      if (lastRollAngle !== null) {
        let dAngle = angle - lastRollAngle;
        while (dAngle > Math.PI) dAngle -= 2 * Math.PI;
        while (dAngle < -Math.PI) dAngle += 2 * Math.PI;

        // Discard single-frame tracking glitch
        if (Math.abs(dAngle) < 1.4) {
          applyRollRotation(dAngle);
        }
      }

      lastRollAngle = angle;
    }
  } else if (landmarksList.length === 1) {
    // Single hand fallback during occlusion passes
    const lm = landmarksList[0];
    const px = 1.0 - (lm[0].x + lm[5].x + lm[9].x + lm[17].x) * 0.25;
    const py = (lm[0].y + lm[5].y + lm[9].y + lm[17].y) * 0.25;

    const centerX = (trackedHandA && trackedHandB) ? (trackedHandA.x + trackedHandB.x) * 0.5 : 0.5;
    const centerY = (trackedHandA && trackedHandB) ? (trackedHandA.y + trackedHandB.y) * 0.5 : 0.5;

    const singleAngle = Math.atan2(py - centerY, px - centerX);

    if (lastSingleAngle !== null) {
      let dAngle = singleAngle - lastSingleAngle;
      while (dAngle > Math.PI) dAngle -= 2 * Math.PI;
      while (dAngle < -Math.PI) dAngle += 2 * Math.PI;

      if (Math.abs(dAngle) < 1.4) {
        applyRollRotation(dAngle);
      }
    }

    lastSingleAngle = singleAngle;
  }
}

function startTimeTravelLoop() {
  if (timeTravelLoopStarted) return;
  timeTravelLoopStarted = true;

  function timeTravelRenderLoop() {
    if (currentScreen === 'video' && walkState === 'time_travel') {
      const fwdVideo = document.getElementById('timetravel-video');
      const gestureEl = document.getElementById('timetravel-gesture');
      const pillEl = document.getElementById('tt-gesture-pill');

      // Forward continuous playback monitor
      if (timeTravelDirection === 'forward' && fwdVideo) {
        const dur = (fwdVideo.duration && !isNaN(fwdVideo.duration) && fwdVideo.duration > 0) ? fwdVideo.duration : 10.0;
        const pct = Math.min(100, Math.round((fwdVideo.currentTime / dur) * 100));
        if (pillEl) {
          pillEl.textContent = `Traveling to 2500 BCE (${pct}%)`;
        }
        // Stop precisely at the last frame
        if (fwdVideo.currentTime >= dur - 0.08 || fwdVideo.ended) {
          fwdVideo.pause();
          fwdVideo.currentTime = dur;
          timeTravelDirection = 'arrived';
          if (pillEl) pillEl.textContent = 'Arrived at 2500 BCE (100%)';
          if (gestureEl) gestureEl.classList.remove('rolling-cw', 'rolling-ccw');
          playVoiceNarration('voice_arrived_ancient', 'Arrived at 2500 BCE. Welcome to Mohenjo-daro.', 6000);
          // Auto-transition: wait 5 seconds then play last video
          onTimeTravelComplete();
        }
      }
    }

    requestAnimationFrame(timeTravelRenderLoop);
  }

  requestAnimationFrame(timeTravelRenderLoop);
}

/* ==========================================================================
   COMPUTER VISION: Camera Management & Floor Circle Step-In
   ========================================================================== */
let sharedCameraStream = null;
let onFrameProcessed = null;

function initFloorCircleVision() {
  const video = document.getElementById('camera-feed');
  const canvas = document.getElementById('vision-canvas');
  const debugCanvas = document.getElementById('debug-canvas');
  const debugCamStatus = document.getElementById('debug-cam-status');
  const debugCircleFound = document.getElementById('debug-circle-found');
  const debugCircleCenter = document.getElementById('debug-circle-center');
  const debugOccupancy = document.getElementById('debug-occupancy');
  const debugMeterFill = document.getElementById('debug-meter-fill');
  const sensorBeacon = document.getElementById('sensor-beacon');
  const debugModal = document.getElementById('debug-modal');
  const debugCloseBtn = document.getElementById('debug-close-btn');
  const debugTriggerBtn = document.getElementById('debug-trigger-btn');
  const debugRecalibrateBtn = document.getElementById('debug-recalibrate-btn');
  const debugRetryBtn = document.getElementById('debug-retry-btn');
  const debugCamSelect = document.getElementById('debug-cam-select');
  const ctaButton = document.getElementById('cta-button');
  const rippleRing = document.getElementById('ripple-ring');

  const procWidth = 160;
  const procHeight = 120;
  canvas.width = procWidth;
  canvas.height = procHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const debugCtx = debugCanvas ? debugCanvas.getContext('2d') : null;

  let prevFrameLuma = null;
  let referenceBackgroundLuma = null;
  let quietFrameCount = 0;
  let detectedCircle = { x: procWidth * 0.5, y: procHeight * 0.68, r: 36, valid: false };
  let triggerStreak = 0;
  let selectedDeviceId = null;
  let isCameraActive = false;
  let retryTimer = null;

  async function populateCameraDevices() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');

      if (debugCamSelect) {
        debugCamSelect.innerHTML = '';
        if (videoDevices.length === 0) {
          const opt = document.createElement('option');
          opt.value = '';
          opt.textContent = 'Default System Camera';
          debugCamSelect.appendChild(opt);
        } else {
          videoDevices.forEach((device, index) => {
            const opt = document.createElement('option');
            opt.value = device.deviceId;
            const label = device.label || `Camera ${index + 1}`;
            opt.textContent = label;

            if (!selectedDeviceId && /logitech|c925|external|usb/i.test(label)) {
              selectedDeviceId = device.deviceId;
              opt.selected = true;
            }
            debugCamSelect.appendChild(opt);
          });
          if (selectedDeviceId) debugCamSelect.value = selectedDeviceId;
        }
      }
    } catch (e) {
      console.warn('Could not enumerate devices:', e);
    }
  }

  async function startCamera(deviceId = null) {
    if (retryTimer) clearTimeout(retryTimer);

    if (video && video.srcObject) {
      try {
        video.srcObject.getTracks().forEach(t => t.stop());
      } catch(e) {}
    }

    try {
      if (debugCamStatus) debugCamStatus.textContent = 'Connecting camera...';

      const constraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      };

      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      sharedCameraStream = stream;
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      await video.play();

      isCameraActive = true;
      if (debugCamStatus) debugCamStatus.textContent = 'Active & Tracking';
      if (sensorBeacon) sensorBeacon.querySelector('.sensor-label').textContent = 'Floor Vision Active';

      populateCameraDevices();
      requestAnimationFrame(processVisionLoop);
    } catch (err) {
      console.warn('Camera stream error:', err);
      isCameraActive = false;
      const isDeviceBusy = err.name === 'NotReadableError' || (err.message && err.message.toLowerCase().includes('in use'));
      const isDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';

      if (debugCamStatus) {
        if (isDeviceBusy) debugCamStatus.textContent = 'Device in use (Close other apps/tabs)';
        else if (isDenied) debugCamStatus.textContent = 'Permission Denied (Allow camera in URL bar)';
        else debugCamStatus.textContent = 'Error: ' + (err.name || 'Unavailable');
      }

      if (isDeviceBusy) {
        retryTimer = setTimeout(() => startCamera(selectedDeviceId), 2500);
      }
    }
  }

  function processVisionLoop() {
    if (!video || video.paused || video.ended || video.readyState < 2) {
      requestAnimationFrame(processVisionLoop);
      return;
    }

    // Pass video frame to MediaPipe hand tracker if initialized
    if (onFrameProcessed) {
      onFrameProcessed(video);
    }

    // Off-screen floor analysis
    ctx.drawImage(video, 0, 0, procWidth, procHeight);
    const frameData = ctx.getImageData(0, 0, procWidth, procHeight);
    const pixels = frameData.data;
    const numPixels = procWidth * procHeight;
    const currentLuma = new Uint8Array(numPixels);

    let floorLumaSum = 0;
    let floorCount = 0;

    for (let i = 0; i < numPixels; i++) {
      const p = i * 4;
      const luma = (pixels[p] * 0.299 + pixels[p + 1] * 0.587 + pixels[p + 2] * 0.114) | 0;
      currentLuma[i] = luma;

      const py = (i / procWidth) | 0;
      if (py > procHeight * 0.25) {
        floorLumaSum += luma;
        floorCount++;
      }
    }

    const avgFloorLuma = floorCount > 0 ? (floorLumaSum / floorCount) : 120;
    const dynamicWhiteThreshold = Math.max(135, Math.min(225, avgFloorLuma + 28));

    let whiteSumX = 0;
    let whiteSumY = 0;
    let whiteCount = 0;

    for (let i = 0; i < numPixels; i++) {
      const py = (i / procWidth) | 0;
      if (py < procHeight * 0.25) continue;

      const p = i * 4;
      const r = pixels[p];
      const g = pixels[p + 1];
      const b = pixels[p + 2];
      const luma = currentLuma[i];
      const sat = Math.max(r, g, b) - Math.min(r, g, b);

      if (luma > dynamicWhiteThreshold && sat < 45) {
        whiteSumX += (i % procWidth);
        whiteSumY += py;
        whiteCount++;
      }
    }

    if (whiteCount >= 25) {
      detectedCircle.x = detectedCircle.x * 0.85 + (whiteSumX / whiteCount) * 0.15;
      detectedCircle.y = detectedCircle.y * 0.85 + (whiteSumY / whiteCount) * 0.15;
      detectedCircle.valid = true;
      if (debugCircleFound) debugCircleFound.textContent = `Yes (${whiteCount} pts)`;
      if (debugCircleCenter) debugCircleCenter.textContent = `${Math.round(detectedCircle.x)}, ${Math.round(detectedCircle.y)}`;
    }

    // Measure motion & occupancy
    let motionDiffSum = 0;
    let bgDiffSum = 0;
    let circlePixelCount = 0;
    const cx = detectedCircle.x;
    const cy = detectedCircle.y;
    const r = detectedCircle.r;
    const rSq = r * r;

    for (let y = Math.max(0, (cy - r) | 0); y <= Math.min(procHeight - 1, (cy + r) | 0); y++) {
      const dy = y - cy;
      const dySq = dy * dy;
      const rowOffset = y * procWidth;

      for (let x = Math.max(0, (cx - r) | 0); x <= Math.min(procWidth - 1, (cx + r) | 0); x++) {
        const dx = x - cx;
        if (dx * dx + dySq <= rSq) {
          const idx = rowOffset + x;
          const val = currentLuma[idx];
          if (prevFrameLuma) motionDiffSum += Math.abs(val - prevFrameLuma[idx]);
          if (referenceBackgroundLuma) bgDiffSum += Math.abs(val - referenceBackgroundLuma[idx]);
          circlePixelCount++;
        }
      }
    }

    const avgMotion = circlePixelCount > 0 ? (motionDiffSum / circlePixelCount) : 0;
    const avgBgDiff = circlePixelCount > 0 && referenceBackgroundLuma ? (bgDiffSum / circlePixelCount) : 0;

    if (referenceBackgroundLuma === null) {
      referenceBackgroundLuma = new Uint8Array(currentLuma);
    } else if (avgMotion < 4.0) {
      quietFrameCount++;
      if (quietFrameCount > 20) {
        for (let i = 0; i < numPixels; i++) {
          referenceBackgroundLuma[i] = (referenceBackgroundLuma[i] * 0.95 + currentLuma[i] * 0.05) | 0;
        }
      }
    } else {
      quietFrameCount = 0;
    }

    // Process marching & leg movement if exploring on video screen
    if (currentScreen === 'video' && walkState === 'walking' && prevFrameLuma) {
      processMarchingVision(currentLuma, prevFrameLuma, procWidth, procHeight);
    }

    prevFrameLuma = currentLuma;
    const occupancyScore = Math.min(100, Math.round(Math.max(avgMotion * 4.5, avgBgDiff * 3.2)));

    if (debugOccupancy) debugOccupancy.textContent = `${occupancyScore}%`;
    if (debugMeterFill) debugMeterFill.style.width = `${occupancyScore}%`;

    // Trigger step-in transition from landing screen
    if (occupancyScore >= 24 && currentScreen === 'landing' && canTrigger) {
      triggerStreak++;
      if (triggerStreak >= 2) {
        triggerStreak = 0;
        showMapScreen();
      }
    } else {
      triggerStreak = Math.max(0, triggerStreak - 1);
    }

    // Render debug visualizer
    if (debugCtx && !debugModal.classList.contains('hidden')) {
      debugCtx.drawImage(canvas, 0, 0, debugCanvas.width, debugCanvas.height);
      const scaleX = debugCanvas.width / procWidth;
      const scaleY = debugCanvas.height / procHeight;

      debugCtx.beginPath();
      debugCtx.ellipse(detectedCircle.x * scaleX, detectedCircle.y * scaleY, detectedCircle.r * scaleX, detectedCircle.r * 0.65 * scaleY, 0, 0, Math.PI * 2);
      debugCtx.lineWidth = 3;
      debugCtx.strokeStyle = occupancyScore >= 24 ? '#3ee98a' : '#d8b26e';
      debugCtx.stroke();
      debugCtx.fillStyle = occupancyScore >= 24 ? 'rgba(62, 233, 138, 0.35)' : 'rgba(216, 178, 110, 0.15)';
      debugCtx.fill();
    }

    requestAnimationFrame(processVisionLoop);
  }

  // Debug controls
  if (sensorBeacon) sensorBeacon.addEventListener('click', () => debugModal.classList.toggle('hidden'));
  if (debugCloseBtn) debugCloseBtn.addEventListener('click', () => debugModal.classList.add('hidden'));
  if (debugTriggerBtn) debugTriggerBtn.addEventListener('click', () => showMapScreen());
  if (debugRecalibrateBtn) debugRecalibrateBtn.addEventListener('click', () => { referenceBackgroundLuma = null; });
  if (debugRetryBtn) debugRetryBtn.addEventListener('click', () => startCamera(selectedDeviceId));
  if (debugCamSelect) {
    debugCamSelect.addEventListener('change', (e) => {
      selectedDeviceId = e.target.value;
      startCamera(selectedDeviceId);
    });
  }

  // Keyboard shortcut: 'D' for Debug HUD, Space/Enter to step in, Esc to go back
  window.addEventListener('keydown', (e) => {
    if (e.key === 'd' || e.key === 'D') {
      debugModal.classList.toggle('hidden');
    } else if (e.key === ' ' || e.key === 'Enter') {
      if (currentScreen === 'landing') showMapScreen();
    } else if (e.key === 'Escape') {
      if (currentScreen === 'video') returnToMap();
      else if (currentScreen === 'map') returnToLanding();
    }
  });

  // User gesture activation
  function onUserInteraction() {
    if (!isCameraActive) startCamera(selectedDeviceId);
  }
  window.addEventListener('click', onUserInteraction, { passive: true });
  window.addEventListener('keydown', onUserInteraction, { passive: true });

  // Clean hardware release
  window.addEventListener('beforeunload', () => {
    if (video && video.srcObject) video.srcObject.getTracks().forEach(t => t.stop());
  });

  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      if (rippleRing) {
        rippleRing.classList.remove('active');
        void rippleRing.offsetWidth;
        rippleRing.classList.add('active');
      }
      showMapScreen();
    });
  }

  startCamera();
}

/* ==========================================================================
   PALM CURSOR, BOUNDARY HOVER & CLOSED PALM SELECTION
   ========================================================================== */
function initMapAndPalmInteraction() {
  const palmCursor = document.getElementById('palm-cursor');
  const palmOpenIcon = palmCursor ? palmCursor.querySelector('.palm-open') : null;
  const palmClosedIcon = palmCursor ? palmCursor.querySelector('.palm-closed') : null;
  const palmLabel = document.getElementById('palm-label');
  const boundaryIndus = document.getElementById('boundary-indus');
  const videoBackBtn = document.getElementById('video-back-btn');
  const expeditionVideo = document.getElementById('expedition-video');
  const videoPlaceholder = document.getElementById('video-placeholder');

  let currentPalmX = window.innerWidth / 2;
  let currentPalmY = window.innerHeight / 2;
  let targetPalmX = window.innerWidth / 2;
  let targetPalmY = window.innerHeight / 2;
  let isPalmClosed = false;
  let isHoveringIndus = false;
  let fistHoldCount = 0;

  // Initialize MediaPipe Hands if library loaded
  let mpHands = null;
  if (typeof Hands !== 'undefined') {
    try {
      mpHands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      mpHands.setOptions({
        maxNumHands: 2,
        modelComplexity: 0,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      mpHands.onResults((results) => {
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
          return;
        }

        // MODE 1: Map Screen - Open Palm cursor tracking & closed fist selection
        if (currentScreen === 'map') {
          const landmarks = results.multiHandLandmarks[0];
          // Palm center: average of wrist (0), index mcp (5), middle mcp (9), pinky mcp (17)
          const avgX = (landmarks[0].x + landmarks[5].x + landmarks[9].x + landmarks[17].x) / 4;
          const avgY = (landmarks[0].y + landmarks[5].y + landmarks[9].y + landmarks[17].y) / 4;

          // Inverted horizontal (mirror camera)
          targetPalmX = (1.0 - avgX) * window.innerWidth;
          targetPalmY = avgY * window.innerHeight;

          // Detect Open Palm vs Closed Fist:
          const wrist = landmarks[0];
          let tipDistSum = 0;
          const tips = [8, 12, 16, 20];

          tips.forEach(tIdx => {
            const dx = landmarks[tIdx].x - wrist.x;
            const dy = landmarks[tIdx].y - wrist.y;
            tipDistSum += Math.sqrt(dx * dx + dy * dy);
          });

          const avgTipDist = tipDistSum / tips.length;
          const closed = avgTipDist < 0.28;
          setPalmState(closed);
        }

        // MODE 2: Video Expedition Screen - Two-Hand Zoom In Gesture on Dancing Girl
        else if (currentScreen === 'video' && walkState === 'dancer_spotted') {
          handleTwoHandZoom(results.multiHandLandmarks);
        }

        // MODE 3: Time Travel Screen - Forearm Rolling Gesture (Clockwise into Past / Anticlockwise to Present)
        else if (currentScreen === 'video' && walkState === 'time_travel') {
          handleForearmRolling(results.multiHandLandmarks);
        }
      });

      function handleTwoHandZoom(landmarksList) {
        if (walkState !== 'dancer_spotted') return;

        if (landmarksList.length >= 2) {
          const h0 = landmarksList[0][0]; // wrist of hand 0
          const h1 = landmarksList[1][0]; // wrist of hand 1
          const dist = Math.hypot(h0.x - h1.x, h0.y - h1.y);

          // Hands initially brought close together
          if (dist < 0.28) {
            twoHandsInitialClose = true;
            twoHandsMinDist = Math.min(twoHandsMinDist, dist);
            const hint = document.querySelector('.zoom-text-hint');
            if (hint) hint.textContent = 'NOW MOVE HANDS APART!';
          } 
          // Hands then spread apart significantly
          else if (twoHandsInitialClose && (dist > 0.44 || dist - twoHandsMinDist > 0.22)) {
            triggerDancerZoom();
          }
        } else if (landmarksList.length === 1) {
          // Single-hand spread fallback (spread fingers wide)
          const lm = landmarksList[0];
          const thumbTip = lm[4];
          const pinkyTip = lm[20];
          const handSpread = Math.hypot(thumbTip.x - pinkyTip.x, thumbTip.y - pinkyTip.y);
          if (handSpread > 0.38) {
            triggerDancerZoom();
          }
        }
      }

      let isProcessingHand = false;
      onFrameProcessed = (videoEl) => {
        const needsHand = (currentScreen === 'map') || (currentScreen === 'video' && (walkState === 'dancer_spotted' || walkState === 'time_travel'));
        if (needsHand && mpHands && !isProcessingHand) {
          isProcessingHand = true;
          mpHands.send({ image: videoEl }).then(() => {
            isProcessingHand = false;
          }).catch(() => {
            isProcessingHand = false;
          });
        }
      };
    } catch (e) {
      console.warn('MediaPipe Hands could not be initialized:', e);
    }
  }

  function setPalmState(closed) {
    if (isPalmClosed === closed) return;
    isPalmClosed = closed;

    if (palmCursor) {
      if (isPalmClosed) {
        palmCursor.classList.add('closed');
        if (palmOpenIcon) palmOpenIcon.classList.add('hidden');
        if (palmClosedIcon) palmClosedIcon.classList.remove('hidden');
        if (palmLabel) palmLabel.textContent = 'Fist / Selected';
      } else {
        palmCursor.classList.remove('closed');
        if (palmOpenIcon) palmOpenIcon.classList.remove('hidden');
        if (palmClosedIcon) palmClosedIcon.classList.add('hidden');
        if (palmLabel) palmLabel.textContent = isHoveringIndus ? 'Close Fist to Select' : 'Open Palm';
      }
    }

    // Trigger selection when closed on Indus Valley
    if (isPalmClosed && isHoveringIndus && currentScreen === 'map') {
      showVideoScreen();
    }
  }

  // Mouse fallback for instant testing: moving mouse moves palm cursor, clicking simulates closing palm
  window.addEventListener('mousemove', (e) => {
    targetPalmX = e.clientX;
    targetPalmY = e.clientY;
  });

  window.addEventListener('mousedown', (e) => {
    if (currentScreen === 'map') {
      setPalmState(true);
    }
  });

  window.addEventListener('mouseup', () => {
    if (currentScreen === 'map') {
      setPalmState(false);
    }
  });

  // Smooth animation loop for palm cursor and collision check
  function palmUpdateLoop() {
    currentPalmX += (targetPalmX - currentPalmX) * 0.18;
    currentPalmY += (targetPalmY - currentPalmY) * 0.18;

    if (palmCursor) {
      palmCursor.style.left = `${currentPalmX}px`;
      palmCursor.style.top = `${currentPalmY}px`;
    }

    // Only process map collisions when on Map Screen
    if (currentScreen === 'map') {
      let inIndusRegion = false;
      if (boundaryIndus) {
        const rect = boundaryIndus.getBoundingClientRect();
        inIndusRegion = (
          currentPalmX >= rect.left - 25 &&
          currentPalmX <= rect.right + 25 &&
          currentPalmY >= rect.top - 25 &&
          currentPalmY <= rect.bottom + 25
        );
      } else {
        const normX = currentPalmX / window.innerWidth;
        const normY = currentPalmY / window.innerHeight;
        inIndusRegion = (normX >= 0.61 && normX <= 0.89 && normY >= 0.22 && normY <= 0.78);
      }

      if (inIndusRegion !== isHoveringIndus) {
        isHoveringIndus = inIndusRegion;
        if (boundaryIndus) {
          if (isHoveringIndus) {
            boundaryIndus.classList.add('active');
            playAncientChime([293.66, 349.23, 440]);
            if (palmLabel && !isPalmClosed) palmLabel.textContent = 'Close Fist to Select';
          } else {
            boundaryIndus.classList.remove('active');
            if (palmLabel && !isPalmClosed) palmLabel.textContent = 'Open Palm';
          }
        }
      }
    }

    requestAnimationFrame(palmUpdateLoop);
  }

  palmUpdateLoop();

  // Return to Map from Video Screen
  if (videoBackBtn) {
    videoBackBtn.addEventListener('click', returnToMap);
  }

  // Expedition Video Events: timeupdate check for dancer sighting
  if (expeditionVideo) {
    expeditionVideo.addEventListener('timeupdate', () => {
      if (currentScreen === 'video' && walkState === 'walking' && expeditionVideo.currentTime >= 12.0) {
        onDancerSpotted();
      }
    });

    expeditionVideo.addEventListener('playing', () => {
      if (videoPlaceholder) videoPlaceholder.classList.add('hidden');
    });
    expeditionVideo.addEventListener('loadeddata', () => {
      if (videoPlaceholder) videoPlaceholder.classList.add('hidden');
    });
    expeditionVideo.addEventListener('error', () => {
      if (videoPlaceholder) videoPlaceholder.classList.remove('hidden');
    });
  }

  // Zoom Prompt Click / Tap Trigger (clicking anywhere on floating gesture)
  const zoomPromptEl = document.getElementById('zoom-prompt');
  if (zoomPromptEl) {
    zoomPromptEl.addEventListener('click', triggerDancerZoom);
  }
  const zoomManualBtn = document.getElementById('zoom-manual-btn');
  if (zoomManualBtn) {
    zoomManualBtn.addEventListener('click', triggerDancerZoom);
  }

  // Dust Video Playback Events
  const dustVideoEl = document.getElementById('dust-video');
  if (dustVideoEl) {
    dustVideoEl.addEventListener('timeupdate', () => {
      if (currentScreen === 'video' && walkState === 'blowing_dust' && dustVideoEl.currentTime >= 9.8) {
        onDustCleared();
      }
    });
    dustVideoEl.addEventListener('ended', () => {
      if (currentScreen === 'video' && walkState === 'blowing_dust') {
        onDustCleared();
      }
    });
  }

  // Dancing Girl Info Video Events
  const dancingGirlVideoEl = document.getElementById('dancing-girl-video');
  if (dancingGirlVideoEl) {
    dancingGirlVideoEl.addEventListener('ended', () => {
      if (currentScreen === 'video' && walkState === 'dancing_girl_info') {
        onDancingGirlEnded();
      }
    });
  }

  // Last Video Events (Journey Complete → Return to Landing)
  const lastVideoEl = document.getElementById('last-video');
  if (lastVideoEl) {
    lastVideoEl.addEventListener('ended', () => {
      if (currentScreen === 'video' && walkState === 'journey_complete') {
        onLastVideoEnded();
      }
    });
  }

  // Museum UI Animation Video Playback & Actions
  const museumVideoEl = document.getElementById('museum-video');
  const museumActionsEl = document.getElementById('museum-actions');

  if (museumVideoEl) {
    const onMuseumFinished = () => {
      if (museumActionsEl) {
        museumActionsEl.classList.remove('hidden');
      }
      if (!museumAutoTimer && walkState === 'museum_display') {
        museumAutoTimer = setTimeout(() => {
          if (currentScreen === 'video' && walkState === 'museum_display') {
            enterTimeTravel();
          }
        }, 3200);
      }
    };

    museumVideoEl.addEventListener('ended', onMuseumFinished);
    museumVideoEl.addEventListener('timeupdate', () => {
      if (museumVideoEl.currentTime >= 5.85) {
        onMuseumFinished();
      }
    });
  }

  const museumTravelBtn = document.getElementById('museum-travel-btn');
  if (museumTravelBtn) {
    museumTravelBtn.addEventListener('click', () => {
      if (museumAutoTimer) clearTimeout(museumAutoTimer);
      enterTimeTravel();
    });
  }

  const museumReplayBtn = document.getElementById('museum-replay-btn');
  if (museumReplayBtn) {
    museumReplayBtn.addEventListener('click', () => {
      if (museumAutoTimer) clearTimeout(museumAutoTimer);
      if (museumVideoEl) {
        if (museumActionsEl) museumActionsEl.classList.add('hidden');
        museumVideoEl.currentTime = 0;
        museumVideoEl.play().catch(() => {});
      }
    });
  }

  const museumBlowBtn = document.getElementById('museum-blow-btn');
  if (museumBlowBtn) {
    museumBlowBtn.addEventListener('click', replayBlow);
  }

  const museumWalkBtn = document.getElementById('museum-walk-btn');
  if (museumWalkBtn) {
    museumWalkBtn.addEventListener('click', replayWalk);
  }

  const museumMapBtn = document.getElementById('museum-map-btn');
  if (museumMapBtn) {
    museumMapBtn.addEventListener('click', returnToMap);
  }

  // Time Travel Floating Gesture Click / Tap fallback (click right side -> forward, click left side -> reverse)
  const ttGestureEl = document.getElementById('timetravel-gesture');
  if (ttGestureEl) {
    ttGestureEl.addEventListener('click', (e) => {
      const rect = ttGestureEl.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX < rect.width * 0.45) {
        startTimeTravelReverse();
      } else {
        startTimeTravelForward();
      }
    });
  }

  // Time Travel Video Events
  const timetravelVideoEl = document.getElementById('timetravel-video');
  const timetravelVideoRevEl = document.getElementById('timetravel-video-reverse');
  if (timetravelVideoEl) {
    timetravelVideoEl.addEventListener('ended', () => {
      timeTravelDirection = 'arrived';
      const pill = document.getElementById('tt-gesture-pill');
      if (pill) pill.textContent = 'Arrived at 2500 BCE (100%)';
      const gesture = document.getElementById('timetravel-gesture');
      if (gesture) gesture.classList.remove('rolling-cw', 'rolling-ccw');
    });
  }
  if (timetravelVideoRevEl) {
    timetravelVideoRevEl.addEventListener('ended', () => {
      timeTravelDirection = 'present';
      const pill = document.getElementById('tt-gesture-pill');
      if (pill) pill.textContent = 'Present Day (0%)';
      const gesture = document.getElementById('timetravel-gesture');
      if (gesture) gesture.classList.remove('rolling-cw', 'rolling-ccw');
    });
  }

  // Interactive Dust Wiping & Blowing (Hold, drag, swipe, or click on screen/gesture)
  const videoScreenEl = document.getElementById('video-screen');
  const blowInstructionEl = document.getElementById('blow-instruction');

  const startWipe = (e) => {
    if (currentScreen === 'video' && walkState === 'blowing_dust') {
      isManualBlowing = true;
    }
  };
  const stopWipe = () => {
    if (isManualBlowing) {
      isManualBlowing = false;
    }
  };
  const handleWipeMove = (e) => {
    if (currentScreen === 'video' && walkState === 'blowing_dust') {
      if (e.buttons === 1 || (e.touches && e.touches.length > 0)) {
        isManualBlowing = true;
      }
    }
  };

  if (videoScreenEl) {
    videoScreenEl.addEventListener('mousedown', startWipe);
    videoScreenEl.addEventListener('mousemove', handleWipeMove);
    videoScreenEl.addEventListener('touchstart', startWipe, { passive: true });
    videoScreenEl.addEventListener('touchmove', handleWipeMove, { passive: true });
  }
  if (blowInstructionEl) {
    blowInstructionEl.addEventListener('mousedown', startWipe);
    blowInstructionEl.addEventListener('touchstart', startWipe, { passive: true });
  }
  window.addEventListener('mouseup', stopWipe);
  window.addEventListener('touchend', stopWipe);

  // Artifact Modal Action Buttons
  const statueBlowBtn = document.getElementById('statue-blow-btn');
  if (statueBlowBtn) {
    statueBlowBtn.addEventListener('click', replayBlow);
  }

  const statueReplayBtn = document.getElementById('statue-replay-btn');
  if (statueReplayBtn) {
    statueReplayBtn.addEventListener('click', replayWalk);
  }

  const statueMapBtn = document.getElementById('statue-map-btn');
  if (statueMapBtn) {
    statueMapBtn.addEventListener('click', returnToMap);
  }

  // Keyboard navigation for walking, zoom, blowing & time travel testing
  window.addEventListener('keydown', (e) => {
    // Quick shortcut: Press 'T' or '4' to immediately enter Time Travel mode with forearm rolling gesture
    if (e.key === 't' || e.key === 'T' || e.key === '4') {
      if (currentScreen !== 'video') {
        const sceneContainer = document.getElementById('scene-container');
        const mapScreen = document.getElementById('map-screen');
        const videoScreen = document.getElementById('video-screen');
        if (sceneContainer) sceneContainer.classList.add('hidden');
        if (mapScreen) mapScreen.classList.add('hidden');
        if (videoScreen) videoScreen.classList.remove('hidden');
        currentScreen = 'video';
      }
      enterTimeTravel();
      return;
    }

    if (currentScreen === 'video') {
      if (walkState === 'walking') {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
          keyboardStepping = true;
          keyboardFast = e.shiftKey;
          updateWalkingPlayback(true, keyboardFast ? 2.5 : 1.5, keyboardFast ? 15 : 8);
        }
      } else if (walkState === 'dancer_spotted') {
        if (e.key === 'z' || e.key === 'Z' || e.key === 'Enter') {
          triggerDancerZoom();
        }
      } else if (walkState === 'blowing_dust') {
        if (e.key === 'b' || e.key === 'B' || e.key === ' ' || e.key === 'Enter') {
          isManualBlowing = true;
        }
      } else if (walkState === 'time_travel') {
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' || e.key === ']' || e.key === '.') {
          startTimeTravelForward();
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' || e.key === '[' || e.key === ',') {
          startTimeTravelReverse();
        } else if (e.key === ' ' || e.key === 'Enter') {
          pauseTimeTravel();
        }
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (currentScreen === 'video') {
      if (walkState === 'walking') {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
          keyboardStepping = false;
          keyboardFast = false;
          updateWalkingPlayback(false, 0, 0);
        }
      } else if (walkState === 'blowing_dust') {
        if (e.key === 'b' || e.key === 'B' || e.key === ' ' || e.key === 'Enter') {
          isManualBlowing = false;
        }
      }
    }
  });

  // Horizontal drag / touch scrub & wheel on screen during Time Travel
  let isTTDragScrubbing = false;
  let lastTTDragX = 0;
  const startTTDrag = (e) => {
    if (currentScreen === 'video' && walkState === 'time_travel') {
      isTTDragScrubbing = true;
      lastTTDragX = e.touches ? e.touches[0].clientX : e.clientX;
    }
  };
  const moveTTDrag = (e) => {
    if (isTTDragScrubbing && currentScreen === 'video' && walkState === 'time_travel') {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - lastTTDragX;
      lastTTDragX = clientX;
      if (deltaX > 2) {
        startTimeTravelForward();
      } else if (deltaX < -2) {
        startTimeTravelReverse();
      }
    }
  };
  const stopTTDrag = () => {
    if (isTTDragScrubbing) {
      isTTDragScrubbing = false;
    }
  };
  window.addEventListener('mousedown', startTTDrag);
  window.addEventListener('mousemove', moveTTDrag);
  window.addEventListener('mouseup', stopTTDrag);
  window.addEventListener('touchstart', startTTDrag, { passive: true });
  window.addEventListener('touchmove', moveTTDrag, { passive: true });
  window.addEventListener('touchend', stopTTDrag);

  window.addEventListener('wheel', (e) => {
    if (currentScreen === 'video' && walkState === 'time_travel') {
      if (e.deltaY > 0) {
        startTimeTravelForward();
      } else if (e.deltaY < 0) {
        startTimeTravelReverse();
      }
    }
  }, { passive: true });

  // Mouse / Touch hold to walk on walking-hud for quick manual testing
  const walkingHudEl = document.getElementById('walking-hud');
  if (walkingHudEl) {
    walkingHudEl.style.pointerEvents = 'auto';
    walkingHudEl.style.cursor = 'pointer';

    const startHold = (e) => {
      if (currentScreen === 'video' && walkState === 'walking') {
        e.preventDefault();
        keyboardStepping = true;
        keyboardFast = e.shiftKey;
        updateWalkingPlayback(true, keyboardFast ? 2.5 : 1.5, keyboardFast ? 15 : 8);
      }
    };

    const stopHold = () => {
      if (keyboardStepping) {
        keyboardStepping = false;
        keyboardFast = false;
        updateWalkingPlayback(false, 0, 0);
      }
    };

    walkingHudEl.addEventListener('mousedown', startHold);
    window.addEventListener('mouseup', stopHold);
    walkingHudEl.addEventListener('touchstart', startHold, { passive: false });
    window.addEventListener('touchend', stopHold);
  }
}
