import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPlaces } from "../place/placeThunks";
import { useParams, useNavigate } from "react-router-dom";
import { addRoutePrefix, editRouteprefix } from './routePrefixThunks';
import { BASE_URL } from '../../api/config';

const RoutePrefixForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: places } = useSelector((state) => state.place);

  const [form, setForm] = useState({
    source_place_id: '',
    destination_place_id: '',
    route_name: '',
    distance_km: '',
    remarks: '',
  });

  const [selectedPlaces, setSelectedPlaces] = useState([]); // ordered places
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchPlaces());
  }, [dispatch]);

  // fetch existing route prefix if edit mode
  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`${BASE_URL}/route-prefix/${id}`)
        .then((res) => {
          const data = res.data;
          setForm({
            source_place_id: data.source_place_id,
            destination_place_id: data.destination_place_id,
            route_name: data.route_name,
            distance_km: data.distance_km,
            remarks: data.remarks,
          });

          // ✅ ensure destination is always first
          const ordered = [
            data.destination_place_id,
            ...(data.intermediate_places?.map((p) => p.id) || []).filter(
              (pid) => pid !== data.destination_place_id
            ),
          ];
          setSelectedPlaces(ordered);
        })
        .catch((err) => console.error("Failed to load route prefix", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => {
      const updated = { ...prev, [name]: value };

      // Auto-generate route_name
      if (name === "source_place_id" || name === "destination_place_id") {
        const source = places.find(p => p.id === Number(name === "source_place_id" ? value : updated.source_place_id));
        const destination = places.find(p => p.id === Number(name === "destination_place_id" ? value : updated.destination_place_id));

        if (source && destination) {
          updated.route_name = `${source.place}-${destination.place}`;
        }
      }

      return updated;
    });

    // ✅ If destination changes, re-insert as first element
    if (name === "destination_place_id") {
      setSelectedPlaces((prev) => {
        const rest = prev.filter(pid => pid !== Number(value));
        return [Number(value), ...rest];
      });
    }
  };

  const handlePlaceToggle = (id) => {
    if (id === Number(form.destination_place_id)) return; // prevent unchecking destination
    setSelectedPlaces(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const moveUp = (index) => {
    if (index === 0) return; // destination is fixed at top
    const newOrder = [...selectedPlaces];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setSelectedPlaces(newOrder);
  };

  const moveDown = (index) => {
    if (index === 0) return; // destination cannot move
    if (index === selectedPlaces.length - 1) return;
    const newOrder = [...selectedPlaces];
    [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
    setSelectedPlaces(newOrder);
  };

  const getPlaceName = (id) => {
    const place = places.find(p => p.id === id);
    return place ? place.place : 'Unknown';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const confirmSubmit = async () => {
    try {
      const payload = {
        ...form,
        place_ids: selectedPlaces,
      };

      if (id) {
        await dispatch(editRouteprefix({ id, data: payload })).unwrap();
        alert(`Route prefix "${form.route_name}" updated successfully!`);
      } else {
        const res = await dispatch(addRoutePrefix(payload)).unwrap();
        alert(`Route prefix "${res.prefix_code}" created successfully!`);
      }

      navigate("/routeprefix");
    } catch (err) {
      alert("Failed to save route prefix");
      console.error(err);
    }
    setShowModal(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h4>{id ? "Edit Route Prefix" : "Create Route Prefix"}</h4>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Source Place</label>
            <select
              name="source_place_id"
              value={form.source_place_id}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Source</option>
              {places.map(p => (
                <option key={p.id} value={p.id}>{p.place}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Destination Place</label>
            <select
              name="destination_place_id"
              value={form.destination_place_id}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Destination</option>
              {places.map(p => (
                <option key={p.id} value={p.id}>{p.place}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Route Name</label>
            <input
              type="text"
              name="route_name"
              className="form-control"
              value={form.route_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Distance (KM)</label>
            <input
              type="number"
              name="distance_km"
              className="form-control"
              value={form.distance_km}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Remarks</label>
          <textarea
            name="remarks"
            className="form-control"
            value={form.remarks}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Select Route Places (excluding source/destination)</label>
          <div className="form-control" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {places.map(place => {
              const id = Number(place.id);
              const isDisabled = id === Number(form.source_place_id);
              const isDestination = id === Number(form.destination_place_id);
              return (
                <div className="form-check" key={place.id}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`place-${place.id}`}
                    disabled={isDisabled || isDestination}
                    checked={selectedPlaces.includes(id)}
                    onChange={() => handlePlaceToggle(id)}
                  />
                  <label className="form-check-label">
                    {place.place} {isDestination && "(Destination)"}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {selectedPlaces.length > 0 && (
          <div className="mb-3">
            <label className="form-label">Order of Selected Places</label>
            <ul className="list-group">
              {selectedPlaces.map((pid, idx) => (
                <li
                  key={pid}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {getPlaceName(pid)}
                  {idx !== 0 && ( // ✅ prevent moving destination
                    <div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => moveUp(idx)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => moveDown(idx)}
                      >
                        ↓
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          {id ? "Update Route Prefix" : "Create Route Prefix"}
        </button>
      </form>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {id ? "Confirm Update" : "Confirm Route Creation"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Route Name:</strong> {form.route_name}</p>
                <p><strong>Distance:</strong> {form.distance_km} KM</p>
                <p><strong>From:</strong> {getPlaceName(Number(form.source_place_id))}</p>
                <p><strong>To:</strong> {getPlaceName(Number(form.destination_place_id))}</p>
                <p><strong>Intermediate Places:</strong></p>
                <ol>
                  {selectedPlaces.map((pid, idx) => (
                    <li key={pid}>
                      {getPlaceName(pid)} {idx === 0 && "(Destination)"}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={confirmSubmit}>
                  {id ? "Confirm & Update" : "Confirm & Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutePrefixForm;
