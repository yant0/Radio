import { checkLoginStatus } from './session.js';

export function setupLogin() {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(loginForm);
        const data = new URLSearchParams(formData);

        try {
            const res = await fetch('login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data
            });

            const text = await res.json();
            loginMessage.textContent = text.message;
            loginMessage.style.color = res.ok ? 'green' : 'red';
            if (res.ok) checkLoginStatus();
        } catch {
            loginMessage.textContent = 'Server error.';
            loginMessage.style.color = 'red';
        }
    });
}
