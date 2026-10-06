import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon paths (Leaflet + Vite quirk)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DEFAULT_CENTER = [23.2156, 72.6369]; // Gandhinagar, Gujarat — change if needed

export default function DeliveryLocation() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  const [coords, setCoords] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    addressLine: "",
    city: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (mapInstance.current) return;

    const map = L.map(mapRef.current).setView(DEFAULT_CENTER, 13);
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker(DEFAULT_CENTER, { draggable: true }).addTo(map);
    markerRef.current = marker;
    setCoords({ lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] });

    marker.on("dragend", () => {
      const { lat, lng } = marker.getLatLng();
      setCoords({ lat, lng });
    });

    map.on("click", (e) => {
      marker.setLatLng(e.latlng);
      setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation isn't supported by this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const latlng = [latitude, longitude];
        mapInstance.current.setView(latlng, 16);
        markerRef.current.setLatLng(latlng);
        setCoords({ lat: latitude, lng: longitude });
        setLocating(false);
      },
      () => {
        setError("Couldn't get your location. Pick a spot on the map instead.");
        setLocating(false);
      }
    );
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleContinue = () => {
    if (!coords) {
      setError("Please choose a delivery location on the map.");
      return;
    }
    if (!form.name || !form.phone || !form.addressLine || !form.city || !form.pincode) {
      setError("Please fill in all address fields.");
      return;
    }
    setError("");

    const deliveryDetails = { ...form, ...coords };
    // Persist so the checkout page can read it back.
    sessionStorage.setItem("pawfolio_delivery", JSON.stringify(deliveryDetails));

    navigate("/checkout");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Delivery location</h1>
        <p style={styles.subtitle}>Pin the drop-off spot and add your address details.</p>

        <div style={styles.mapCard}>
          <div ref={mapRef} style={styles.map} />
          <button
            type="button"
            onClick={useMyLocation}
            style={styles.locateBtn}
            disabled={locating}
          >
            {locating ? "Locating…" : "Use my current location"}
          </button>
        </div>

        <div style={styles.formCard}>
          <div style={styles.formGrid}>
            <Field label="Full name" name="name" value={form.name} onChange={handleChange} />
            <Field label="Phone number" name="phone" value={form.phone} onChange={handleChange} />
            <Field
              label="Address line"
              name="addressLine"
              value={form.addressLine}
              onChange={handleChange}
              full
            />
            <Field label="City" name="city" value={form.city} onChange={handleChange} />
            <Field label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} />
          </div>

          {coords && (
            <p style={styles.coordsText}>
              Pinned at {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </p>
          )}

          {error && <p style={styles.error}>{error}</p>}

          <button type="button" style={styles.continueBtn} onClick={handleContinue}>
            Continue to checkout
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, full }) {
  return (
    <label style={{ ...styles.field, gridColumn: full ? "1 / -1" : "auto" }}>
      <span style={styles.fieldLabel}>{label}</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        style={styles.input}
        autoComplete="off"
      />
    </label>
  );
}

const GREEN = "#2f5a48";
const CREAM = "#f4f2ea";

const styles = {
  page: {
    background: CREAM,
    minHeight: "100vh",
    padding: "48px 24px 96px",
    fontFamily: "'Georgia', 'Playfair Display', serif",
  },
  container: { maxWidth: 720, margin: "0 auto" },
  title: { fontSize: 40, fontWeight: 700, color: "#1c2b24", margin: 0 },
  subtitle: {
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: "#6b7a72",
    marginTop: 8,
    marginBottom: 32,
  },
  mapCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    marginBottom: 24,
  },
  map: { width: "100%", height: 320, borderRadius: 8, marginBottom: 12 },
  locateBtn: {
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    background: "transparent",
    border: `1px solid ${GREEN}`,
    color: GREEN,
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
  },
  formCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  fieldLabel: { fontSize: 13, color: "#6b7a72" },
  input: {
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #d8d6cc",
    fontSize: 15,
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  },
  coordsText: {
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    fontSize: 13,
    color: "#6b7a72",
    marginTop: 16,
  },
  error: {
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: "#b23b3b",
    fontSize: 14,
    marginTop: 12,
  },
  continueBtn: {
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    marginTop: 20,
    width: "100%",
    background: GREEN,
    color: "#fff",
    border: "none",
    padding: "14px 0",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
};
