const byId = id => document.getElementById(id);
const room = byId('musicRoom');
const audio = byId('musicAudio');
const toggle = byId('musicToggle');
const mini = byId('musicMini');
const miniToggle = byId('musicMiniToggle');
const open = byId('musicOpen');
const volume = byId('musicVolume');
const level = byId('musicLevel');
const seek = byId('musicSeek');
const elapsed = byId('musicElapsed');
const duration = byId('musicDuration');
const status = byId('musicStatus');
const shuffle = byId('musicShuffle');
const repeat = byId('musicRepeat');
const prev = byId('musicPrev');
const next = byId('musicNext');
const list = byId('musicTracks');
const catalog = new URL('./music/tracks.json', import.meta.url);

let context;
let gain;
let openedPlayback = false;

function preference(name, value) {
  try {
    const key = 'eohyeong.music.' + name;
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch {
    // Playback also works when browser storage is unavailable.
  }
}

function showStatus(message = '') {
  status.textContent = message;
  status.hidden = !message;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '–:–';
  return Math.floor(seconds / 60) + ':' + String(Math.floor(seconds % 60)).padStart(2, '0');
}

function updateVolume() {
  const value = Number(volume.value);
  level.value = value + '%';
  volume.setAttribute('aria-valuetext', level.value);
  volume.style.setProperty('--progress', value + '%');
  if (gain) gain.gain.value = value / 100;
  else audio.volume = value / 100;
}

async function play() {
  showStatus();
  try {
    if (!context && window.AudioContext) {
      // Gain also supports in-page volume control on mobile Safari.
      context = new AudioContext();
      gain = context.createGain();
      context.createMediaElementSource(audio).connect(gain).connect(context.destination);
      audio.volume = 1;
      updateVolume();
    }
    await Promise.all([context?.resume(), audio.play()]);
  } catch (error) {
    if (error.name !== 'AbortError') showStatus('음악을 재생할 수 없습니다. 다시 시도해 주세요.');
  }
}

function togglePlayback() {
  if (audio.paused) void play();
  else audio.pause();
}

function updatePlayback() {
  const playing = !audio.paused;
  if (playing) openedPlayback = true;
  const label = playing ? '일시정지' : '재생';
  room.classList.toggle('music-playing', playing);
  toggle.setAttribute('aria-label', label);
  toggle.title = label;
  miniToggle.setAttribute('aria-label', label);
  miniToggle.textContent = playing ? 'Ⅱ' : '▶';
  byId('musicMiniState').textContent = playing ? '재생 중' : '일시정지';
  byId('musicState').textContent = playing ? '지금 재생 중' : openedPlayback ? '일시정지' : '재생 준비';
  mini.hidden = !room.hidden || !openedPlayback;
}

function updateToggle(button, active) {
  button.setAttribute('aria-pressed', String(active));
}

async function init() {
  const response = await fetch(catalog);
  if (!response.ok) throw new Error('Music catalog unavailable');
  const tracks = await response.json();
  if (!tracks.length) throw new Error('Music catalog is empty');
  const wave = byId('musicWave');
  for (let index = 0; index < 45; index++) {
    const bar = document.createElement('i');
    const height = 7 + Math.abs(Math.sin(index * 0.34) * Math.cos(index * 1.15)) * 43;
    bar.style.setProperty('--height', height.toFixed(1) + 'px');
    bar.style.setProperty('--delay', (index % 7) * -0.11 + 's');
    wave.appendChild(bar);
  }

  let current = -1;
  let shuffled = preference('shuffle') === 'true';
  const backStack = [];
  audio.loop = preference('repeat') !== 'false';
  updateToggle(shuffle, shuffled);
  updateToggle(repeat, audio.loop);
  volume.value = preference('volume') ?? volume.value;
  updateVolume();

  const rows = tracks.map(({ title, duration: seconds }, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    const icon = document.createElement('span');
    icon.className = 'music-track-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = ['☾', '✿', '✦'][index % 3];
    const name = document.createElement('span');
    name.className = 'music-track-name';
    name.textContent = title;
    const time = document.createElement('span');
    time.className = 'music-track-time';
    time.textContent = formatTime(seconds);
    button.append(icon, name, time);
    button.addEventListener('click', () => {
      if (current === index) togglePlayback();
      else selectTrack(index, true);
    });
    item.appendChild(button);
    list.appendChild(item);
    return button;
  });

  function updateTime() {
    const total = Number.isFinite(audio.duration) ? audio.duration : tracks[current].duration;
    elapsed.textContent = formatTime(audio.currentTime);
    duration.textContent = formatTime(total);
    seek.max = total || 0;
    seek.value = audio.currentTime;
    seek.disabled = !Number.isFinite(audio.duration);
    seek.setAttribute('aria-valuetext', elapsed.textContent + ' / ' + duration.textContent);
    seek.style.setProperty('--progress', (total ? audio.currentTime / total * 100 : 0) + '%');
  }

  function selectTrack(index, start, remember = true) {
    if (index !== current) {
      if (current >= 0) {
        if (remember) backStack.push(current);
        rows[current].removeAttribute('aria-current');
      }
      current = index;
      const { title, file } = tracks[current];
      rows[current].setAttribute('aria-current', 'true');
      byId('musicTitle').textContent = title;
      open.textContent = title;
      audio.src = new URL(file, catalog).href;
      preference('track', file);
      showStatus();
      updateTime();
    }
    if (start) void play();
  }

  function nextTrack() {
    const step = shuffled && tracks.length > 1 ? 1 + Math.floor(Math.random() * (tracks.length - 1)) : 1;
    return (current + step) % tracks.length;
  }

  selectTrack(Math.max(0, tracks.findIndex(({ file }) => file === preference('track'))), false);
  [toggle, shuffle, repeat, prev, next].forEach(button => { button.disabled = false; });
  toggle.addEventListener('click', togglePlayback);
  miniToggle.addEventListener('click', togglePlayback);
  open.addEventListener('click', () => document.querySelector('[data-view="music"]').click());
  new MutationObserver(updatePlayback).observe(room, { attributes: true, attributeFilter: ['hidden'] });
  shuffle.addEventListener('click', () => {
    shuffled = !shuffled;
    updateToggle(shuffle, shuffled);
    preference('shuffle', shuffled);
  });
  repeat.addEventListener('click', () => {
    audio.loop = !audio.loop;
    updateToggle(repeat, audio.loop);
    preference('repeat', audio.loop);
  });
  prev.addEventListener('click', () => {
    const previous = backStack.pop() ?? (current + tracks.length - 1) % tracks.length;
    selectTrack(previous, !audio.paused, false);
  });
  next.addEventListener('click', () => selectTrack(nextTrack(), !audio.paused));
  seek.addEventListener('input', () => {
    audio.currentTime = Number(seek.value);
    updateTime();
  });
  volume.addEventListener('input', () => {
    updateVolume();
    preference('volume', volume.value);
  });
  for (const event of ['loadedmetadata', 'durationchange', 'timeupdate', 'emptied']) {
    audio.addEventListener(event, updateTime);
  }
  audio.addEventListener('play', updatePlayback);
  audio.addEventListener('pause', updatePlayback);
  audio.addEventListener('ended', () => selectTrack(nextTrack(), true));
  audio.addEventListener('error', () => {
    updatePlayback();
    showStatus('음악 파일을 불러올 수 없습니다.');
  });
  updatePlayback();
}

init().catch(() => {
  byId('musicTitle').textContent = '곡 목록을 불러올 수 없습니다';
  showStatus('페이지를 새로고침한 뒤 다시 시도해 주세요.');
});
