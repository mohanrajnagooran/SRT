import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const UptoPlace = () => {
  const [prefix, setPrefix] = useState('');
  const [place, setPlace] = useState('');
  const [tamilPlace, setTamilPlace] = useState('');

  const [places, setPlaces] = useState([
    { id: 1, prefix: 'A', place: 'TRICHY', tamilPlace: 'திருச்சி' },
    { id: 2, prefix: 'D', place: '', tamilPlace: '' },
    { id: 3, prefix: 'C', place: 'SALEM', tamilPlace: 'சேலம்' },
    { id: 4, prefix: 'F', place: 'THURAIYUR', tamilPlace: 'துறையூர்' },
    { id: 5, prefix: 'JP', place: 'PATTUKKOTTAI', tamilPlace: 'பட்டுக்கோட்டை' },
    { id: 6, prefix: 'DA', place: 'ARANTHANGI', tamilPlace: 'அறந்தாங்கி' },
    { id: 7, prefix: 'JK', place: 'KUMBAKONAM', tamilPlace: 'கும்பகோணம்' },
  ]);

  const handleAddUptoPlace = () => {
    const newPlace = {
      id: places.length + 1,
      prefix,
      place,
      tamilPlace,
    };
    setPlaces([...places, newPlace]);
    setPrefix('');
    setPlace('');
    setTamilPlace('');
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 pb-2 border-bottom">UptoPlace Management</h3>
      <div className="row g-4">
        {/* Form Section */}
        <div className="col-md-4">
          <div className="p-4 border rounded shadow-sm bg-white">
            <h5 className="mb-3 text-primary">Add New Place</h5>
            <div className="mb-3">
              <label className="form-label">Prefix</label>
              <input type="text" className="form-control" value={prefix} onChange={(e) => setPrefix(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Place</label>
              <input type="text" className="form-control" value={place} onChange={(e) => setPlace(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Tamil Place</label>
              <input type="text" className="form-control" value={tamilPlace} onChange={(e) => setTamilPlace(e.target.value)} />
            </div>
            <div className="d-grid mt-4">
              <button className="btn btn-primary" onClick={handleAddUptoPlace}>Add Upto Place</button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="col-md-8">
          <div className="p-4 border rounded shadow-sm bg-white">
            <h5 className="mb-3 text-primary">Place List</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Prefix</th>
                    <th>Place</th>
                    <th>Tamil Place</th>
                  </tr>
                </thead>
                <tbody>
                  {places.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.prefix}</td>
                      <td>{item.place}</td>
                      <td>{item.tamilPlace}</td>
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

export default UptoPlace;
