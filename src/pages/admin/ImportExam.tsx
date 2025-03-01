

import { useState } from "react";
import { supabase } from "../../utils/supabase-client"; // Import Supabase client

export default function ImportExam() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // 🟢 Function to Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  // 🟢 Function to Upload File to Supabase
  const uploadFile = async () => {
    if (!selectedFile) {
      alert("Please select a file!");
      return;
    }

    setUploading(true);
    const fileName = `exams/${Date.now()}-${selectedFile.name}`;

    const { error } = await supabase.storage.from("uploads").upload(fileName, selectedFile);

    if (error) {
      console.error("Upload error:", error);
      alert("File upload failed!");
    } else {
      alert("File uploaded successfully!");
    }

    setUploading(false);
  };





  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-3/4 mx-auto">
      {/* 🔵 File Upload Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Upload Exam File</h2>
        <div className="flex items-center gap-4">
          <input type="file" onChange={handleFileChange} className="border p-2 rounded" />
          <button
            onClick={uploadFile}
            disabled={uploading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {/* 🔵 Data Table Section */}

    </div>
  );
}
