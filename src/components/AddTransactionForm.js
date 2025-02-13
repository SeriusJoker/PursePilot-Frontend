import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

function AddTransactionForm({ onTransactionAdded }) {
  const [show, setShow] = useState(false);
  const [transactionData, setTransactionData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: '',
    description: '',
    frequency: 'once',
  });

  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    setTransactionData({ ...transactionData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setTransactionData({
      amount: '',
      type: 'expense',
      category: '',
      date: '',
      description: '',
      frequency: 'once',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure onTransactionAdded is a function before calling it
    if (typeof onTransactionAdded !== 'function') {
      console.error("onTransactionAdded is not a function");
      return;
    }

    // Validate required fields
    if (!transactionData.amount || !transactionData.category || !transactionData.date) {
      console.error("Missing required transaction fields");
      return;
    }

    console.log("Submitting Transaction:", transactionData);

    onTransactionAdded(transactionData);
    handleClose();
  };

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        ➕ Add Transaction
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" name="amount" value={transactionData.amount} onChange={handleChange} required />
            </Form.Group>

            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Select name="type" value={transactionData.type} onChange={handleChange}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" name="category" value={transactionData.category} onChange={handleChange} required />
            </Form.Group>

            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" value={transactionData.date} onChange={handleChange} required />
            </Form.Group>

            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" name="description" value={transactionData.description} onChange={handleChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Frequency</Form.Label>
              <Form.Select name="frequency" value={transactionData.frequency} onChange={handleChange}>
                <option value="once">One-time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddTransactionForm;
