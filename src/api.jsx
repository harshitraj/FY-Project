const API_BASE_URL = 'http://localhost:5000/api';

async function post(endpoint, data, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  return response.json();
}

async function get(endpoint, token = null) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers,
  });
  return response.json();
}

export { post, get };
