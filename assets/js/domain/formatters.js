export function formatTime(ms) {
const seconds = Math.floor(ms / 1000);
const minutes = Math.floor(seconds / 60);
const remainingSeconds = seconds % 60;
return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}


export function clamp01(x) {
return Math.max(0, Math.min(1, x));
}