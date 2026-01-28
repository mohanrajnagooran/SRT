import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles, removeArticle } from './articleThunks';
import { useNavigate } from 'react-router-dom';

function ArticleList() {
  const dispatch = useDispatch();
    const navigate = useNavigate();
    const { list, loading } = useSelector(state => state.article);
     // delete modal
        const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedArticleId, setSelectedArticleId] = useState(null);
    const [deleteReason, setDeleteReason] = useState('');
    
    useEffect(() => {
        dispatch(fetchArticles());
      }, [dispatch]);

      const triggerDelete = (id) => {
  setSelectedArticleId(id);
  setShowDeleteModal(true);
};

      // const handleDelete = (id) => {
      //       const confirmDelete = window.confirm("Are you sure you want to delete this Article?");
      //       if (confirmDelete) {
      //         dispatch(removeArticle(id));
      //       }
      //     };
      const confirmDelete = async () => {
        if (!deleteReason.trim()) {
          alert('Please provide a reason for deleting this article.');
          return;
        }
      
        try {
          await dispatch(removeArticle({ id: selectedArticleId, reason: deleteReason })).unwrap();
          dispatch(fetchArticles());
          alert("Article soft-deleted successfully.");
        } catch (error) {
          alert("Failed to soft-delete article.");
        } finally {
          setShowDeleteModal(false);
          setDeleteReason('');
          setSelectedArticleId(null);
        }
      };
  return (
    <div className="container mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Article List</h2>
            <button className="btn btn-primary" onClick={() => navigate('/articles/customerwise')}>
              Customer Wise Article
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/articles/add')}>
              + Add Article
            </button>
          </div>
    
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Rate</th>
                    <th>Kooli</th>
                    <th>Speed</th>
                    <th>Tamil Name</th>
                    <th>Unload Charges</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length > 0 ? (
                    list.map((c, index) => (
                      <tr key={c.CustomerID || c.customerid}>
                        <td>{index + 1}</td>
                        <td>{c.name}</td>
                        <td>{c.rate}</td>
                        <td>{c.kooli}</td>
                        <td>{c.speed}</td>
                        <td>{c.tamil_name}</td>
                        <td>{c.unload_charges }</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() => navigate(`/articles/edit/${c.ID}`)}
                          >
                            Edit 
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => triggerDelete(c.ID)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center">No articles found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {showDeleteModal && (
  <div className="modal show d-block" tabIndex="-1">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Reason for Deletion</h5>
          <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
        </div>
        <div className="modal-body">
          <textarea
            className="form-control"
            rows="3"
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            placeholder="Enter reason for deleting this Article..."
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          <button className="btn btn-danger" onClick={confirmDelete}>Confirm Delete</button>
        </div>
      </div>
    </div>
  </div>
)}
        </div>
      );
}

export default ArticleList;