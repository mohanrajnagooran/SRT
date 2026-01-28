import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addPlace, editPlace } from "./placeThunks";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../api/config";
import Select from "react-select";

function PlaceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State for place form
  const [formData, setFormData] = useState({
    place: "",
    district: "",
    state: "",
    pincode: "",
  });

  // Dropdown options
  const [routePrefixes, setRoutePrefixes] = useState([]);

  // Selected prefixes with order number
  const [selectedPrefixes, setSelectedPrefixes] = useState([]);

  // ✅ Load route prefixes for dropdown
  useEffect(() => {
    axios
      .get(`${BASE_URL}/route-prefix`)
      .then((res) => {
        const options = res.data.map((p) => ({
          value: p.prefix_code,
          label: p.prefix_code,
        }));
        setRoutePrefixes(options);
      })
      .catch((err) => console.error("Error loading route prefixes", err));
  }, []);

  // ✅ If editing place → load data
  useEffect(() => {
    if (id) {
      axios
        .get(`${BASE_URL}/places/${id}`)
        .then((res) => {
          setFormData(res.data);

          // If backend returns prefixes like "P1:3,P2:2"
          if (res.data.prefixes) {
            const prefixArray = res.data.prefixes.map((p) => ({
              label: p.prefix,
              value: p.prefix,
              order: p.order,
            }));
            setSelectedPrefixes(prefixArray);
          }
        })
        .catch((err) => console.error("Error fetching place:", err));
    }
  }, [id]);

  // ✅ Handle input change for place form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle prefix select (keep existing order if already chosen)
  const handlePrefixChange = (selected) => {
    const withOrder = selected.map((s) => {
      const existing = selectedPrefixes.find((p) => p.value === s.value);
      return existing || { ...s, order: "" }; // default order empty
    });
    setSelectedPrefixes(withOrder);
  };

  // ✅ Submit form
  const handleSubmit = async(e) => {
    e.preventDefault();

    // Collect prefix + order info
    const prefixData = selectedPrefixes.map((p) => ({
      prefix: p.value,
      order: p.order,
    }));

    const updatedData = {
      ...formData,
      prefixes: prefixData, // ✅ structured array
    };
    try {

    if (id) {
     await dispatch(editPlace({ id, data: updatedData })).unwrap();
      alert("Place updated successfully");
    } else {
      await dispatch(addPlace(updatedData)).unwrap();
      alert("Place added successfully");
    }

    navigate("/places");
    } catch (error) {
      if (error && error.error === "Place already exists") {
      alert("This place already exists");
    } else {
      alert("Failed to save place");
    }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{id ? "Edit" : "Add"} Place</h2>
      <form
        onSubmit={handleSubmit}
        className="border p-4 rounded shadow-sm bg-light"
      >
        {/* Place, District, State, Pincode */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Place</label>
            <input
              name="place"
              className="form-control"
              value={formData.place}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">District</label>
            <input
              name="district"
              className="form-control"
              value={formData.district}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">State</label>
            <input
              name="state"
              className="form-control"
              value={formData.state}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Pincode</label>
            <input
              name="pincode"
              className="form-control"
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>

          {/* Route Prefix Multi-select */}
          <div className="col-md-12 mb-3">
            <label className="form-label">Route Prefix (Multi-select)</label>
            <Select
              isMulti
              options={routePrefixes}
              value={selectedPrefixes}
              onChange={handlePrefixChange}
              placeholder="Search and select prefixes"
            />
          </div>

          {/* Order input for each selected prefix */}
          {selectedPrefixes.length > 0 && (
            <div className="col-md-12 mb-3">
              <h6>Set Order Numbers for Prefixes:</h6>
              {selectedPrefixes.map((p, idx) => (
                <div
                  key={p.value}
                  className="d-flex align-items-center mb-2 border p-2 rounded bg-white"
                >
                  <span className="me-3">{p.label}</span>
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: "120px" }}
                    placeholder="Order"
                    value={p.order}
                    onChange={(e) => {
                      const updated = [...selectedPrefixes];
                      updated[idx].order = e.target.value;
                      setSelectedPrefixes(updated);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <button type="submit" className="btn btn-primary">
          {id ? "Update" : "Add"} Place
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/places")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default PlaceForm;
