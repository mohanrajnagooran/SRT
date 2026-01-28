import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlaces, removePlace } from "./placeThunks";
import { useNavigate } from "react-router-dom";

function PlaceList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector((state) => state.place);

  // delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");

  useEffect(() => {
    dispatch(fetchPlaces());
  }, [dispatch]);
  // console.log("Place List:", list);
  const triggerDelete = (id) => {
    setSelectedPlaceId(id);
    setShowDeleteModal(true);
  };

  // const handleDelete = (id) => {
  //     const confirmDelete = window.confirm("Are you sure you want to delete this Place?");
  //     if (confirmDelete) {
  //       dispatch(removePlace(id));
  //     }
  //   };
  const confirmDelete = async () => {
    if (!deleteReason.trim()) {
      alert("Please provide a reason for deleting this Place.");
      return;
    }

    try {
      await dispatch(
        removePlace({ id: selectedPlaceId, reason: deleteReason })
      ).unwrap();
      dispatch(fetchPlaces());
      alert("Place soft-deleted successfully.");
    } catch (error) {
      alert("Failed to soft-delete Place.");
    } finally {
      setShowDeleteModal(false);
      setDeleteReason("");
      setSelectedPlaceId(null);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Place List</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/places/add")}
        >
          + Add Place
        </button>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/places/PlacePriority")}
        >
          Place Priority
        </button>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/places/uptoplaces")}
        >
          Up To Places
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
                <th>Place</th>
                <th>District</th>
                <th>State</th>
                <th>Pincode</th>
                <th>Prefix</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.length > 0 ? (
                list.map((c, index) => (
                  <tr key={c.id}>
                    <td>{index + 1}</td>
                    <td>{c.place}</td>
                    <td>{c.district}</td>
                    <td>{c.state}</td>
                    <td>{c.pincode}</td>
                    <td>{c.prefix}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => navigate(`/places/edit/${c.id}`)}
                      >
                        Edit
                      </button>
                      <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => triggerDelete(c.id)}
                              >
                                Delete
                              </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">
                    No places found.
                  </td>
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
            placeholder="Enter reason for deleting this Place..."
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

export default PlaceList;
