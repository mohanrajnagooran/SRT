import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
// import "bootstrap/dist/css/bootstrap.min.css";

export default function HomePage() {
 const [stats, setStats] = useState({
    totalLRs: 120,
    activeRoutes: 8,
    totalCustomers: 56,
    pendingDeliveries: 14
  });

  const recentLRs = [
    { id: "LR001", date: "05/08/2025", customer: "ABC Ltd", route: "Mumbai → Pune", status: "Delivered" },
    { id: "LR002", date: "06/08/2025", customer: "XYZ Pvt", route: "Delhi → Jaipur", status: "Pending" },
    { id: "LR003", date: "07/08/2025", customer: "KLM Corp", route: "Chennai → Bengaluru", status: "In Transit" },
  ];

  const lrPerMonthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "LRs Created",
      data: [12, 19, 14, 22, 18, 25],
      backgroundColor: "rgba(54, 162, 235, 0.6)"
    }]
  };

  const topRoutesData = {
    labels: ["Mumbai → Pune", "Delhi → Jaipur", "Chennai → Bengaluru"],
    datasets: [{
      data: [45, 30, 25],
      backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"]
    }]
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">SRT Transport Dashboard</h2>

      {/* KPI Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center p-3 shadow-sm">
            <h5>Total LRs</h5>
            <h3>{stats.totalLRs}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3 shadow-sm">
            <h5>Active Routes</h5>
            <h3>{stats.activeRoutes}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3 shadow-sm">
            <h5>Total Customers</h5>
            <h3>{stats.totalCustomers}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3 shadow-sm">
            <h5>Pending Deliveries</h5>
            <h3>{stats.pendingDeliveries}</h3>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-4">
        <h5>Quick Actions</h5>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/lrs/add" className="btn btn-primary">+ Add LR</Link>
          <Link to="/customers/add" className="btn btn-success">+ Add Customer</Link>
          <Link to="/routeprefix/create" className="btn btn-warning">+ Add Route</Link>
          <Link to="/reports" className="btn btn-dark">📊 View Reports</Link>
        </div>
        {/* Recent Activity */}
      <div className="card p-3 shadow-sm">
        <h5>Recent LRs</h5>
        <table className="table table-bordered mt-2">
          <thead>
            <tr>
              <th>LR No</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Route</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentLRs.map((lr) => (
              <tr key={lr.id}>
                <td>{lr.id}</td>
                <td>{lr.date}</td>
                <td>{lr.customer}</td>
                <td>{lr.route}</td>
                <td>{lr.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      {/* Charts */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>LRs per Month</h5>
            <Bar data={lrPerMonthData} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>Top Routes</h5>
            <Doughnut data={topRoutesData} />
          </div>
        </div>
      </div>

      
    </div>
  );
}
