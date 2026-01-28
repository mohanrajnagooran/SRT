import React, { useState } from 'react';

function UserManagement() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    designation: '',
  });

  const [permissions, setPermissions] = useState({
    'Add Articles': true,
    'Add Customer': true,
    'Add Driver': false,
    'Add LR': true,
    'Add Travel': true,
    'Add Vehicle': false,
    'Assign Travel': false,
    'Complete Travel': false,
    'Customer Report': true,
    'Driver Report': false,
    'Edit Articles': true,
    'Edit Customer': false,
    'Edit Driver': false,
    'Edit LR': true,
    'Edit Travel': true,
    'Edit Vehicle': true,
  });

  const userList = [
    { id: 1, username: 'admin', password: '123456', designation: 'admin' },
    { id: 3, username: 'moorthi', password: '1234', designation: 'staff' },
    { id: 4, username: 'SIMON', password: '1236', designation: 'STAFF' },
    { id: 5, username: 'srt', password: '1234', designation: 'staff' },
    { id: 6, username: 'SVR', password: '123', designation: 'MANAGER' },
  ];

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePermission = (key) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 border-bottom pb-2">User Management</h3>
      <div className="row g-4">
        {/* User Form */}
        <div className="col-lg-4">
          <div className="card shadow-sm rounded-3 p-3 border">
            <h5 className="text-white bg-primary p-2 rounded mb-3">User</h5>
            <div className="mb-3">
              <label className="form-label">User Name</label>
              <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="text" className="form-control" name="password" value={formData.password} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Designation</label>
              <input type="text" className="form-control" name="designation" value={formData.designation} onChange={handleChange} />
            </div>
            <div className="d-flex justify-content-between">
              <button className="btn btn-danger">Delete</button>
              <button className="btn btn-secondary">Reset</button>
              <button className="btn btn-success">Save User</button>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="col-lg-4">
          <div className="card shadow-sm rounded-3 p-3 border">
            <h5 className="text-white bg-primary p-2 rounded mb-3">Permissions</h5>
            <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Ops</th>
                    <th>Enabled</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(permissions).map(([key, value], index) => (
                    <tr key={index}>
                      <td>{key}</td>
                      <td>
                        <input type="checkbox" checked={value} onChange={() => togglePermission(key)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* User List Table */}
        <div className="col-lg-4">
          <div className="card shadow-sm rounded-3 p-3 border">
            <h5 className="text-white bg-primary p-2 rounded mb-3">User List</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-hover table-sm">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>User Name</th>
                    <th>Password</th>
                    <th>Designation</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.password}</td>
                      <td>{user.designation}</td>
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
}

export default UserManagement;
