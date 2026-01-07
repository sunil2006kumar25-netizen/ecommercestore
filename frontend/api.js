// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Check if user is logged in
function isLoggedIn() {
  return !!getToken();
}

// Get user from localStorage
function getUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// API Functions
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const token = getToken();
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return await response.json();
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
}

// Auth API
async function register(email, password, name) {
  return apiCall('/auth/register', 'POST', { email, password, name });
}

async function login(email, password) {
  return apiCall('/auth/login', 'POST', { email, password });
}

// Products API
async function getProducts() {
  return apiCall('/products');
}

async function getProductById(id) {
  return apiCall(`/products/${id}`);
}

async function getProductsByCategory(category) {
  return apiCall(`/products/category/${category}`);
}

// Orders API
async function createOrder(items) {
  return apiCall('/orders', 'POST', { items });
}

async function getUserOrders() {
  return apiCall('/orders');
}

async function getOrderById(id) {
  return apiCall(`/orders/${id}`);
}
