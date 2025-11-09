import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import { PracticeExamOptions } from "../../data/examData";
import {  useNavigate, useParams } from "react-router-dom";

interface ExamData {
  selectedExam: string;
  selectedFile: string | File | null; // Updated to include File
  passScore: string;
  duration: string;
  level: string;
}

export default function ImportPracticeExam() {
  const { id } = useParams();
  const navigate = useNavigate();


  const [examData, setExamData] = useState<ExamData>({
    selectedExam: "Reading",
    selectedFile: null, // No need for `as string | null` now
    passScore: "",
    duration: "",
    level: "",
  });
  const [uploading, setUploading] = useState(false);
  const [editExam] = useState(id || null);

  const levels = [
    { id: "a1", name: "A1" },
    { id: "a2", name: "A2" },
    { id: "b1", name: "B1" },
    { id: "b1+", name: "B1+" },
    { id: "b2", name: "B2" }
    ];


  useEffect(() => {
    const fetchExamData = async () => {
      if (!editExam) return;
      try {
        const { data, error } = await supabase
          .from("practice_exam")
          .select("*")
          .eq("id", editExam)
          .single();
        if (error) throw error;

        setExamData({
          selectedExam: data.title,
          selectedFile: data.exam_file,
          passScore: data.pass_score,
          duration: data.duration,
          level: data.level,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchExamData();
  }, [editExam]);

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>| React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExamData((prev) => ({ ...prev, [name]: value }));
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // File | null
    setExamData((prev) => ({ ...prev, selectedFile: file })); // TypeScript now accepts this
  };
  const onClose = () => {
    navigate(-1)
    setExamData({
      selectedExam: "Reading",
      selectedFile: null,
      passScore: "",
      duration: "",
      level: "",
    });
  };

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if (
      !examData.selectedExam ||
      !examData.selectedFile ||
      !examData.passScore ||
      !examData.duration ||
      !examData.level
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setUploading(true);
    let fileUrl = examData.selectedFile;

    // If a new file is selected, upload it
    if (examData.selectedFile && typeof examData.selectedFile !== "string") {
      const fileName = `exams/${Date.now()}-${(examData.selectedFile as File).name}`;
      const { error: fileError } = await supabase.storage
        .from("uploads")
        .upload(fileName, examData.selectedFile);

      if (fileError) {
        console.error("Upload error:", fileError);
        toast.error("File upload failed!");
        setUploading(false);
        return;
      }

      fileUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
    }

    const operation = editExam
      ? supabase
        .from("practice_exam")
        .update([{
          title: examData.selectedExam,
          exam_file: fileUrl,
          pass_score: parseInt(examData.passScore),
          duration: parseInt(examData.duration),
          level: examData.level,
        }])
        .eq("id", editExam)
      : supabase.from("practice_exam").insert([{
        title: examData.selectedExam,
        exam_file: fileUrl,
        pass_score: parseInt(examData.passScore),
        duration: parseInt(examData.duration),
        level: examData.level,
      }]);

    const { error: dbError } = await operation;

    if (dbError) {
      console.error("Database insert/update error:", dbError);
      toast.error("Failed to save exam info!");
    } else {
      toast.success(editExam ? "Exam updated successfully!" : "Exam added successfully!");
      navigate("/admin/manage-practice-exam");
      // onClose();
    }
    navigate("/admin/manage-practice-exam");

    setUploading(false);
  };

  return (
    <div className="min-h-screen md:w-[93%] w-[90%] mx-auto  flex items-center justify-center py-5 mr-10 ">
      <div className="bg-white rounded-xl shadow-lg w-full">
        <ToastContainer position="top-right" autoClose={3000} />
        {/* Header */}
        <div className="inset-0 bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-4 rounded-t-xl">
          <h1 className="text-white text-xl font-semibold">
            {editExam ? "Edit Practice Exam" : "Import Practice Exam"}
          </h1>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exam Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Exam Title
              </label>
              <select
                name="selectedExam"
                value={examData.selectedExam}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition duration-200"
              >
                {PracticeExamOptions.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Upload Exam File
              </label>
              {examData.selectedFile && typeof examData.selectedFile === "string" ? (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-600 text-sm">Current File:</span>
                  <a
                    href={examData.selectedFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inset-0 bg-gradient-to-r from-rose-500 to-pink-600 hover:underline text-white px-2 rounded-md"
                  >
                    View File
                  </a>
                </div>
              ) : null}
              <input
                type="file"
                onChange={handleFileChange}
                accept=".xlsx, .xls"
                className="w-full border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 transition duration-200"
              />
            </div>

            {/* Pass Score and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pass Score
                </label>
                <input
                  type="number"
                  name="passScore"
                  placeholder="Pass Score"
                  value={examData.passScore}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  name="duration"
                  placeholder="Duration (hours)"
                  max="100"
                  value={examData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition duration-200"
                />
              </div>
            </div>

            {/* Level */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Level
              </label>
              <select
                name="level"
                value={examData.level}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition duration-200"
              >
                <option value="">Select Level</option>
                {levels.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>


            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className={`px-5 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition duration-200 ${uploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {editExam
                  ? uploading
                    ? "Updating..."
                    : "Update Exam"
                  : uploading
                    ? "Uploading..."
                    : "Upload Exam"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
