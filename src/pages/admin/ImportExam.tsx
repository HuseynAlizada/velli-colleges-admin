import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase-client";
import { toast, ToastContainer } from "react-toastify";
import { examOptions } from "../../data/examData";
import { useNavigate, useParams } from "react-router-dom";

export default function ImportExam() {
  const { id } = useParams();
  const navigate = useNavigate()

  const [examData, setExamData] = useState({
    selectedExam: "",
    selectedFile: null,
    passScore: "",
    totalScore: "",
    duration: "",
    level: "",
  });
  const [uploading, setUploading] = useState(false);
  const [editExam, setEditExam] = useState(id || null);

  useEffect(() => {
    const fetchExamData = async () => {
      if (!editExam) return;
      try {
        const { data, error } = await supabase.from("exams").select("*").eq("id", editExam).single();
        if (error) throw error;
        console.log(data);

        setExamData({
          selectedExam: data.title,
          selectedFile: data.file_url,
          passScore: data.pass_score,
          totalScore: data.total_score,
          duration: data.duration,
          level: data.level
        })

        // setExamData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchExamData();
  }, [editExam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setExamData((prev) => ({ ...prev, selectedFile: file }));
  };

  const onClose = () => {
    setExamData({
      selectedExam: "",
      selectedFile: null,
      passScore: "",
      totalScore: "",
      duration: "",
      level: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!examData.selectedExam || !examData.selectedFile || !examData.passScore || !examData.totalScore || !examData.duration || !examData.level) {
      alert("Please fill in all required fields.");
      return;
    }

    setUploading(true);
    const fileName = `exams/${Date.now()}-${examData.selectedFile.name}`;
    const { data: fileData, error: fileError } = await supabase.storage.from("uploads").upload(fileName, examData.selectedFile);

    if (fileError) {
      console.error("Upload error:", fileError);
      alert("File upload failed!");
      setUploading(false);
      return;
    }



    const fileUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;

    const operation = editExam ?
      supabase.from("exams").update([
        {
          title: examData.selectedExam,
          file_url: fileUrl,
          pass_score: examData.passScore,
          total_score: examData.totalScore,
          duration: examData.duration,
          level: examData.level,
        },
      ]).eq('id', editExam)
      :
      supabase.from("exams").insert([
        {
          title: examData.selectedExam,
          file_url: fileUrl,
          pass_score: examData.passScore,
          total_score: examData.totalScore,
          duration: examData.duration,
          level: examData.level,
        },
      ]);

    const { error: dbError } = await operation

    navigate('/admin/manage-exam')

    if (dbError) {
      console.error("Database insert error:", dbError);
      alert("Failed to save exam info!");
    } else {
      toast.success("File Added!");
      onClose();
    }

    setUploading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm w-full mt-10">
      <ToastContainer autoClose={3000} />
      <div className="bg-rose-500 px-6 py-4">
        <h1 className="text-white text-lg font-medium">Import Exam</h1>
      </div>

      <div className="p-6 w-full">
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Exam Title</label>
            <select name="selectedExam" value={examData.selectedExam} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
              {examOptions.map((item, index) => (
                <option key={index} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Upload Exam File</label>

            {examData.selectedFile && typeof examData.selectedFile === "string" ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-700 text-sm">Current File: </span>
                <a href={examData.selectedFile} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  View File
                </a>
              </div>
            ) : null}

            <input type="file" onChange={handleFileChange} className="w-full border p-2 rounded-md" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="number" name="passScore" placeholder="Pass Score" value={examData.passScore} onChange={handleChange} className="w-full border p-2 rounded-md" />
            <input type="number" name="totalScore" placeholder="Total Score" value={examData.totalScore} onChange={handleChange} className="w-full border p-2 rounded-md" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="number" name="duration" placeholder="Duration (hour)" max="100" value={examData.duration} onChange={handleChange} className="w-full border p-2 rounded-md" />
            <input type="text" name="level" placeholder="Level (e.g., A1, B2)" value={examData.level} onChange={handleChange} className="w-full border p-2 rounded-md" />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">Close</button>
            <button type="submit" disabled={uploading} className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600"> {!editExam ? (uploading ? "Uploading..." : "Upload") : (uploading ? "Editing..." : "Edit")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
