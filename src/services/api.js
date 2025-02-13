import axios from 'axios';

// ✅ Correct the API base URL (no extra `/api`)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// ✅ Helper function to get JWT from localStorage (Ensures no null values)
const getToken = () => {
  const token = localStorage.getItem('jwtToken');
  return token ? `Bearer ${token}` : null;
};

// ✅ Function to fetch transactions
export const fetchTransactions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/transactions`, {
      headers: { Authorization: getToken() },
    });
    return response.data;
  } catch (error) {
    handleAuthError(error);
    return [];
  }
};

// ✅ Function to add a new transaction
export const addTransaction = async (transactionData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/transactions`, transactionData, {
      headers: { Authorization: getToken() },
    });
    return response.data;
  } catch (error) {
    handleAuthError(error);
    return null;
  }
};

// ✅ Function to delete a transaction
export const deleteTransaction = async (transactionId) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/transactions/${transactionId}`, {
      headers: { Authorization: getToken() },
    });
    return true;
  } catch (error) {
    handleAuthError(error);
    return false;
  }
};

// ✅ Function to update a transaction
export const updateTransaction = async (transactionId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/transactions/${transactionId}`, updatedData, {
      headers: { Authorization: getToken() },
    });
    return response.data;
  } catch (error) {
    handleAuthError(error);
    return null;
  }
};

// ✅ Function to check authentication status
export const checkAuth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth/check`, {
      headers: { Authorization: getToken() },
    });
    return response.data;
  } catch (error) {
    handleAuthError(error);
    return null;
  }
};

// ✅ Function to handle unauthorized responses
const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    console.warn("⚠️ Unauthorized request! Redirecting to login...");
    localStorage.removeItem('jwtToken'); // Clear token
    window.location.href = '/login'; // Redirect to login
  } else {
    console.error("Error:", error);
  }
};
