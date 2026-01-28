import { useEffect, useState } from "react";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleRetry = () => {
    if (navigator.onLine) {
      setIsOnline(true);
      window.location.reload(); // optional: refresh app on retry
    } else {
      alert("Still offline. Please check your connection.");
    }
  };

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  if (!isOnline) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#f8d7da",
          color: "#721c24",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 99999,
        }}
      >
        <h2>🚫 No Internet Connection</h2>
        <p>Please check your network and try again.</p>
        <button
          className="btn btn-danger"
          onClick={handleRetry}
          style={{ marginTop: "1rem" }}
        >
          🔁 Retry
        </button>
      </div>
    );
  }

  return null;
};

export default NetworkStatus;
