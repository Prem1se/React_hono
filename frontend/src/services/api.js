const API_BASE = '/api';

const getToken = () => localStorage.getItem('token');

const request = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Ошибка сервера');
  }

  return data;
};

// Auth API
export const authAPI = {
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  register: (email, password) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  me: () => request('/auth/me'),
  forgotPassword: (email) => request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
  resetPassword: (email, code, newPassword) => request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, code, newPassword })
  })
};

// Products API
export const productsAPI = {
  getAll: () => request('/products'),
  getById: (id) => request(`/products/${id}`),
  getByCategory: (category) => request(`/products/category/${category}`),
  getPopular: () => request('/products/popular'),
  getCategories: () => request('/products/categories/list'),
  search: (query) => request(`/products/search?q=${encodeURIComponent(query)}`),
  create: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/products/${id}`, { method: 'DELETE' })
};

// Cart API
export const cartAPI = {
  get: () => request('/cart'),
  add: (productId, quantity = 1) => 
    request('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  update: (productId, quantity) => 
    request(`/cart/${productId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  remove: (productId) => 
    request(`/cart/${productId}`, { method: 'DELETE' }),
  clear: () => request('/cart', { method: 'DELETE' })
};


// Orders API
export const ordersAPI = {
  create: (orderData) => 
    request('/orders', { 
      method: 'POST', 
      body: JSON.stringify(orderData)
    }),
  getAll: () => request('/orders'),
  getById: (id) => request(`/orders/${id}`)
};

// Admin API
export const adminAPI = {
  getUsers: () => request('/admin/users'),
  getOrders: () => request('/admin/orders'),
  getUserOrders: (userId) => request(`/admin/users/${userId}/orders`),
  getStats: () => request('/admin/stats')
};


export default request;