import { setupLogin } from "./login.js";
import { setupRegister } from "./register.js";
import { loadFavoriteStations } from "../loadFavorites.js";
import { setupModal } from "./modal.js"

export function checkLoginStatus() {
    fetch('session-info')
        .then(res => res.json())
        .then(data => {
            const header = document.querySelector('.top-bar');
            const loginBtn = document.getElementById('openModalBtn');

            if (data.loggedIn) {
                // Remove the login button
                loginBtn.remove();

                // Create user info container
                const userInfoContainer = document.createElement('div');
                userInfoContainer.className = 'user-info';
                userInfoContainer.style.display = 'flex';
                userInfoContainer.style.alignItems = 'center';
                userInfoContainer.style.gap = '10px';

                // Username display
                const usernameSpan = document.createElement('span');
                usernameSpan.id = 'usernameDisplay';
                usernameSpan.textContent = data.username;

                // Logout button
                const logoutBtn = document.createElement('button');
                logoutBtn.id = 'logoutBtn';
                logoutBtn.textContent = 'Logout';
                logoutBtn.addEventListener('click', logout);

                // Assemble
                userInfoContainer.appendChild(usernameSpan);
                userInfoContainer.appendChild(logoutBtn);
                header.appendChild(userInfoContainer);

                // Load favorites
                loadFavoriteStations();
            } else {
                setupModal();
                setupLogin();
                setupRegister();
            }
        });
}


function logout() {
    fetch('logout', { method: 'POST' }).then(() => location.reload());
}
