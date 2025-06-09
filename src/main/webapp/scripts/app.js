import { fetchStations, searchStations } from './stations.js';
import { setupModal } from './auth/modal.js';
import { setupLogin } from './auth/login.js';
import { setupRegister } from './auth/register.js';
import { checkLoginStatus } from './auth/session.js';

window.fetchStations = fetchStations;
window.onload = fetchStations;
document.getElementById('searchInput').addEventListener('change', searchStations);

document.addEventListener('DOMContentLoaded', () => {
    setupModal();
    setupLogin();
    setupRegister();
    checkLoginStatus();
});

// In your app.js or a <script> tag
function adjustPlayerOffset() {
    const playerPanel = document.getElementById('playerPanel');
    const topBar = document.querySelector('.top-bar');

    // Only apply offset on wider screens
    if (window.innerWidth > 768) {
        const topBarHeight = topBar.offsetHeight;
        playerPanel.style.top = `${topBarHeight + 16}px`; // 16px = 1rem spacing
        playerPanel.style.position = 'sticky';
    } else {
        // Reset for mobile
        playerPanel.style.top = '';
        playerPanel.style.position = '';
    }
}

// Call on load and resize
window.addEventListener('DOMContentLoaded', adjustPlayerOffset);
window.addEventListener('resize', adjustPlayerOffset);
