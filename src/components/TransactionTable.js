import React, { useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

function TransactionTable({ transactions, onTransactionDeleted, onTransactionUpdated }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  // Handle the delete button
  const handleDelete = (transactionId) => {
    // Instead of calling deleteTransaction here, we call the parent's callback
    // The parent will delete from the backend and update the UI
    onTransactionDeleted(transactionId);
  };

  // When user clicks the edit button
  const handleEditClick = (transaction) => {
    setCurrentTransaction(transaction);
    setShowEditModal(true);
  };

  // Track changes in the edit form
  const handleEditChange = (e) => {
    setCurrentTransaction((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit the edit form
  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Call the parent's callback with the updated transaction
    // The parent will update the backend, then refresh or adjust the UI
    onTransactionUpdated(currentTransaction);
    setShowEditModal(false);
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Frequency</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn._id}>
              <td>{new Date(txn.date).toLocaleDateString()}</td>
              <td>{txn.category}</td>
              <td>{txn.type}</td>
              <td>${txn.amount}</td>
              <td>{txn.frequency}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEditClick(txn)}>
                  ✏️ Edit
                </Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(txn._id)}>
                  🗑 Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Transaction Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentTransaction && (
            <Form onSubmit={handleEditSubmit}>
              <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={currentTransaction.amount}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Select name="type" value={currentTransaction.type} onChange={handleEditChange}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={currentTransaction.category}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={currentTransaction.date.split('T')[0]}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={currentTransaction.description}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Frequency</Form.Label>
                <Form.Select
                  name="frequency"
                  value={currentTransaction.frequency}
                  onChange={handleEditChange}
                >
                  <option value="once">One-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </Form.Select>
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">
                ✅ Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default TransactionTable;
