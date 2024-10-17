// api.js
const API_URL = 'https://layoutgenerator.onrender.com';

export const getLayouts = async () => {
  const response = await fetch(`${API_URL}/layouts`);
  return response.json();
};

export const getLayout = async (id) => {
  const response = await fetch(`${API_URL}/layouts/${id}`);
  return response.json();
};

export const createLayout = async (layout) => {
  const response = await fetch(`${API_URL}/layouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(layout),
  });
  return response.json();
};

export const updateLayout = async (layout) => {
  const response = await fetch(`${API_URL}/layouts/${layout._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(layout),
  });
  return response.json();
};

export const deleteLayout = async (id) => {
  await fetch(`${API_URL}/layouts/${id}`, { method: 'DELETE' });
};