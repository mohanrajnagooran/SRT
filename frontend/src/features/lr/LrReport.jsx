import React, { useState } from "react";

function LrReport() {
  const [reportDate, setReportDate] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");

  const tableData = [
    {
      sno: 1,
      lrNo: 7354,
      consigner: "VISHNU BAG",
      consignee: "ADHITHYA SILKS",
      consigneeP: "PERAMBALLU",
      article: "BUNDLE",
      baleNo: "",
      qty: 90,
      gross: 600,
      toPay: 9,
      paid: 0,
    },
    {
      sno: 2,
      lrNo: "JEEVAN TENTA ES",
      consigner: "",
      consignee: "ADHITHYA SILKS",
      consigneeP: "PERAMBALLU",
      article: "BUNDLE",
      baleNo: "299,300",
      qty: 2,
      gross: 0,
      toPay: 400,
      paid: 0,
    },
    // ... (other entries remain unchanged or sanitized as needed)
  ];

  const handleDateChange = (e) => setReportDate(e.target.value);
  const handleDropdownChange = (e) => setDropdownValue(e.target.value);

  return (
    <div
      className="card shadow-lg rounded-3 p-4 mx-auto my-4 border border-1"
      style={{ maxWidth: "1100px" }}
    >
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <h1 className="h5 fw-semibold text-dark mb-0">Report LR</h1>
      </div>

      {/* Controls */}
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-5 g-3">
        <div className="d-flex flex-column flex-sm-row align-items-center gap-3 w-100 w-md-auto">
          {/* Date Picker */}
          <div className="input-group shadow-sm border rounded-3 p-1 bg-light">
            <input
              type="date"
              value={reportDate}
              onChange={handleDateChange}
              className="form-control border-0 bg-transparent text-dark shadow-none"
            />
          </div>

          {/* Dropdown */}
          <div className="position-relative w-100 w-sm-auto">
            <select
              value={dropdownValue}
              onChange={handleDropdownChange}
              className="form-select bg-light border border-secondary text-dark rounded-3 shadow-sm pe-4 cursor-pointer"
              style={{ paddingRight: "2.5rem" }}
            >
              <option value="">-- Select Branch --</option>
              <option value="B444">B444</option>
              <option value="B555">B555</option>
              <option value="B666">B666</option>
            </select>
            <div className="position-absolute top-50 end-0 translate-middle-y me-2 text-secondary pe-2">
              <svg
                className="bi bi-chevron-down"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex flex-column flex-sm-row gap-3 w-100 w-md-auto">
          <button
            className="btn btn-primary px-4 py-2 rounded-3 shadow-sm transition-all w-100 w-sm-auto"
            style={{ backgroundColor: "#6a1b9a", borderColor: "#6a1b9a" }}
          >
            Print Report
          </button>
          <button className="btn btn-danger px-4 py-2 rounded-3 shadow-sm transition-all w-100 w-sm-auto">
            Without Paid & R
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive rounded-3 border border-1 shadow-sm">
        <table className="table table-hover mb-0">
          <thead className="bg-light">
            <tr>
              {[
                "SNo",
                "LR No",
                "Consigner",
                "Consignee",
                "Consignee P",
                "Article",
                "Bale No",
                "Qty",
                "Gross",
                "To Pay",
                "Paid",
              ].map((header) => (
                <th
                  key={header}
                  className="text-start text-muted text-uppercase small py-3 px-3"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr
                key={row.lrNo || index}
                className={index % 2 === 0 ? "bg-white" : "bg-light"}
              >
                <td className="py-2 px-3 text-start fw-medium text-dark">
                  {row.sno}
                </td>
                <td className="py-2 px-3 text-start text-dark">
                  {row.lrNo || "-"}
                </td>
                <td className="py-2 px-3 text-start text-dark">
                  {row.consigner || "-"}
                </td>
                <td className="py-2 px-3 text-start text-dark">
                  {row.consignee || "-"}
                </td>
                <td className="py-2 px-3 text-start text-dark">
                  {row.consigneeP || "-"}
                </td>
                <td className="py-2 px-3 text-start text-dark">
                  {row.article || "-"}
                </td>
                <td className="py-2 px-3 text-start text-dark">
                  {row.baleNo || "-"}
                </td>
                <td className="py-2 px-3 text-start text-dark">
                  {row.qty || 0}
                </td>
                <td className="py-2 px-3 text-start text-dark">
                  {row.gross || 0}
                </td>
                <td className="py-2 px-3 text-start text-dark">
                  {row.toPay || 0}
                </td>
                <td className="py-2 px-3 text-start text-dark">
                  {row.paid || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LrReport;
