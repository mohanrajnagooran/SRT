import React, { useState } from 'react';

function DeliverLR() {
  const [selectedDate, setSelectedDate] = useState('');
  const [travelCode, setTravelCode] = useState('A428');
  const [selectAll, setSelectAll] = useState(false);

  const [lrList, setLrList] = useState([
    { lrNo: 'A2494', consigner: 'NSN', consignee: 'ABS AGENCIES', total: 375, delivered: false },
    { lrNo: 'D1247', consigner: 'EVERGREEN NATURAL FOODE', consignee: 'MS ABDULLA AGENCIES', total: 900, delivered: false },
    { lrNo: 'A2429', consigner: 'SARAN DRUG DISTRIBUTORS', consignee: 'MEDEWELL LOGI', total: 100, delivered: false },
    { lrNo: 'A2434', consigner: 'PRECISION FABRICS', consignee: 'TRICHY SUGUNA GARMENTS', total: 200, delivered: false },
    { lrNo: 'A2435', consigner: 'BAKIYA FASHIONS', consignee: 'KM JAWLI STORES', total: 250, delivered: false },
    { lrNo: 'A2436', consigner: 'MYSORE POLYMERS & RUBBE', consignee: 'SITHA TRADERS', total: 180, delivered: false },
    { lrNo: 'A2437', consigner: 'MYSORE POLYMERS & RUBBE', consignee: 'VASANTHAM MALIKAI', total: 160, delivered: false },
    { lrNo: 'A2438', consigner: 'SHRI GANAPATHY & CO', consignee: 'MAHESH ESSENCE', total: 140, delivered: false },
    { lrNo: 'A2439', consigner: 'THE BELL TEXTILES', consignee: 'SRI LAKSHMI SILK', total: 400, delivered: false },
    { lrNo: 'A2450', consigner: 'THE BELL TEXTILES', consignee: 'RAMYA JAWLI STORES', total: 130, delivered: false },
    { lrNo: 'A2452', consigner: 'THE BELL TEXTILES', consignee: 'SORNAVEL SILKS', total: 200, delivered: false },
    { lrNo: 'A2453', consigner: 'THE BELL TEXTILES', consignee: 'SRI RAM TEXTILES', total: 200, delivered: false },
    { lrNo: 'A2455', consigner: 'PSK POPULAR TRADING', consignee: 'AROKYA METAL', total: 130, delivered: false },
  ]);

  const toggleDelivery = (e, index = null) => {
  if (index === null) {
    // Select All case
    const checked = e.target.checked;
    setSelectAll(checked);
    const updatedList = lrList.map(lr => ({ ...lr, delivered: checked }));
    setLrList(updatedList);
  } else {
    // Individual checkbox
    const updatedList = [...lrList];
    updatedList[index].delivered = !updatedList[index].delivered;
    setLrList(updatedList);

    // If any one is unchecked, uncheck "Select All"
    if (selectAll && !updatedList.every(lr => lr.delivered)) {
      setSelectAll(false);
    }

    // If all are now checked, set "Select All" to true
    if (!selectAll && updatedList.every(lr => lr.delivered)) {
      setSelectAll(true);
    }
  }
};

  const deliveredCount = lrList.filter((lr) => lr.delivered).length;
  const totalCount = lrList.length;
  const undeliveredCount = totalCount - deliveredCount;

  return (
    <div className="container py-4">
      <h3 className="mb-4 border-bottom pb-2">Deliver LR</h3>

      {/* Filters */}
      <div className="row mb-4 g-3">
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
            <option value="A428">A428</option>
            <option value="B222">B222</option>
            <option value="C333">C333</option>
          </select>
        </div>
        <div className="col-md-4 d-flex align-items-end justify-content-end">
          <div>
          <label className='me-2' htmlFor="selectall">Select All</label>
          <input type="checkbox" checked={selectAll} name="selectall" id="" onChange={(e) => toggleDelivery(e)} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive border rounded shadow-sm">
        <table className="table table-hover table-bordered mb-0">
          <thead className="table-light">
            <tr>
              <th>LR No</th>
              <th>Consigner</th>
              <th>Consignee</th>
              <th>Total</th>
              <th className="text-center">Delivered</th>
            </tr>
          </thead>
          <tbody>
            {lrList.map((lr, index) => (
              <tr key={lr.lrNo}>
                <td>{lr.lrNo}</td>
                <td>{lr.consigner}</td>
                <td>{lr.consignee}</td>
                <td>{lr.total}</td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={lr.delivered}
                    onChange={(e) => toggleDelivery(e, index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Stats */}
      <div className="d-flex justify-content-between mt-3 fw-bold px-2 text-dark">
        <div>Delivered LR Total: {deliveredCount}</div>
        <div>Undelivered LR Total: {undeliveredCount}</div>
        <div>Total: {totalCount}</div>
      </div>
    </div>
  );
}

export default DeliverLR;
