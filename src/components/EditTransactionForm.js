import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { updateTransaction } from '../services/api';

function EditTransactionForm({ transaction, onTransactionUpdated }) {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState(transaction);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedTransaction = await updateTransaction(transaction._id, formData);
    if (updatedTransaction) {
      onTransactionUpdated(updatedTransaction);
      setShow(false);
    }
  };

  return (
    <>
      <Button variant="warning" size="sm" onClick={() => setShow(true)}>✏ Edit</Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" name="amount" value={formData.amount} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Select name="type" value={formData.type} onChange={handleChange}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" name="category" value={formData.category} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" value={formData.date.split('T')[0]} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" name="description" value={formData.description} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">Save Changes</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditTransactionForm;
