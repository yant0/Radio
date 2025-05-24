export function setupRegister() {
    document.getElementById("registerForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = this.querySelector('input[placeholder="Username"]').value;
        const email = this.querySelector('input[placeholder="Email"]').value;
        const password = this.querySelector('input[placeholder="Password"]').value;

        const res = await fetch("register", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ username, email, password })
        });

        const msg = document.createElement("div");
        if (res.ok) {
            const data = await res.json();
            msg.textContent = data.message;
            msg.style.color = "green";
        } else {
            const data = await res.json();
            msg.textContent = data.message;
            msg.style.color = "red";
        }

        this.appendChild(msg);
    });
}
