import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../api/config";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function LrReport() {
  const [reportDate, setReportDate] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e) => setReportDate(e.target.value);

  const fetchReport = async () => {
    if (!reportDate) {
      alert("Select date");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `https://srt-fxc9.onrender.com/api/lrs/report?date=${reportDate}`
      );

      const data = await res.json();

      setRows(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const downloadPDF = () => {
    if (rows.length === 0) {
      alert("No data to download");
      return;
    }

    const doc = new jsPDF("landscape");

    doc.setFontSize(16);
    doc.text(`LR Report - ${reportDate}`, 14, 15);

    const tableColumn = [
      "SNo",
      "ID",
      "Prefix",
      "Consigner",
      "Consignee",
      "Place",
      "Bale",
      "Qty",
      "To Pay",
      "Paid",
      "R Paid",
      "Date",
    ];

    const tableRows = rows.map((row, index) => [
      index + 1,
      row.ID,
      row.prefix,
      row.consigner,
      row.consignee,
      row.consignee_place,
      row.bale_no,
      row.qty,
      row.to_pay,
      row.paid,
      row.r_paid,
      row.date?.split("T")[0],
    ]);

    autoTable(doc, {
      startY: 25,
      head: [tableColumn],
      body: tableRows,
    });

    doc.save(`LR_Report_${reportDate}.pdf`);
  };

  return (
    <div className="card shadow-lg rounded-3 p-4 mx-auto my-4 border border-1" style={{ maxWidth: "1100px" }}>
      <div className="d-flex justify-content-between mb-3">
        <h5>LR Report</h5>
      </div>

      <div className="d-flex gap-3 mb-4">
        <input
          type="date"
          value={reportDate}
          onChange={handleDateChange}
          className="form-control"
        />

        <button
          onClick={fetchReport}
          className="btn btn-primary"
        >
          {loading ? "Loading..." : "Fetch Report"}
        </button>
        <button onClick={downloadPDF} className="btn btn-success">
          Download PDF
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>SNo</th>
              <th>ID</th>
              <th>Prefix</th>
              <th>Consigner</th>
              <th>Consignee</th>
              <th>Place</th>
              <th>Bale</th>
              <th>Qty</th>
              <th>To Pay</th>
              <th>Paid</th>
              <th>R Paid</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan="12" className="text-center">
                  No Data
                </td>
              </tr>
            )}

            {rows.map((row, index) => (
              <tr key={row.ID}>
                <td>{index + 1}</td>
                <td>{row.ID}</td>
                <td>{row.prefix}</td>
                <td>{row.consigner}</td>
                <td>{row.consignee}</td>
                <td>{row.consignee_place}</td>
                <td>{row.bale_no}</td>
                <td>{row.qty}</td>
                <td>{row.to_pay}</td>
                <td>{row.paid}</td>
                <td>{row.r_paid}</td>
                <td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LrReport;
