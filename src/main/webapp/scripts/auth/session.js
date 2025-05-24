export function checkLoginStatus() {
    fetch('session-info')
        .then(res => res.json())
        .then(data => {
            const loginBtn = document.getElementById('openModalBtn');
            if (data.loggedIn) {
                loginBtn.textContent = data.username;
                loginBtn.onclick = null;

                const logoutBtn = document.createElement('button');
                logoutBtn.id = 'logoutBtn';
                logoutBtn.textContent = 'Logout';
                logoutBtn.addEventListener('click', logout);
                loginBtn.parentNode.insertBefore(logoutBtn, loginBtn);
            }
        });
}

function logout() {
    fetch('logout', { method: 'POST' }).then(() => location.reload());
}
