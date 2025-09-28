import React, { useState } from "react";
import axios from "axios";

export default function InsightsPanel() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("manager");
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("⚠️ Please select a file");
      return;
    }

    setLoading(true);
    setError(null);
    setInsights(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("role", role);

      const res = await axios.post("http://localhost:5000/api/insights/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setInsights(res.data);
    } catch (err) {
      setError("❌ Failed to fetch insights");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-2xl max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📊 AI Insights Panel</h2>

      {/* File Input */}
      <input type="file" onChange={handleFileChange} className="mb-2" />

      {/* Role Selector */}
      <select value={role} onChange={(e) => setRole(e.target.value)} className="border p-2 ml-2">
        <option value="employee">Employee</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>

      {/* Error */}
      {error && <p className="text-red-500 mt-3">{error}</p>}

      {/* Insights */}
      {insights && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold">Summary:</h3>
          <p>{insights.summary}</p>

          <h3 className="text-lg font-semibold mt-3">Key Findings:</h3>
          <ul className="list-disc pl-6">
            {insights.keyFindings.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold mt-3">Anomalies:</h3>
          <ul className="list-disc pl-6">
            {insights.anomalies.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold mt-3">Recommendations:</h3>
          <ul className="list-disc pl-6">
            {insights.recommendations.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
