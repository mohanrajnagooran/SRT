import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../api/config";

const TravelCreate = () => {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    date: today,
    prefix: "",
    travelCode: "",
    place: "",        // destination place name (readOnly)
    placeId: null,    // destination place id (to store)
    vehicleId: "",    // selected vehicle id
    driverId: "",     // selected driver id
    kattuKooli: "",
    openKm: "",
  });

  const [routePrefixes, setRoutePrefixes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  // Fetch route prefixes (must include destination_place and destination_place_id)
  useEffect(() => {
    axios
      .get(`${BASE_URL}/route-prefix`)
      .then((res) => {
        // expecting each item to include:
        // { id, prefix_code, destination_place, destination_place_id, ... }
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

  // Fetch drivers
  useEffect(() => {
    axios
      .get(`${BASE_URL}/drivers`)
      .then((res) => {
        // expecting objects like { id, name, ... }
        const opts = res.data.map((d) => ({ value: d.id, label: d.name }));
        setDrivers(opts);
      })
      .catch((err) => console.error("Error loading drivers", err));
  }, []);

  // Fetch vehicles
  useEffect(() => {
    axios
      .get(`${BASE_URL}/vehicles`)
      .then((res) => {
        // expecting objects like { id, vehicle_no, vehicle_name, ... }
        const opts = res.data.map((v) => ({
          value: v.id,
          label: `${v.vehicle_no} ${v.vehicle_name ? `(${v.vehicle_name})` : ""}`,
        }));
        setVehicles(opts);
      })
      .catch((err) => console.error("Error loading vehicles", err));
  }, []);

  // Handle form changes
  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Prefix selection: set prefix, destination place & id, and request next travel code
    if (name === "prefix") {
      const selected = routePrefixes.find((r) => r.value === value) || null;

      setFormData((prev) => ({
        ...prev,
        prefix: value,
        travelCode: "", // temporarily clear until next-code responds
        place: selected ? selected.destination : "",
        placeId: selected ? selected.destinationId : null,
      }));

      if (value) {
        try {
          const res = await axios.get(`${BASE_URL}/travel/next-code/${encodeURIComponent(value)}`);
          if (res?.data?.travel_code) {
            setFormData((prev) => ({ ...prev, travelCode: res.data.travel_code }));
          }
        } catch (err) {
          console.error("Error fetching next travel code", err);
        }
      }
      return;
    }

    // vehicleId or driverId or other fields
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      date: today,
      prefix: "",
      travelCode: "",
      place: "",
      placeId: null,
      vehicleId: "",
      driverId: "",
      kattuKooli: "",
      openKm: "",
    });
  };

  // Create travel: send IDs to backend
  const handleCreate = async () => {
    try {
      const payload = {
        travel_code: formData.travelCode, // backend should validate uniqueness
        prefix: formData.prefix,
        travel_date: formData.date,
        place_id: formData.placeId,
        vehicle_id: formData.vehicleId ? Number(formData.vehicleId) : null,
        driver_id: formData.driverId ? Number(formData.driverId) : null,
        kattu_kooli: formData.kattuKooli || 0,
        open_km: formData.openKm || 0,
      };

      const res = await axios.post(`${BASE_URL}/travel`, payload);
      alert(`Travel Created ✅ Code: ${res.data.travel_code || formData.travelCode}`);
      handleReset();
    } catch (err) {
      console.error("Error creating travel", err);
      alert("Failed to create travel ❌");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 border-bottom pb-2">Travel Creation</h3>

      <div className="card shadow-sm p-4 rounded-3">
        <div className="row g-3">
          {/* Date */}
          <div className="col-md-4">
            <label className="form-label">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-control" />
          </div>

          {/* Prefix */}
          <div className="col-md-4">
            <label className="form-label">Prefix</label>
            <select name="prefix" value={formData.prefix} onChange={handleChange} className="form-control">
              <option value="">-- Select Prefix --</option>
              {routePrefixes.map((p, i) => (
                <option key={i} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Travel Code */}
          <div className="col-md-4">
            <label className="form-label">Travel Code</label>
            <input type="text" name="travelCode" value={formData.travelCode} readOnly className="form-control bg-light" />
          </div>

          {/* Place (auto-filled from prefix) */}
          <div className="col-md-6">
            <label className="form-label">Place</label>
            <input type="text" name="place" value={formData.place} readOnly className="form-control bg-light" />
          </div>

          {/* Vehicle select (store vehicle_id) */}
          <div className="col-md-6">
            <label className="form-label">Vehicle</label>
            <select name="vehicleId" value={formData.vehicleId} onChange={handleChange} className="form-control">
              <option value="">-- Select Vehicle --</option>
              {vehicles.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* Driver select (store driver_id) */}
          <div className="col-md-6">
            <label className="form-label">Driver</label>
            <select name="driverId" value={formData.driverId} onChange={handleChange} className="form-control">
              <option value="">-- Select Driver --</option>
              {drivers.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Kathi Kooli */}
          <div className="col-md-6">
            <label className="form-label">Kattu Kooli</label>
            <input type="text" name="kattuKooli" value={formData.kattuKooli} onChange={handleChange} className="form-control" />
          </div>

          {/* Open KM */}
          <div className="col-md-6">
            <label className="form-label">Open KM</label>
            <input type="text" name="openKm" value={formData.openKm} onChange={handleChange} className="form-control" />
          </div>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-secondary" onClick={handleReset}>Reset</button>
          <button className="btn btn-primary" onClick={handleCreate}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default TravelCreate;
