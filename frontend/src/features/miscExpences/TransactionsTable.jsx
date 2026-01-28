import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../api/config';

const TransactionsTable = ({ transactions, refreshData }) => {
  const [deleteId, setDeleteId] = useState(null);
  const [reason, setReason] = useState('');

  const formatDate = (isoDate) => {
    const dateObj = new Date(isoDate);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDelete = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason for deletion');
      return;
    }
    try {
      await axios.patch(`${BASE_URL}/transactions/${deleteId}/delete`, { reason });
      alert('Transaction soft deleted successfully');
      setDeleteId(null);
      setReason('');
      refreshData(); // Re-fetch updated transactions
    } catch (err) {
      console.error(err);
      alert('Error deleting transaction');
    }
  };

  return (
    <>
      <table className="table table-bordered mt-2">
        <thead className="table-light">
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{formatDate(tx.date)}</td>
              <td>{tx.type}</td>
              <td>{tx.description}</td>
              <td>₹{tx.amount}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => setDeleteId(tx.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Reason Modal */}
      {deleteId && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Transaction</h5>
                <button type="button" className="btn-close" onClick={() => setDeleteId(null)} />
              </div>
              <div className="modal-body">
                <label>Reason for deletion</label>
                <textarea
                  className="form-control"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionsTable;
