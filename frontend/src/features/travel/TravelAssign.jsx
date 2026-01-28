import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { BASE_URL } from "../../api/config";

const TravelAssign = () => {
  // Format today’s date as YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTravelCode, setSelectedTravelCode] = useState("");
  const [showAssigned, setShowAssigned] = useState(false);
  const [lrList, setLrList] = useState([]);
  const [routePrefixes, setRoutePrefixes] = useState([]);
  const [selectedPrefix, setSelectedPrefix] = useState(null);
  const [travelCodes, setTravelCodes] = useState([]);


  // Load all available prefixes for dropdown
  useEffect(() => {
    axios
      .get(`${BASE_URL}/route-prefix`)
      .then((res) => {
        const options = res.data.map((p) => ({
          value: p.prefix_code,
          label: p.prefix_code,
          destination: p.destination_place || "",
          destinationId: p.destination_place_id || null,
        }));
        setRoutePrefixes(options);
      })
      .catch((err) => console.error("Error loading route prefixes", err));
  }, []);

  // Fetch LRs whenever prefix changes
  useEffect(() => {
    if (!selectedPrefix) return;

    const fetchLRs = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/travel/lrs/unassigned`, {
          params: { prefix: selectedPrefix.value },
        });
        setLrList(res.data || []);
      } catch (err) {
        console.error("Error fetching LRs:", err);
        alert("Failed to fetch LRs ❌");
      }
    };

    fetchLRs();
  }, [selectedPrefix]);
  // Fetch travel codes whenever prefix changes
  useEffect(() => {
  if (!selectedPrefix) {
    setTravelCodes([]);
    return;
  }

  axios
    .get(`${BASE_URL}/travel/travel-codes`, {
      params: { prefix: selectedPrefix.value }
    })
    .then((res) => {
      setTravelCodes(res.data || []);
    })
    .catch((err) => console.error("Error loading travel codes", err));
}, [selectedPrefix]);

  

  // Assign all LRs under selected prefix
  const handleFillAll = async () => {
    if (!selectedTravelCode) {
      alert("Please select a travel code first ❌");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/travel/assign`, {
        travelCode: selectedTravelCode,
        lrIds: lrList.map((lr) => lr.id),
      });

      alert(`✅ Travel Code '${selectedTravelCode}' assigned to ${lrList.length} LRs.`);
      setLrList([]); // clear after assignment
    } catch (err) {
      console.error("Error assigning travel:", err);
      alert("Failed to assign travel ❌");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 pb-2 border-bottom">Assign Travel to LRs</h3>

      {/* Filters */}
      <div className="row g-3 align-items-center mb-4">
        <div className="col-md-3">
          <label className="form-label">Prefix</label>
          <Select
            options={routePrefixes}
            value={selectedPrefix}
            onChange={setSelectedPrefix}
            placeholder="Select Prefix"
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">LR Count</label>
          <input
            type="text"
            className="form-control"
            value={lrList.length}
            disabled
          />
        </div>

        <div className="col-md-3 mt-4">
          <div className="form-check mt-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="showAssigned"
              checked={showAssigned}
              onChange={(e) => setShowAssigned(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="showAssigned">
              Show Assigned (future use)
            </label>
          </div>
        </div>
      </div>

      {/* Travel Code Assign */}
      <div className="bg-light rounded-3 p-3 mb-4 shadow-sm">
        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <select
  className="form-select"
  value={selectedTravelCode}
  onChange={(e) => setSelectedTravelCode(e.target.value)}
>
  <option value="">-- Select Travel Code --</option>
  {travelCodes.map((t) => (
    <option key={t.travel_code} value={t.travel_code}>
      {t.travel_code}
    </option>
  ))}
</select>

          </div>
          <div className="col-md-6 text-end">
            <button
              className="btn btn-primary px-4"
              onClick={handleFillAll}
              disabled={!selectedTravelCode || lrList.length === 0}
            >
              Fill All
            </button>
          </div>
        </div>
      </div>

      {/* LRs Table */}
      <div className="table-responsive shadow-sm rounded-3 border border-1">
        <table className="table table-bordered table-striped mb-0">
          <thead className="table-light">
            <tr>
              <th>S.No</th>
              <th>LR ID</th>
              <th>Prefix</th>
              <th>Travel Code</th>
              <th>Consigner</th>
              <th>Consigner Place</th>
              <th>Consignee</th>
              <th>Consignee Place</th>
              <th>Articles Count</th>
            </tr>
          </thead>
          <tbody>
            {lrList.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center text-muted">
                  No unassigned LRs found
                </td>
              </tr>
            ) : (
              lrList.map((lr, idx) => (
                <tr key={lr.id}>
                  <td>{idx + 1}</td>
                  <td>{lr.id}</td>
                  <td>{lr.prefix}</td>
                  <td>{lr.travel_code || "-"}</td>
                  <td>{lr.consigner}</td>
                  <td>{lr.consigner_place}</td>
                  <td>{lr.consignee}</td>
                  <td>{lr.consignee_place}</td>
                  <td>{lr.articles_count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TravelAssign;
