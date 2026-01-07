// Authentication Functions
function initAuth() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const alertDiv = document.getElementById('loginAlert');

      try {
        const response = await login(email, password);
        
        // Store token and user
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        alertDiv.innerHTML = '<div class="alert alert-success">Login successful! Redirecting...</div>';
        
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      } catch (err) {
        alertDiv.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      const alertDiv = document.getElementById('registerAlert');

      try {
        await register(email, password, name);
        
        alertDiv.innerHTML = '<div class="alert alert-success">Registration successful! Please login.</div>';
        
        // Switch to login tab
        setTimeout(() => {
          const loginTab = new bootstrap.Tab(document.getElementById('login-tab'));
          loginTab.show();
          registerForm.reset();
        }, 1500);
      } catch (err) {
        alertDiv.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
      }
    });
  }

  updateAuthUI();
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}

// Update UI based on login status
function updateAuthUI() {
  const authNav = document.getElementById('authNav');
  const logoutNav = document.getElementById('logoutNav');
  const ordersNav = document.getElementById('ordersNav');
  const userNav = document.getElementById('userNav');
  
  if (isLoggedIn()) {
    if (authNav) authNav.style.display = 'none';
    if (logoutNav) logoutNav.style.display = 'block';
    if (ordersNav) ordersNav.style.display = 'block';
    if (userNav) {
      userNav.style.display = 'block';
      const user = getUser();
      document.getElementById('userEmail').textContent = user.name || user.email;
    }
  } else {
    if (authNav) authNav.style.display = 'block';
    if (logoutNav) logoutNav.style.display = 'none';
    if (ordersNav) ordersNav.style.display = 'none';
    if (userNav) userNav.style.display = 'none';
  }
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  window.location.href = 'index.html';
}

// Add logout button listener
if (document.getElementById('logoutBtn')) {
  document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}


