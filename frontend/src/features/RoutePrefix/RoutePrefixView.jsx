import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../api/config";

function RoutePrefixView() {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/route-prefix/${id}`);
        setRoute(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Failed to fetch route prefix", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoute();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!route) return <p>Route not found</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">🚛 Route Prefix Details</h3>
      <div className="card shadow-sm p-3 mb-4">
        <div className="row mb-2">
          <div className="col-md-6">
            <p><strong>Prefix Code:</strong> {route.prefix_code}</p>
            <p><strong>Route Name:</strong> {route.route_name}</p>
            <p><strong>Created At:</strong> {new Date(route.created_at).toLocaleDateString()}</p>
          </div>
          <div className="col-md-6">
            <p><strong>Source:</strong> {route.source_place_name}</p>
            <p><strong>Destination:</strong> {route.destination_place_name}</p>
            <p><strong>Distance:</strong> {route.distance_km} km</p>
          </div>
        </div>
        <p><strong>Remarks:</strong> {route.remarks || "—"}</p>
      </div>

      <h5 className="mb-3">🛣️ Intermediate Places</h5>
      {route.intermediate_places && route.intermediate_places.length > 0 ? (
        <ol className="list-group list-group-numbered">
          {route.intermediate_places.map((p, index) => (
            <li key={p.place_id || index} className="list-group-item">
              {p.name} <span className="text-muted">(Order: {p.order})</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-muted">No intermediate places found for this route.</p>
      )}

      <button
        className="btn btn-secondary mt-4"
        onClick={() => navigate("/routeprefix")}
      >
        ⬅ Back to List
      </button>
    </div>
  );
}

export default RoutePrefixView;
