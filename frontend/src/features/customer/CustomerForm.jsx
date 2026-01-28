import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addCustomer, editCustomer } from "./customerThunks";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../api/config";
import Select from "react-select";

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    nametamil: "",
    place: "",
    placetamil: "",
    address: "",
    pincode: "",
    email: "",
    cgstno: "",
    sgstno: "",
    customer_type: "",
    prefix: "",
    primaryphonenumber: "",
    sendsmsoptin: false,
    sendwhatsappoptin: false,
    whatsappnumber: "",
    place_id: "",
  });

  const [loading, setLoading] = useState(false);
  // --- NEW STATES for Translation Logic ---
  const [translationLoading, setTranslationLoading] = useState(false);
  const [translationError, setTranslationError] = useState(null);
  const [isTamilManuallyEdited, setIsTamilManuallyEdited] = useState(false);
  const [isPlaceTamilManuallyEdited, setIsPlaceTamilManuallyEdited] =
    useState(false);
  const [placeTranslationLoading, setPlaceTranslationLoading] = useState(false);
  const [placeTranslationError, setPlaceTranslationError] = useState(null);

  const { list: placeList } = useSelector((state) => state.place);
  // console.log(`place list: ${placeList}`);
  const [routePrefixes, setRoutePrefixes] = useState([]);
const [selectedPrefix, setSelectedPrefix] = useState(null);

useEffect(() => {
  axios.get(`${BASE_URL}/route-prefix`)
    .then((res) => {
      const options = res.data.map(p => ({
        value: p.prefix_code,
        label: p.prefix_code
      }));
      setRoutePrefixes(options);
    })
    .catch(err => console.error("Error loading route prefixes", err));
}, []);



  

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`${BASE_URL}/customers/${id}`)
        .then((res) => {
          const data = res.data;
          setFormData({
            name: data.name || "",
            nametamil: data.nametamil || "",
            place: data.place || "",
            placetamil: data.placetamil || "",
            address: data.address || "",
            pincode: data.pincode || "",
            email: data.email || "",
            cgstno: data.cgstno || "",
            sgstno: data.sgstno || "",
            customer_type: data.customer_type || "",
            prefix: data.prefix || "",
            primaryphonenumber: data.PrimaryPhoneNumber || "",
            sendsmsoptin: data.SendSMSOptIn || 0,
            sendwhatsappoptin: data.SendWhatsAppOptIn || 0,
            whatsappnumber: data.WhatsAppNumber || "",
            place_id: data.place_id || "",
          });
          if (data.prefix) {
            setSelectedPrefix({ value: data.prefix, label: data.prefix });
          }
        })
        .catch((err) => {
          console.error("Error loading customer data:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  // --- TRANSLATE FUNCTION ---
  const translatePlaceToTamil = async (text) => {
    setPlaceTranslationError(null);

    if (!text.trim()) {
      if (!isPlaceTamilManuallyEdited) {
        setFormData((prev) => ({ ...prev, placetamil: "" }));
      }
      return;
    }

    setPlaceTranslationLoading(true);
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=en|ta`
      );

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const data = await response.json();

      if (!isPlaceTamilManuallyEdited && data.responseData.translatedText) {
        setFormData((prev) => ({
          ...prev,
          placetamil: data.responseData.translatedText,
        }));
      }
    } catch (err) {
      console.error("Place translation error:", err);
      setPlaceTranslationError("Place translation failed");
      if (!isPlaceTamilManuallyEdited) {
        setFormData((prev) => ({
          ...prev,
          placetamil: "Translation Error",
        }));
      }
    } finally {
      setPlaceTranslationLoading(false);
    }
  };

  const translateText = async (text) => {
    setTranslationError(null);

    if (!text.trim()) {
      if (!isTamilManuallyEdited) {
        setFormData((prev) => ({ ...prev, nametamil: "" }));
      }
      return;
    }

    setTranslationLoading(true);

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=en|ta`
      );

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const data = await response.json();

      if (!isTamilManuallyEdited && data.responseData.translatedText) {
        setFormData((prev) => ({
          ...prev,
          nametamil: data.responseData.translatedText,
        }));
      }
    } catch (err) {
      console.error("Translation error:", err);
      setTranslationError("Translation failed. Please try again.");
      if (!isTamilManuallyEdited) {
        setFormData((prev) => ({
          ...prev,
          nametamil: "Translation Error",
        }));
      }
    } finally {
      setTranslationLoading(false);
    }
  };

  // --- DEBOUNCE TRANSLATION WHEN NAME CHANGES ---
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      translateText(formData.name);
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [formData.name]);
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      translatePlaceToTamil(formData.place);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [formData.place]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Reset manual edit flag if English name is changing
    if (name === "name") {
      setIsTamilManuallyEdited(false);
    }
    if (name === "place") setIsPlaceTamilManuallyEdited(false);
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // --- MANUAL TAMIL NAME OVERRIDE ---
  const handleTamilChange = (e) => {
    setIsTamilManuallyEdited(true);
    setFormData((prev) => ({
      ...prev,
      nametamil: e.target.value,
    }));
  };
  const handlePlaceTamilChange = (e) => {
    setIsPlaceTamilManuallyEdited(true);
    setFormData((prev) => ({
      ...prev,
      placetamil: e.target.value,
    }));
  };
  const handlePrefixChange = (selected) => {
    setSelectedPrefix(selected);
    setFormData((prev) => ({ ...prev, prefix: selected ? selected.value : "" }));

    // Reset place fields if prefix changes
    setFormData((prev) => ({
      ...prev,
      place: "",
      pincode: "",
      place_id: "",
      placetamil: "",
      consigner: "",  // clear consigner/consignee if applicable
      consignee: "",
    }));
  };
