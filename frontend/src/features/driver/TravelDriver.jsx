import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { BASE_URL } from "../../api/config";
import TravelDriverForm from "./TravelDriverForm";

const TravelDriver = () => {
  const [drivers, setDrivers] = useState([]);
  const [editingDriver, setEditingDriver] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Fetch drivers
  const fetchDrivers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/drivers`);
      setDrivers(res.data);
      console.log("Fetched drivers:", res.data);
      
    } catch (err) {
      console.error("Error fetching drivers:", err);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // ✅ Add or Update driver
  const handleSubmit = async (driverData) => {
  try {
    if (driverData.id) {
      // Update existing driver
      await axios.put(`${BASE_URL}/drivers/${driverData.id}`, driverData);
      alert("✅ Driver updated successfully");
    } else {
      // Create new driver
      await axios.post(`${BASE_URL}/drivers`, driverData);
      alert("✅ Driver added successfully");
    }

    // Refresh list
    fetchDrivers();

    // Reset form state
    setShowForm(false);
    setEditingDriver(null);
  } catch (err) {
    // Handle API errors safely
    if (err.response) {
      // Server responded with error (4xx, 5xx)
      alert(`❌ Error: ${err.response.data.error || "Something went wrong"}`);
      console.error("Server error:", err.response.data);
    } else if (err.request) {
      // Request sent but no response
      alert("❌ No response from server. Please try again.");
      console.error("No response:", err.request);
    } else {
      // Other errors (code bug, etc.)
      alert(`❌ Unexpected error: ${err.message}`);
      console.error("Unexpected error:", err.message);
    }
  }
};


  const handleSoftDelete = async (id) => {
  const reason = window.prompt("Enter reason for deleting this driver:");
  if (!reason) return;
  try {
    await axios.patch(`${BASE_URL}/drivers/${id}`, { reason });
    fetchDrivers();
  } catch (err) {
    console.error("Error deleting driver:", err);
  }
};

  return (
    <div className="container py-4">
      <h3 className="mb-4 pb-2 border-bottom">Travel Driver Management</h3>

      <div className="row g-4">
        {/* Left: Form (only when shown) */}
        <div className="col-md-4">
          {showForm && (
            <TravelDriverForm
              initialData={editingDriver}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingDriver(null);
              }}
            />
          )}
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              + Add Driver
            </button>
          )}
        </div>

        {/* Right: Driver List */}
        <div className="col-md-8">
          <div className="p-4 border rounded shadow-sm bg-white">
            <h5 className="mb-3 text-primary">Driver List</h5>
            <div className="table-responsive">
              <table className="table table-hover table-bordered mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Driver Name</th>
                    <th>License</th>
                    <th>Mobile</th>
                    <th>Address</th>
                    <th>Proof</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver.id}>
                      <td>{driver.id}</td>
                      <td>{driver.name}</td>
                      <td>{driver.license_no}</td>
                      <td>{driver.mobile_no}</td>
                      <td>{driver.address}</td>
                      <td>{driver.proof}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => {
                            setEditingDriver(driver);
                            setShowForm(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleSoftDelete(driver.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {drivers.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No drivers found 🚗
                      </td>
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
};

export default TravelDriver;
