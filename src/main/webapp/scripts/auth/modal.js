export function setupModal() {
    const modal = document.getElementById('modal');
    const openModalBtn = document.getElementById('openModalBtn');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    openModalBtn.addEventListener('click', () => {
        modal.classList.add('active');
        showLogin();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    loginTab.addEventListener('click', showLogin);
    registerTab.addEventListener('click', showRegister);

    function showLogin() {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    }

    function showRegister() {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}
