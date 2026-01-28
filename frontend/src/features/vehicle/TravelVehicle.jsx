import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TravelVehicle = () => {
  const [vehicleId, setVehicleId] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleMakeModel, setVehicleMakeModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [fcNumber, setFcNumber] = useState('');
  const [fcExpiry, setFcExpiry] = useState('');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');
  const [taxExpiry, setTaxExpiry] = useState('');

  const [vehicles, setVehicles] = useState([
    { id: 1, vehicleName: 'SRT', vehicleModel: 'PIK-UP', vehicleNumber: 'TN86 9337', insurance: '', fc: '', fcExpiry: '2020-04-07', insuranceExpiry: '2020-04-13', taxExpiry: '2020-04-26' },
    { id: 2, vehicleName: 'SRT', vehicleModel: 'TATA 407', vehicleNumber: 'TAT 2051', insurance: '', fc: '', fcExpiry: '2020-05-30', insuranceExpiry: '2020-05-30', taxExpiry: '2020-06-01' },
    // Add the rest as needed
  ]);

  const handleAddVehicle = () => {
    const newVehicle = {
      id: vehicles.length + 1,
      vehicleName,
      vehicleModel: vehicleMakeModel,
      vehicleNumber,
      insurance: insuranceNumber,
      fc: fcNumber,
      fcExpiry,
      insuranceExpiry,
      taxExpiry,
    };
    setVehicles([...vehicles, newVehicle]);
    handleResetForm();
  };

  const handleResetForm = () => {
    setVehicleId('');
    setVehicleName('');
    setVehicleMakeModel('');
    setVehicleNumber('');
    setInsuranceNumber('');
    setFcNumber('');
    setFcExpiry('');
    setInsuranceExpiry('');
    setTaxExpiry('');
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 pb-2 border-bottom">Travel Vehicle Management</h3>

      <div className="row g-4">
        {/* Form */}
        <div className="col-md-4">
          <div className="p-4 border rounded shadow-sm bg-white">
            <h5 className="mb-3 text-primary">Add New Vehicle</h5>

            <div className="mb-3">
              <label className="form-label">Vehicle ID</label>
              <input type="text" className="form-control" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Vehicle Name</label>
              <input type="text" className="form-control" value={vehicleName} onChange={(e) => setVehicleName(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Make/Model</label>
              <input type="text" className="form-control" value={vehicleMakeModel} onChange={(e) => setVehicleMakeModel(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Vehicle Number</label>
              <input type="text" className="form-control" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Insurance Number</label>
              <input type="text" className="form-control" value={insuranceNumber} onChange={(e) => setInsuranceNumber(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">FC Number</label>
              <input type="text" className="form-control" value={fcNumber} onChange={(e) => setFcNumber(e.target.value)} />
            </div>
            <div className="row">
              <div className="col">
                <label className="form-label">FC Expiry</label>
                <input type="date" className="form-control" value={fcExpiry} onChange={(e) => setFcExpiry(e.target.value)} />
              </div>
              <div className="col">
                <label className="form-label">Insurance Expiry</label>
                <input type="date" className="form-control" value={insuranceExpiry} onChange={(e) => setInsuranceExpiry(e.target.value)} />
              </div>
            </div>
            <div className="mt-3">
              <label className="form-label">Tax Expiry</label>
              <input type="date" className="form-control" value={taxExpiry} onChange={(e) => setTaxExpiry(e.target.value)} />
            </div>

            <div className="d-flex gap-3 mt-4">
              <button className="btn btn-secondary" onClick={handleResetForm}>Reset</button>
              <button className="btn btn-primary" onClick={handleAddVehicle}>Add Vehicle</button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="col-md-8">
          <div className="p-4 border rounded shadow-sm bg-white">
            <h5 className="mb-3 text-primary">Vehicle List</h5>
            <div className="table-responsive">
              <table className="table table-hover table-bordered mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Model</th>
                    <th>Number</th>
                    <th>Insurance</th>
                    <th>FC</th>
                    <th>FC Expiry</th>
                    <th>Ins. Expiry</th>
                    <th>Tax Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map(vehicle => (
                    <tr key={vehicle.id}>
                      <td>{vehicle.id}</td>
                      <td>{vehicle.vehicleName}</td>
                      <td>{vehicle.vehicleModel}</td>
                      <td>{vehicle.vehicleNumber}</td>
                      <td>{vehicle.insurance}</td>
                      <td>{vehicle.fc}</td>
                      <td>{vehicle.fcExpiry}</td>
                      <td>{vehicle.insuranceExpiry}</td>
                      <td>{vehicle.taxExpiry}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelVehicle;