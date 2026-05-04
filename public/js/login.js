document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const messageBox = document.getElementById('messageBox');

  loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value;

    if (!username || !password) {
      messageBox.textContent = 'Username and password are required.';
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (!response.ok) {
        messageBox.textContent = data.error || 'Login failed.';
        return;
      }

      localStorage.setItem('vulnweb.username', data.username || username);
      messageBox.textContent = data.message || 'Login successful.';
      setTimeout(() => {
        window.location.href = './index.html';
      }, 800);
    } catch (error) {
      messageBox.textContent = 'Unable to login at this time.';
    }
  });
});
