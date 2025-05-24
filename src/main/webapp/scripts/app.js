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
