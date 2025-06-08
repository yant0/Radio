import { fetchStations, searchStations } from './stations.js';
import { setupModal } from './auth/modal.js';
import { setupLogin } from './auth/login.js';
import { setupRegister } from './auth/register.js';
import { checkLoginStatus } from './auth/session.js';

window.onload = fetchStations;
document.getElementById('searchInput').addEventListener('change', searchStations);

document.addEventListener('DOMContentLoaded', () => {
    setupModal();
    setupLogin();
    setupRegister();
    checkLoginStatus();
});

// In your app.js or a <script> tag
function updateStickyTopOffset() {
    const topBar = document.querySelector('.top-bar');
    const playerPanel = document.querySelector('#playerPanel');

    if (topBar && playerPanel) {
        const topBarBottom = topBar.getBoundingClientRect().bottom + window.scrollY;
        const extraOffset = 16;
        playerPanel.style.top = `${topBarBottom + extraOffset}px`;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const playerPanel = document.querySelector('#playerPanel');
    playerPanel.style.position = 'sticky';
    updateStickyTopOffset();
});

window.addEventListener('resize', updateStickyTopOffset);
