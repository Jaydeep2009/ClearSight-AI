import React, { useEffect, useState } from "react";
import InsightsPanel from "./InsightsPanel";
import Upload from "../components/Upload";

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
      const res = await fetch(
        `http://localhost:5000/api/dashboard${endpoint}${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) setUploads(data.data);
      else setError(data.error || "Failed to fetch dashboard");
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  // ✅ Refresh dashboard when role changes
  useEffect(() => {
    fetchData();
  }, [role]);

  // ✅ Triggered when file uploads successfully
  const handleUploadSuccess = () => {
    fetchData(); // refresh uploads after successful upload
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{(role || "").toUpperCase()} Dashboard</h2>

      {/* Manager filters + insights */}
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

          <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-2xl font-bold mb-6">📈 Manager Dashboard</h1>
            <InsightsPanel />
          </div>
        </div>
      )}

      {/* Upload section */}
      <div style={{ marginTop: "20px" }}>
        <h3>Upload a File</h3>
        {/* ✅ Now passes callback to refresh dashboard */}
        <Upload onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Uploaded files list */}
      {uploads.length === 0 ? (
        <p>No uploads found.</p>
      ) : (
        <ul>
          {uploads.map((u) => (
            <li
              key={u._id}
              style={{
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "6px",
              }}
            >
              <p>
                <strong>User:</strong> {u.userId?.name || "Unknown"}
              </p>
              <p>
                <strong>File:</strong> {u.fileName || u.filename}
              </p>
              <p>
                <strong>Uploaded At:</strong>{" "}
                {new Date(u.createdAt).toLocaleString()}
              </p>

              {/* 📊 Stats */}
              {u.stats && (
                <div style={{ marginTop: "10px" }}>
                  <h4>📊 Stats</h4>
                  <pre
                    style={{
                      background: "#f9f9f9",
                      padding: "10px",
                      borderRadius: "4px",
                    }}
                  >
                    {JSON.stringify(u.stats, null, 2)}
                  </pre>
                </div>
              )}

              {/* 🤖 AI Insights (structured display) */}
              {u.aiMeta && (
                <div style={{ marginTop: "10px" }}>
                  <h4>🤖 AI Insights</h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                      background: "#fafafa",
                      borderRadius: "6px",
                      padding: "10px",
                    }}
                  >
                    <div>
                      <h5>🧠 Summary</h5>
                      <p>{u.aiMeta.summary || "No summary available."}</p>
                    </div>
                    <div>
                      <h5>🔑 Key Findings</h5>
                      <ul>
                        {u.aiMeta.keyFindings?.length
                          ? u.aiMeta.keyFindings.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))
                          : "None"}
                      </ul>
                    </div>
                    <div>
                      <h5>⚠️ Anomalies</h5>
                      <ul>
                        {u.aiMeta.anomalies?.length
                          ? u.aiMeta.anomalies.map((a, i) => <li key={i}>{a}</li>)
                          : "None"}
                      </ul>
                    </div>
                    <div>
                      <h5>💡 Recommendations</h5>
                      <ul>
                        {u.aiMeta.recommendations?.length
                          ? u.aiMeta.recommendations.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))
                          : "None"}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* 🧾 Debug: Raw AI Meta */}
              {u.aiMeta && (
                <details style={{ marginTop: "10px" }}>
                  <summary>See full AI metadata (JSON)</summary>
                  <pre
                    style={{
                      background: "#f4f4f4",
                      padding: "10px",
                      borderRadius: "4px",
                      overflowX: "auto",
                    }}
                  >
                    {JSON.stringify(u.aiMeta, null, 2)}
                  </pre>
                </details>
              )}
            </li>
          ))}
        </ul>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Dashboard;
