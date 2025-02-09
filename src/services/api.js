import axios from 'axios';

// ✅ Fetch all transactions
export const fetchTransactions = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/transactions', { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

export const addTransaction = async (transactionData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/transactions', transactionData, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error adding transaction:", error);
      return null;
    }
  };

  export const deleteTransaction = async (transactionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${transactionId}`, { withCredentials: true });
      return true;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      return false;
    }
  };
  
  export const updateTransaction = async (transactionId, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/transactions/${transactionId}`, updatedData, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error updating transaction:", error);
      return null;
    }
  };
  
  export const getTransactionSummary = (transactions) => {
    const summary = {
      totalIncome: 0,
      totalExpenses: 0,
      categories: {}
    };
  
    transactions.forEach((txn) => {
      if (txn.type === 'income') {
        summary.totalIncome += txn.amount;
      } else if (txn.type === 'expense') {
        summary.totalExpenses += txn.amount;
        if (txn.category) {
          summary.categories[txn.category] = (summary.categories[txn.category] || 0) + txn.amount;
        } else {
          summary.categories["Uncategorized"] = (summary.categories["Uncategorized"] || 0) + txn.amount;
        }
      }
    });
  
    return summary;
  };
