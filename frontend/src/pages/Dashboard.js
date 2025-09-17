import React, { useEffect, useState } from "react";

function Dashboard({ role }) {
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token"); // stored after login
    const storedRole = role || localStorage.getItem("role"); // fallback
    if (!token || !storedRole) {
      setError("No token or role found. Please login.");
      return;
    }

    let endpoint = "";
    if (storedRole === "employee") endpoint = "/employee";
    else if (storedRole === "manager") endpoint = "/manager";
    else if (storedRole === "admin") endpoint = "/admin";

    fetch(`http://localhost:5000/api/dashboard${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // JWT required
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUploads(data.data);
        else throw new Error(data.error || "Failed to fetch dashboard");
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setError(err.message);
      });
  }, [role]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    
    <div style={{ padding: "20px" }}>
        <button
            onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                window.location.href = "/login";
            }}
            >
          Logout
        </button>

      <h2>{(role || localStorage.getItem("role") || "").toUpperCase()} Dashboard</h2>
      {uploads.length === 0 ? (
        <p>No uploads found.</p>
      ) : (
        <ul>
          {uploads.map((u) => (
            <li key={u._id}>
              {u.userId?.name || "Unknown"} → {u.fileName || u.filename} (
              {new Date(u.createdAt).toLocaleString()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
