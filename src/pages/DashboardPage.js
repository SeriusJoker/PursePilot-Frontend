import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchTransactions } from '../services/api'; // Presumably uses JWT in headers
import TransactionTable from '../components/TransactionTable';
import AddTransactionForm from '../components/AddTransactionForm';
import FinanceSummary from '../components/FinanceSummary';
import CategoryPieChart from '../components/CategoryPieChart';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, incomeCategories: {}, expenseCategories: {} });
  const [filterBy, setFilterBy] = useState('monthly');
  const navigate = useNavigate();

  // ✅ Check authentication using JWT
  useEffect(() => {
    async function checkAuth() {
      // 1. Grab token from localStorage
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.error("No JWT token found in localStorage");
        navigate('/'); // Redirect to login
        return;
      }

      try {
        // 2. Send token in Authorization header
        const response = await fetch(`${API_BASE_URL}/api/auth/check`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Not authenticated');
        // If everything is fine, you can set user state or do nothing
        console.log('User is authenticated (JWT check passed).');
      } catch (error) {
        console.error('User is not authenticated (JWT failed):', error);
        localStorage.removeItem('jwtToken'); // Clear any invalid token
        navigate('/'); // Redirect to login
      }
    }
    checkAuth();
  }, [navigate]);

  // ✅ Load transactions
  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await fetchTransactions(); // This uses JWT (in api.js)
        console.log("🚀 Transactions received in Dashboard:", data);
        setTransactions(data);
        updateSummary(data, filterBy);
      } catch (error) {
        console.error("❌ Error fetching transactions:", error);
      }
    }
    loadTransactions();
  }, [filterBy]);

  // (The rest of your code is unchanged)
  const convertTransactionAmount = (amount, frequency, filter) => {
    const conversionRates = {
      yearly: { yearly: 1, quarterly: 1 / 4, monthly: 1 / 12, weekly: 1 / 52, daily: 1 / 365 },
      quarterly: { yearly: 4, quarterly: 1, monthly: 1 / 3, weekly: 1 / 13, daily: 1 / 91 },
      monthly: { yearly: 12, quarterly: 3, monthly: 1, weekly: 1 / 4, daily: 1 / 30 },
      weekly: { yearly: 52, quarterly: 13, monthly: 4, weekly: 1, daily: 1 / 7 },
      daily: { yearly: 365, quarterly: 91, monthly: 30, weekly: 7, daily: 1 },
    };

    if (frequency === 'once' || frequency === filter) return amount;
    const convertedAmount = amount * (conversionRates[frequency]?.[filter] || 1);
    console.log(`🔄 Converting ${amount} from ${frequency} to ${filter}: ${convertedAmount}`);
    return convertedAmount;
  };

  const updateSummary = (data, filter) => {
    let totalIncome = 0;
    let totalExpenses = 0;
    const incomeCategories = {};
    const expenseCategories = {};

    data.forEach((txn) => {
      const adjustedAmount = convertTransactionAmount(txn.amount, txn.frequency, filter);
      if (txn.type === 'income') {
        totalIncome += adjustedAmount;
        incomeCategories[txn.category] = (incomeCategories[txn.category] || 0) + adjustedAmount;
      } else if (txn.type === 'expense') {
        totalExpenses += adjustedAmount;
        expenseCategories[txn.category] = (expenseCategories[txn.category] || 0) + adjustedAmount;
      }
    });

    console.log(`✅ Updated Summary - Total Income: ${totalIncome}, Total Expenses: ${totalExpenses} (Filtered by: ${filter})`);
    setSummary({ totalIncome, totalExpenses, incomeCategories, expenseCategories });
  };

  const handleFilterChange = (e) => {
    setFilterBy(e.target.value);
    updateSummary(transactions, e.target.value);
  };

  return (
    <Container className="mt-5">
      <h1>Dashboard</h1>
      <AddTransactionForm />

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

      <TransactionTable transactions={transactions} />
    </Container>
  );
}

export default DashboardPage;
