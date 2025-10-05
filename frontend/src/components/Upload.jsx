import React, { useState } from "react";

const Upload = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
    setError(null);
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      return alert("⚠️ Please select files first!");
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        console.error("❌ Upload failed:", data.error);
        setError(data.error || "Upload failed.");
        alert(`❌ Upload failed: ${data.error || "Unknown error"}`);
        return;
      }

      // ✅ Successful upload
      console.log("✅ Upload success:", data);
      alert("✅ Upload successful!");
      if (onUploadSuccess) onUploadSuccess(data.uploads);

    } catch (err) {
      setLoading(false);
      console.error("🚨 Upload error:", err);
      setError(err.message || "Error uploading file");
      alert("❌ Error uploading file: " + (err.message || ""));
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="block mb-2"
      />
      <button
        onClick={handleUpload}
        className={`${
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        } text-white px-4 py-2 ml-2 rounded transition`}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-2">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

export default Upload;
