import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRoutePrefix, removeRouteprefix } from "./routePrefixThunks";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../api/config";

const RoutePrefixList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);
  const [reason, setReason] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { list, loading, error } = useSelector((state) => state.routePrefix);

  useEffect(() => {
    dispatch(fetchRoutePrefix());
    console.log(list);
  }, [dispatch]);

   const handleDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      // console.log("Delete URL:", `${BASE_URL}/route-prefix/${deleteId}`);
      await axios.patch(`${BASE_URL}/route-prefix/${deleteId}`, { reason });
      alert("Route Prefix deleted successfully!");
      setShowModal(false);
      setReason("");
      dispatch(fetchRoutePrefix());
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete route prefix");
    }
  };

  if (loading) return <p>Loading route prefixes...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Route Prefix List</h4>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/routeprefix/create")}
        >
          + Add New
        </button>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Prefix Code</th>
            <th>Route Name</th>
            {/* <th>Source</th>
            <th>Destination</th> */}
            <th>Distance (KM)</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(list) && list.length > 0 ? (
            list.map((route) => (
              <tr key={route.id}>
                <td>{route.id}</td>
                <td>{route.prefix_code}</td>
                <td>{route.route_name}</td>
                {/* <td>{route.source_place}</td>
                <td>{route.destination_place}</td> */}
                <td>{route.distance_km}</td>
                <td>{route.remarks}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => navigate(`/routeprefix/view/${route.id}`)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => navigate(`/routeprefix/edit/${route.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(route.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No route prefixes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
       {/* Delete Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Route Prefix</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Enter reason for deletion:</p>
                <textarea
                  className="form-control"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={confirmDelete}>Confirm Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutePrefixList;
