import React, { useState } from 'react';

const TravelUnpaidLR = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [travelCode, setTravelCode] = useState('');

  const lrData = [
    { id: 'E1444', consigner: 'NACHI AGENCIES', consignee: 'SRI VEL MOTORS', consigneePlace: 'ATTUR', toPay: 80, paid: 0, pPaid: 0, crossing: 0, isUnpaid: true },
    { id: 'C5521', consigner: 'S.AANANDHAKUMAR & BAGS', consignee: 'KADWAL SILK', consigneePlace: 'THUMIRAPATTI', toPay: 70, paid: 0, pPaid: 0, crossing: 0, isUnpaid: true },
    { id: 'C1333', consigner: 'KNIT & MOULD', consignee: 'UDHAYANI AGRO', consigneePlace: 'NAMAGIRIPETTAI', toPay: 60, paid: 0, pPaid: 0, crossing: 0, isUnpaid: false },
    { id: 'C1346', consigner: 'JAITEK', consignee: 'RANI', consigneePlace: 'NADAYALUR', toPay: 70, paid: 0, pPaid: 0, crossing: 0, isUnpaid: true },
    // ... more data
  ];

  return (
    <div className="container py-4">
      <h3 className="mb-4 pb-2 border-bottom">Unpaid LR List</h3>

      {/* Filter Section */}
      <div className="row g-3 align-items-end mb-4">
        <div className="col-md-4">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Travel Code</label>
          <select
            className="form-select"
            value={travelCode}
            onChange={(e) => setTravelCode(e.target.value)}
          >
            <option value="">-- Select Code --</option>
            <option value="A123">A123</option>
            <option value="B234">B234</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-responsive rounded-3 shadow-sm border border-1">
        <table className="table table-bordered table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>S.No</th>
              <th>ID</th>
              <th>Consigner</th>
              <th>Consignee</th>
              <th>Consignee Place</th>
              <th>To Pay</th>
              <th>Paid</th>
              <th>PPaid</th>
              <th>Crossing</th>
              <th>Is Unpaid</th>
            </tr>
          </thead>
          <tbody>
            {lrData.map((lr, idx) => (
              <tr key={lr.id}>
                <td>{idx + 1}</td>
                <td>{lr.id}</td>
                <td>{lr.consigner}</td>
                <td>{lr.consignee}</td>
                <td>{lr.consigneePlace}</td>
                <td>{lr.toPay}</td>
                <td>{lr.paid}</td>
                <td>{lr.pPaid}</td>
                <td>{lr.crossing}</td>
                <td className="text-center">
                  <input type="checkbox" className="form-check-input" checked={lr.isUnpaid} readOnly />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TravelUnpaidLR;
