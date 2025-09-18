import React, { useEffect, useState } from "react";

function Dashboard({ role }) {
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchData = async (start, end) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login.");
      return;
    }

    let endpoint = "";
    if (role === "employee") endpoint = "/employee";
    else if (role === "manager") endpoint = "/manager";
    else if (role === "admin") endpoint = "/admin";

    const query = start && end ? `?start=${start}&end=${end}` : "";

    try {
      const res = await fetch(`http://localhost:5000/api/dashboard${endpoint}${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setUploads(data.data);
      else setError(data.error || "Failed to fetch dashboard");
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  useEffect(() => {
    fetchData();
  }, [role]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>{(role || "").toUpperCase()} Dashboard</h2>

      {role === "manager" && (
        <div style={{ marginBottom: "20px" }}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button onClick={() => fetchData(startDate, endDate)}>Filter</button>
        </div>
      )}

      {uploads.length === 0 ? (
        <p>No uploads found.</p>
      ) : (
        <ul>
          {uploads.map((u) => (
            <li key={u._id}>
              {u.userId?.name} → {u.fileName || u.filename} (
              {new Date(u.createdAt).toLocaleString()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
