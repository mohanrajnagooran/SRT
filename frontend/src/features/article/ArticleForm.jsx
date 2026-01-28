import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addArticle, editArticle } from "./articleThunks";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../api/config";

function ArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    rate: "",
    kooli: "",
    speed: "",
    tamil_name: "",
    unload_charges: "",
  });

useEffect(() => {
    if (id) {
      axios.get(`${BASE_URL}/articles/${id}`)
        .then(res => setFormData(res.data))
        .catch(err => console.error('Error fetching articles:', err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:  value
    }));
  };

 const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      dispatch(editArticle({ id, data: formData }));
    } else {
      dispatch(addArticle(formData));
    }
    navigate('/articles');
  };
  return (
    <div className="container mt-4">
      <h2 className="mb-4">{id ? 'Edit' : 'Add'} Article</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Name</label>
            <input name="name" className="form-control" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Name (Tamil)</label>
            <input name="tamil_name" className="form-control" value={formData.tamil_name} onChange={handleChange} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Rate</label>
            <input name="rate" className="form-control" value={formData.rate} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Kooli</label>
            <input name="kooli" className="form-control" value={formData.kooli} onChange={handleChange} />
          </div>

          <div className="col-md-12 mb-3">
            <label className="form-label">Speed</label>
            <textarea name="speed" className="form-control" value={formData.speed} onChange={handleChange} />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">Unload Charges</label>
            <input name="unload_charges" className="form-control" value={formData.unload_charges} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          {id ? 'Update' : 'Add'} Article
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/articles')}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ArticleForm;
