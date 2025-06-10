import { fetchStations, searchStations, searchStationsByLocale, searchStationsByCountry } from './stations.js';
import { checkLoginStatus } from './auth/session.js';

document.addEventListener('DOMContentLoaded', () => {
    fetchStations()
    adjustPlayerOffset()
    checkLoginStatus();

    const countryButtons = document.querySelectorAll('.country-btn');
    countryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const country = btn.getAttribute('data-country');
            if (!country) return;

            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            searchStationsByCountry(country);
        });
    });

});

window.addEventListener('resize', adjustPlayerOffset);

document.getElementById('title-bar').addEventListener('click', fetchStations);
document.getElementById('popular').addEventListener('click', fetchStations);
document.getElementById('localBtn').addEventListener('click', searchStationsByLocale);
document.getElementById('searchInput').addEventListener('change', searchStations);

// todo move this
function adjustPlayerOffset() {
    const sideSection = document.getElementById('side-sections');
    const topBar = document.querySelector('.top-bar');

    if (window.innerWidth > 768) {
        const topBarHeight = topBar.offsetHeight;
        sideSection.style.top = `${topBarHeight + 32}px`;
        sideSection.style.position = 'sticky';
    } else {
        // Reset for mobile
        sideSection.style.top = '';
        sideSection.style.position = '';
    }
}

