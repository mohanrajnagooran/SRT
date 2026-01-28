import React, { useState } from 'react';

function CancelLR() {
  const [lrNo, setLrNo] = useState('');
  const [description, setDescription] = useState('');

  const cancelledLRs = [
    { id: 'A69', description: 'GOODS RETURNED' },
    { id: 'A124', description: 'PREFIX CHANGED' },
    { id: 'A75', description: 'DOUBLE ENTRY' },
    { id: 'D38', description: 'PREFIX CHANGED' },
    { id: 'E99', description: 'DOUBLE ENTRY' },
    { id: 'A456', description: 'PREFIX CHANGED' },
    { id: 'C265', description: 'PREFIX CHANGED' },
    { id: 'A725', description: 'PREFIX CHANGED' },
    { id: 'B162', description: 'PREFIX CHANGED' },
    { id: 'C396', description: 'PREFIX CHANGED' },
    { id: 'A1051', description: 'GOODS RETURN' },
    { id: 'A899', description: 'PREFIX CHANGED' },
    { id: 'C652', description: 'PREFIX CHANGED' },
    { id: 'F250', description: 'BOOKING CANCELLED' },
    { id: 'A1602', description: 'PREFIX CHANGED' },
    { id: 'A1720', description: 'PREFIX CHANGED' },
  ];

  const handleCancel = () => {
    alert(`Cancelled LR No: ${lrNo}\nReason: ${description}`);
    setLrNo('');
    setDescription('');
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 border-bottom pb-2">Cancel LR</h3>
      <div className="row g-4">
        {/* Left Panel: Form */}
        <div className="col-md-5">
          <div className="card shadow-sm border p-4 rounded-3">
            <h5 className="text-primary mb-3">Cancel a LR</h5>

            <div className="mb-3">
              <label className="form-label">LR No</label>
              <input
                type="text"
                className="form-control"
                value={lrNo}
                onChange={(e) => setLrNo(e.target.value)}
                placeholder="Enter LR Number"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Reason for cancellation"
              ></textarea>
            </div>

            <button
              className="btn btn-danger w-100"
              onClick={handleCancel}
              disabled={!lrNo || !description}
            >
              Cancel LR
            </button>
          </div>
        </div>

        {/* Right Panel: Cancelled LR List */}
        <div className="col-md-7">
          <div className="card shadow-sm border p-3 rounded-3">
            <h5 className="text-primary mb-3">Cancelled LR Records</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-hover table-sm">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {cancelledLRs.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.id}</td>
                      <td>{item.description}</td>
                    </tr>
                  ))}
                  {cancelledLRs.length === 0 && (
                    <tr>
                      <td colSpan="2" className="text-center">No cancelled LR found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancelLR;
