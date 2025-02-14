import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchTransactions, addTransaction, updateTransaction, deleteTransaction } from '../services/api';
import TransactionTable from '../components/TransactionTable';
import AddTransactionForm from '../components/AddTransactionForm';
import FinanceSummary from '../components/FinanceSummary';
import CategoryPieChart from '../components/CategoryPieChart';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, incomeCategories: {}, expenseCategories: {} });
  const [filterBy, setFilterBy] = useState('monthly');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('jwtToken', token);
      navigate('/dashboard', { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.error("No JWT token found in localStorage");
        navigate('/');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/check`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Not authenticated');
        console.log('User is authenticated (JWT check passed).');
      } catch (error) {
        console.error('User is not authenticated (JWT failed):', error);
        localStorage.removeItem('jwtToken');
        navigate('/');
      }
    }
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await fetchTransactions();
        console.log("🚀 Transactions received in Dashboard:", data);
        setTransactions(data);
        updateSummary(data, filterBy);
      } catch (error) {
        console.error("❌ Error fetching transactions:", error);
      }
    }
    loadTransactions();
  }, [filterBy]);

  const handleAddTransaction = async (transactionData) => {
    try {
      const newTransaction = await addTransaction(transactionData);
      if (newTransaction) {
        console.log("✅ Transaction added:", newTransaction);
        setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
        updateSummary([...transactions, newTransaction], filterBy);
      } else {
        console.error("❌ Failed to add transaction");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleUpdateTransaction = async (transactionId, updatedData) => {
    try {
      const updatedTransaction = await updateTransaction(transactionId, updatedData);
      if (updatedTransaction) {
        console.log("✅ Transaction updated:", updatedTransaction);
        setTransactions(prevTransactions => 
          prevTransactions.map(txn => txn._id === transactionId ? updatedTransaction : txn)
        );
        updateSummary([...transactions.map(txn => txn._id === transactionId ? updatedTransaction : txn)], filterBy);
      } else {
        console.error("❌ Failed to update transaction");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      const response = await deleteTransaction(transactionId);
      if (response) {
        console.log("✅ Transaction deleted:", transactionId);
        setTransactions(prevTransactions => prevTransactions.filter(txn => txn._id !== transactionId));
        updateSummary(transactions.filter(txn => txn._id !== transactionId), filterBy);
      } else {
        console.error("❌ Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <Container className="mt-5">
      <h1>Dashboard</h1>
      <AddTransactionForm onTransactionAdded={handleAddTransaction} />

      <Row className="my-4">
        <Col>
          <FinanceSummary totalIncome={summary.totalIncome} totalExpenses={summary.totalExpenses} />
        </Col>
      </Row>

      <Row className="my-3">
        <Col md={4}>
          <Form.Label>Filter By:</Form.Label>
          <Form.Select value={filterBy} onChange={handleFilterChange}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="my-4 text-center">
        <Col md={6} className="d-flex flex-column align-items-center">
          <CategoryPieChart categoryData={summary.incomeCategories} title="Income" />
        </Col>
        <Col md={6} className="d-flex flex-column align-items-center">
          <CategoryPieChart categoryData={summary.expenseCategories} title="Expenses" />
        </Col>
      </Row>

      <TransactionTable transactions={transactions} onUpdateTransaction={handleUpdateTransaction} onDeleteTransaction={handleDeleteTransaction} />
    </Container>
  );
}

export default DashboardPage;
