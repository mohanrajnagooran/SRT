import React, { useState } from 'react';

const PlacePriority = () => {
  const [groupData, setGroupData] = useState({
    name: '',
    priority: '',
    contact: ''
  });

  const [place, setPlace] = useState('');

  const placePriorityList = [
    { sno: 1, id: 1, name: 'TRICHY', priority: 1, contact: '9876543210' },
    { sno: 2, id: 2, name: 'TRICHY 2', priority: 2, contact: '9786012345' },
    { sno: 3, id: 3, name: 'SKT LORRY', priority: 3, contact: '9876001234' },
    // Add more rows
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setGroupData({ name: '', priority: '', contact: '' });
    setPlace('');
  };

  const handleAddGroup = () => {
    console.log('Group Data:', groupData);
  };

  const handlePlaceChange = (e) => setPlace(e.target.value);

  return (
    <div className="container py-4">
      <h3 className="mb-4 pb-2 border-bottom">Place Priority Setup</h3>

      {/* Group Form */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="p-4 border rounded shadow-sm bg-white">
            <h5 className="mb-3 text-primary">Place Priority Group</h5>
            <div className="mb-3">
              <label className="form-label">Group Name</label>
              <input type="text" className="form-control" name="name" value={groupData.name} onChange={handleChange} />
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Group Priority</label>
                <input type="number" className="form-control" name="priority" value={groupData.priority} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Contact No.</label>
                <input type="text" className="form-control" name="contact" value={groupData.contact} onChange={handleChange} />
              </div>
            </div>
            <div className="d-flex gap-3 mt-4">
              <button className="btn btn-secondary" onClick={handleReset}>Reset</button>
              <button className="btn btn-primary" onClick={handleAddGroup}>Add Group</button>
            </div>
          </div>
        </div>

        {/* Place Selection */}
        <div className="col-md-6">
          <div className="p-4 border rounded shadow-sm bg-white">
            <h5 className="mb-3 text-primary">Place Priority Places</h5>
            <label className="form-label">Select Place</label>
            <select className="form-select" value={place} onChange={handlePlaceChange}>
              <option value="">-- Select --</option>
              <option value="Trichy">Trichy</option>
              <option value="Erode">Erode</option>
              <option value="Salem">Salem</option>
              {/* Add more places */}
            </select>
          </div>
        </div>
      </div>

      {/* Table View */}
      <div className="table-responsive border rounded shadow-sm bg-white">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>S.No</th>
              <th>ID</th>
              <th>Group Name</th>
              <th>Priority</th>
              <th>Contact No.</th>
            </tr>
          </thead>
          <tbody>
            {placePriorityList.map(row => (
              <tr key={row.id}>
                <td>{row.sno}</td>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.priority}</td>
                <td>{row.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlacePriority;
