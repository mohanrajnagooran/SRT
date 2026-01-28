import React, { useState } from 'react';

function MiscExpense() {
  const [expenseDate, setExpenseDate] = useState('');
  const [expenseName, setExpenseName] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');

  const expenseOptions = [
    'STATIONARY',
    'ADMIN/OFFICE RENT',
    'ADVANCE REFUND TN8630152',
    'ADVANCE RETURN',
    'ADVANCE TN12051',
    'ADVANCE TN946935',
    'ADVANCE TN895377',
  ];

  const tableData = [
    {
      sno: 1,
      id: 'EXP001',
      date: '19-06-2025',
      name: 'STATIONARY',
      description: 'Pens & Papers',
      amount: 61,
      debit: 0,
      credit: 0,
    },
    {
      sno: 0,
      id: '',
      date: '',
      name: 'Closing',
      description: '',
      amount: 171161,
      debit: 0,
      credit: 0,
    }
  ];

  return (
    <div className="card shadow-lg rounded-3 p-4 mx-auto my-4 border border-1" style={{ maxWidth: '1200px' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <h1 className="h5 fw-semibold text-dark mb-0">Misc Expenses</h1>
      </div>

      {/* Form Inputs */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <label className="form-label text-muted">Date</label>
          <input
            type="date"
            className="form-control shadow-sm"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label text-muted">Expense Name</label>
          <select
            className="form-select shadow-sm"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
          >
            <option value="">-- Select Expense --</option>
            {expenseOptions.map((exp, idx) => (
              <option key={idx} value={exp}>{exp}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label text-muted">Expense Description</label>
          <input
            type="text"
            className="form-control shadow-sm"
            value={expenseDesc}
            onChange={(e) => setExpenseDesc(e.target.value)}
            placeholder="Enter description"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="table-responsive rounded-3 border border-1 shadow-sm">
        <table className="table table-hover mb-0">
          <thead className="bg-light">
            <tr>
              {['S.No', 'ID', 'Date', 'Expense Name', 'Expense Description', 'Amount', 'Debit', 'Credit'].map(header => (
                <th key={header} className="text-start text-muted text-uppercase small py-3 px-3">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-light'}>
                <td className="py-2 px-3 text-start text-dark">{row.sno}</td>
                <td className="py-2 px-3 text-start text-dark">{row.id || '-'}</td>
                <td className="py-2 px-3 text-start text-dark">{row.date || '-'}</td>
                <td className="py-2 px-3 text-start text-dark">{row.name}</td>
                <td className="py-2 px-3 text-start text-dark">{row.description || '-'}</td>
                <td className="py-2 px-3 text-start text-dark">{row.amount}</td>
                <td className="py-2 px-3 text-start text-dark">{row.debit}</td>
                <td className="py-2 px-3 text-start text-dark">{row.credit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MiscExpense;
