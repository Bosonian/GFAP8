// Entry: PWA registration + app bootstrap
import App from './app.js';


// PWA: register service worker if supported
if ('serviceWorker' in navigator) {
window.addEventListener('load', () => {
navigator.serviceWorker.register('./service-worker.js')
.catch((err) => console.warn('SW registration failed:', err));
});
}


// Initialize app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
App.init();
});