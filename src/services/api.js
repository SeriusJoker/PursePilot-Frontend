import axios from 'axios';

// ✅ Correct the API base URL (no extra `/api`)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const fetchTransactions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/transactions`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

export const addTransaction = async (transactionData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/transactions`, transactionData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error adding transaction:", error);
    return null;
  }
};

export const deleteTransaction = async (transactionId) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/transactions/${transactionId}`, { withCredentials: true });
    return true;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return false;
  }
};

export const updateTransaction = async (transactionId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/transactions/${transactionId}`, updatedData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error updating transaction:", error);
    return null;
  }
};