const filteredPlaces = useMemo(() => {
  if (!selectedPrefix) return placeList || [];
  return (placeList || []).filter(place => {
    if (!place.prefix) return false;
    const prefixes = place.prefix.split(',').map(p => p.trim());
    return prefixes.includes(selectedPrefix.value);
  });
}, [selectedPrefix, placeList]);
const placeOptions =
    filteredPlaces.map((place) => ({
    label: `${place.place} - ${place.district} - ${place.pincode}`,
    value: `${place.place} - ${place.district}`,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return; // prevent double submission
  setSubmitting(true);
    try {
      if (id) {
        await dispatch(editCustomer({ id, data: formData })).unwrap();
        console.log("Customer updated successfully.");
      } else {
        await dispatch(addCustomer(formData)).unwrap();
        console.log("Customer added successfully.");
      }
      navigate("/customers");
    } catch (error) {
      console.error("Error submitting form:", error);
       alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{id ? "Edit" : "Add"} Customer</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="border p-4 rounded shadow-sm bg-light"
        >
          <div className="row">
            <div className="col-md-12 mb-3">
              <Select
  options={routePrefixes}
  value={selectedPrefix}
  onChange={handlePrefixChange}
  placeholder="Select a Prefix"
  isClearable
  styles={{ container: (base) => ({ ...base, display: 'none' }) }}
/>
            </div>
            {/* Name Fields */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Name</label>
              <input
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Name (Tamil)</label>
              <input
                name="nametamil"
                className="form-control"
                value={formData.nametamil}
                onChange={handleChange}
              />
            </div>

            {/* Place Info */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Place</label>
              <Select
                options={placeOptions}
                value={
                  placeOptions.find((opt) => opt.value === formData.place) ||
                  null
                }
                onChange={(selected) => {
    const selectedValue = selected?.value || "";
    const selectedPlace = placeList.find(
      (p) => `${p.place} - ${p.district}` === selectedValue
    );
    
    setIsPlaceTamilManuallyEdited(false);
    setFormData((prev) => ({
      ...prev,
      place: selectedValue,
      place_id: selectedPlace?.id || "",
      pincode: selectedPlace?.pincode || "", // ⬅️ Set pincode automatically
    }));
  }}
                placeholder="Select a Place"
                isClearable
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Place (Tamil)</label>
              <input
                name="placetamil"
                className="form-control"
                value={
                  placeTranslationLoading && !isPlaceTamilManuallyEdited
                    ? "Translating..."
                    : formData.placetamil
                }
                onChange={handlePlaceTamilChange}
              />
              {placeTranslationError && (
                <div className="text-danger mt-1">{placeTranslationError}</div>
              )}
            </div>

            {/* Address and Contact */}
            <div className="col-md-12 mb-3">
              <label className="form-label">Address</label>
              <textarea
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Pincode</label>
              <input
                name="pincode"
                className="form-control"
                value={formData.pincode}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
  <label className="form-label">Customer Type</label>
  <select
    name="customer_type"
    className="form-control"
    value={formData.customer_type}
    onChange={handleChange}
    required
  >
    <option value="">Select Type</option>
    <option value="Consigner">Consigner</option>
    <option value="Consignee">Consignee</option>
  </select>
</div>

            {/* Tax and Prefix */}
            
            <div className="col-md-4 mb-3">
              <label className="form-label">CGST No</label>
              <input
                name="cgstno"
                className="form-control"
                value={formData.cgstno}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">SGST No</label>
              <input
                name="sgstno"
                className="form-control"
                value={formData.sgstno}
                onChange={handleChange}
              />
            </div>

            {/* Phone Fields */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Primary Phone Number</label>
              <input
                name="primaryphonenumber"
                className="form-control"
                value={formData.primaryphonenumber}
                onChange={handleChange}
                
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">WhatsApp Number</label>
              <input
                name="whatsappnumber"
                className="form-control"
                value={formData.whatsappnumber}
                onChange={handleChange}
              />
            </div>

           <div className="row align-items-center justify-content-center">
  {/* Place ID */}
  <div className="col-md-4 mb-3">
    <label className="form-label">Place ID</label>
    <input
      name="place_id"
      className="form-control"
      value={formData.place_id}
      onChange={handleChange}
      required
    />
  </div>

  {/* Send SMS Opt-In */}
  <div className="col-md-4 mb-3">
    <div className="form-check d-flex align-items-center h-100 pt-2">
      <input
        className="form-check-input me-2"
        type="checkbox"
        name="sendsmsoptin"
        id="smsOptIn"
        checked={formData.sendsmsoptin}
        onChange={handleChange}
      />
      <label className="form-check-label mb-0" htmlFor="smsOptIn">
        Send SMS Opt-In
      </label>
    </div>
  </div>

  {/* Send WhatsApp Opt-In */}
  <div className="col-md-4 mb-3">
    <div className="form-check d-flex align-items-center h-100 pt-2">
      <input
        className="form-check-input me-2"
        type="checkbox"
        name="sendwhatsappoptin"
        id="whatsappOptIn"
        checked={formData.sendwhatsappoptin}
        onChange={handleChange}
      />
      <label className="form-check-label mb-0" htmlFor="whatsappOptIn">
        Send WhatsApp Opt-In
      </label>
    </div>
  </div>
</div>

          </div>

          <button type="submit" className="btn btn-primary">
            {submitting ? "please wait.." : id ? "Update Customer" : "Add Customer"}
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => navigate("/customers")}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default CustomerForm;
