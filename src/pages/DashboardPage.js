import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchTransactions, getTransactionSummary } from '../services/api';
import TransactionTable from '../components/TransactionTable';
import AddTransactionForm from '../components/AddTransactionForm';
import FinanceSummary from '../components/FinanceSummary';
import CategoryPieChart from '../components/CategoryPieChart';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, incomeCategories: {}, expenseCategories: {} });
  const [filterBy, setFilterBy] = useState('monthly'); // ✅ Default filter is 'monthly'
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/check`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Not authenticated');
      } catch (error) {
        console.error('User is not authenticated:', error);
        navigate('/'); // Redirect back to login
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
        updateSummary(data, filterBy); // ✅ Update summary based on filter
      } catch (error) {
        console.error("❌ Error fetching transactions:", error);
      }
    }
    loadTransactions();
  }, [filterBy]); // ✅ Recalculate when filter changes

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
