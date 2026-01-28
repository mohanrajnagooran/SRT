import React, { useState, useEffect } from "react";

const TravelDriverForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    license_no: "",
    mobile_no: "",
    address: "",
    proof: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    
    onSubmit(formData); // send data back to parent (TravelDriver)
    setFormData({
      id: "",
      name: "",
      license_no: "",
      mobile_no: "",
      address: "",
      proof: "",
    });
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h5 className="mb-3 text-primary">
        {formData.id ? "Edit Driver" : "Add New Driver"}
      </h5>
      <form onSubmit={handleSubmit}>
        {["name", "license_no", "mobile_no", "proof", "address"].map((field) => (
          <div className="mb-3" key={field}>
            <label className="form-label">
              {field.replace("_", " ").toUpperCase()}
            </label>
            <input
              type="text"
              className="form-control"
              name={field}
              value={formData[field]}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="d-flex gap-3 mt-4">
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {formData.id ? "Update Driver" : "Add Driver"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TravelDriverForm;
