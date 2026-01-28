import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../api/config";

function Travel() {
  const navigate = useNavigate();
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch travel list
  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/travel`);
        setTravels(response.data);
      } catch (err) {
        console.error("Error fetching travels:", err);
        setError("Failed to fetch travels");
      } finally {
        setLoading(false);
      }
    };
    fetchTravels();
  }, []);

  return (
    <div className="container mt-4">
      {/* Header + Buttons */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Travels</h2>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => navigate("/travel/create")}
          >
            Travel Create
          </button>
          <button
            className="btn btn-primary me-2"
            onClick={() => navigate("/travel/assign")}
          >
            Travel Assign
          </button>
          <button
            className="btn btn-primary me-2"
            onClick={() => navigate("/travel/unpaidlr")}
          >
            Travel Unpaid LR
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/travel/travelexpenses")}
          >
            Travel Expenses
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading travels...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <div className="row mt-3">
          <div className="col-md-12">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Travel Code</th>
                  <th>Prefix</th>
                  <th>Date</th>
                  <th>Place</th>
                  <th>Driver</th>
                  <th>Vehicle</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {travels.length > 0 ? (
                  travels.map((travel) => (
                    <tr key={travel.id}>
                      <td>{travel.travel_code}</td>
                      <td>{travel.prefix}</td>
                      <td>
                        {new Date(travel.travel_date).toLocaleDateString()}
                      </td>
                      <td>{travel.place_name}</td>
                      <td>{travel.driver_name || "-"}</td>
                      <td>{travel.vehicle_no || "-"}</td>
                      <td>{travel.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No travels found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Travel;
