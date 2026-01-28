import React, { useMemo } from 'react';

function Cards({ transactions }) {
const { income, expenses, balance } = useMemo(() => {
    let income = 0;
    let expenses = 0;

    transactions.forEach((txn) => {
      const amt = parseFloat(txn.amount);
      if (txn.type === 'Income') {
        income += amt;
      } else if (txn.type === 'Expense') {
        expenses += amt;
      }
    });

    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }, [transactions]);
  return (
     <div className="row text-center my-4">
    <div className="col-md-4">
      <div className="border rounded p-3">
        <h5>Total Income</h5>
        <h3>₹{income.toLocaleString()}</h3>
      </div>
    </div>
    <div className="col-md-4">
      <div className="border rounded p-3">
        <h5>Total Expenses</h5>
        <h3>₹{balance.toLocaleString()}</h3>
      </div>
    </div>
    <div className="col-md-4">
      <div className="border rounded p-3">
        <h5>Current Balance</h5>
        <h3>₹{balance.toLocaleString()}</h3>
      </div>
    </div>
  </div>
  )
}

export default Cards