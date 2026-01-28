import React, {useState} from 'react'

function CustomerWiseArticle() {
  const [formData, setFormData] = useState({
    consigneeName: 'KRISHNA SILKS',
    articleName: 'STOVE BOX',
    rate: '',
    tamilName: '',
    kooli: '',
    speedName: ''
  });

  const articles = [
    {
      id: 16,
      userId: 12225,
      name: 'STOVE BOX',
      tamilName: 'ஸ்டவ் பாக்ஸ்',
      rate: 111,
      kooli: 9.47,
      speedName: ''
    }
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReset = () => {
    setFormData({
      consigneeName: '',
      articleName: '',
      rate: '',
      tamilName: '',
      kooli: '',
      speedName: ''
    });
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 border-bottom pb-2">Article Entry</h3>
      <div className="row g-4">
        {/* Article Form */}
        <div className="col-md-5">
          <div className="card shadow-sm border p-4 rounded-3">
            <h5 className="text-primary mb-3">Add / Edit Article</h5>

            <div className="mb-3">
              <label className="form-label">Consignee Name</label>
              <input
                type="text"
                name="consigneeName"
                className="form-control"
                value={formData.consigneeName}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Article Name</label>
              <input
                type="text"
                name="articleName"
                className="form-control"
                value={formData.articleName}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Rate</label>
              <input
                type="number"
                name="rate"
                className="form-control"
                value={formData.rate}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Tamil Name</label>
              <input
                type="text"
                name="tamilName"
                className="form-control"
                value={formData.tamilName}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Kooli</label>
              <input
                type="number"
                name="kooli"
                className="form-control"
                value={formData.kooli}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Speed Name</label>
              <input
                type="text"
                name="speedName"
                className="form-control"
                value={formData.speedName}
                onChange={handleChange}
              />
            </div>

            <div className="d-flex justify-content-between">
              <button className="btn btn-secondary" onClick={handleReset}>Reset</button>
              <button className="btn btn-primary">Add</button>
            </div>
          </div>
        </div>

        {/* Article Table */}
        <div className="col-md-7">
          <div className="card shadow-sm border p-3 rounded-3">
            <h5 className="text-primary mb-3">Article List</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-hover table-sm">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Tamil Name</th>
                    <th>Rate</th>
                    <th>Kooli</th>
                    <th>Speed Name</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((art) => (
                    <tr key={art.id}>
                      <td>{art.id}</td>
                      <td>{art.userId}</td>
                      <td>{art.name}</td>
                      <td>{art.tamilName}</td>
                      <td>{art.rate}</td>
                      <td>{art.kooli}</td>
                      <td>{art.speedName}</td>
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

export default CustomerWiseArticle