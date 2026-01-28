import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../api/config";
import axios from "axios";

const TravelExpenses = () => {
  // default today's date
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    date: today,
    travelId: "",
    travelCode: "",
    lorryRent: "",
    dieselCharges: "",
    driverSalary: "",
    totalKM: "",
    unloadKooli: "",
    maintenanceCharges: "",
    otherCharges: "",
    dieselQty: "",
    mileage: "",
  });

  const [travelCodes, setTravelCodes] = useState([]);

  // fetch only "InProgress" travel codes for today
  useEffect(() => {
    const fetchTravelCodes = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/travel/travel-codes/inprogress`);

        // expect backend to return id + travel_code
        setTravelCodes(res.data || []);
      } catch (err) {
        console.error("Error fetching travel codes:", err);
        alert("Failed to fetch travel codes ❌");
      }
    };

    fetchTravelCodes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTravelChange = (e) => {
    const selectedCode = e.target.value;
    const selectedTravel = travelCodes.find(
      (t) => t.travel_code === selectedCode
    );
    setFormData((prev) => ({
      ...prev,
      travelCode: selectedCode,
      travelId: selectedTravel ? selectedTravel.id : "",
    }));
  };

  const handleReset = () => {
    setFormData({
      date: today,
      travelId: "",
      travelCode: "",
      lorryRent: "",
      dieselCharges: "",
      driverSalary: "",
      totalKM: "",
      unloadKooli: "",
      maintenanceCharges: "",
      otherCharges: "",
      dieselQty: "",
      mileage: "",
    });
  };

  const handleSave = async () => {
    if (!formData.travelId) {
      alert("❌ Please select a travel code first");
      return;
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/travel/${formData.travelId}/expenses`,
        formData
      );
      alert(response.data.message);
      handleReset();
    } catch (err) {
      console.error(err);
      alert("Failed to save expenses ❌");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 pb-2 border-bottom">Travel Expenses</h3>

      {/* Date & Travel Code */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Travel Code</label>
          <select
            className="form-select"
            name="travelCode"
            value={formData.travelCode}
            onChange={handleTravelChange}
          >
            <option value="">-- Select Travel Code --</option>
            {travelCodes.map((t) => (
              <option key={t.id} value={t.travel_code}>
                {t.travel_code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expense Inputs */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <label className="form-label">Lorry Rent</label>
          <input
            type="number"
            name="lorryRent"
            className="form-control"
            value={formData.lorryRent}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Unload Kooli</label>
          <input
            type="number"
            name="unloadKooli"
            className="form-control"
            value={formData.unloadKooli}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Diesel Charges</label>
          <input
            type="number"
            name="dieselCharges"
            className="form-control"
            value={formData.dieselCharges}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Maintenance Charges</label>
          <input
            type="number"
            name="maintenanceCharges"
            className="form-control"
            value={formData.maintenanceCharges}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Driver Salary</label>
          <input
            type="number"
            name="driverSalary"
            className="form-control"
            value={formData.driverSalary}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Other Charges</label>
          <input
            type="number"
            name="otherCharges"
            className="form-control"
            value={formData.otherCharges}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Total KM</label>
          <input
            type="number"
            name="totalKM"
            className="form-control"
            value={formData.totalKM}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Diesel Qty</label>
          <input
            type="number"
            name="dieselQty"
            className="form-control"
            value={formData.dieselQty}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Mileage</label>
          <input
            type="number"
            name="mileage"
            className="form-control"
            value={formData.mileage}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex gap-3 mt-4">
        <button className="btn btn-secondary px-4" onClick={handleReset}>
          Reset
        </button>
        <button className="btn btn-primary px-4" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default TravelExpenses;
