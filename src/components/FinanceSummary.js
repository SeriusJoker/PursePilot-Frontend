import React from 'react';
import { Card } from 'react-bootstrap';

function FinanceSummary({ totalIncome, totalExpenses }) {
  return (
    <div className="d-flex gap-3">
      <Card className="p-3 flex-fill text-center">
        <h4>Total Income</h4>
        <h2 className="text-success">${totalIncome.toFixed(2)}</h2>
      </Card>
      <Card className="p-3 flex-fill text-center">
        <h4>Total Expenses</h4>
        <h2 className="text-danger">${totalExpenses.toFixed(2)}</h2>
      </Card>
    </div>
  );
}

export default FinanceSummary;
