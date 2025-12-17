

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  SatExamOptions } from "../../data/examData";
import {  useNavigate, useParams } from "react-router-dom";

interface ExamData {
    selectedExam: string;
    selectedFile: File | string | null;
    passScore: string;
    duration: string;
    examType?: string; // Uncomment if needed
}

export default function ImportSatExam() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // const { pathname } = useLocation();
    // const editedPathName = pathname.split('/')[2];

    const [examData, setExamData] = useState<ExamData>({
        selectedExam: "SAT Placement Test Medium",
        selectedFile: null,
        passScore: "",
        duration: "",
        examType: "math",
    });
    const [uploading, setUploading] = useState(false);
    const [editExam] = useState<string | null>(id || null);

    const examTypes = [
        { id: "verbal", name: "Verbal" },
        { id: "math", name: "Math" },
    ];

    useEffect(() => {
        const fetchExamData = async () => {
            if (!editExam) return;
            try {
                const { data, error } = await supabase
                    .from("sat_exams")
                    .select("*")
                    .eq("id", editExam)
                    .single();
                if (error) throw error;

                setExamData({
                    selectedExam: data.title,
                    selectedFile: data.file_url,
                    passScore: data.pass_score.toString(), // Convert if number
                    duration: data.duration.toString(), // Convert if number
                    examType: data.exam_type,
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchExamData();
    }, [editExam]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setExamData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setExamData((prev) => ({ ...prev, selectedFile: file }));
    };

    const onClose = () => {
        navigate(-1);
        setExamData({
            selectedExam: "",
            selectedFile: null,
            passScore: "",
            duration: "",
            examType: "",
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (
            !examData.selectedExam ||
            !examData.selectedFile ||
            !examData.passScore ||
            !examData.duration 
        ) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setUploading(true);
        let fileUrl: string;

        if (examData.selectedFile && typeof examData.selectedFile !== "string") {
            const fileName = `sat_exams/${Date.now()}-${examData.selectedFile.name}`;
            const {  error: fileError } = await supabase.storage
                .from("uploads")
                .upload(fileName, examData.selectedFile);

            if (fileError) {
                console.error("Upload error:", fileError);
                toast.error("File upload failed!");
                setUploading(false);
                return;
            }

            fileUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
        } else {
            fileUrl = examData.selectedFile as string;
        }

        const operation = editExam
            ? supabase
                .from("sat_exams")
                .update([{
                    title: examData.selectedExam,
                    file_url: fileUrl,
                    pass_score: parseInt(examData.passScore),
                    duration: parseInt(examData.duration),
                    exam_type: examData.examType,
                }])
                .eq("id", editExam)
            : supabase.from("sat_exams").insert([{
                title: examData.selectedExam,
                file_url: fileUrl,
                pass_score: parseInt(examData.passScore),
                duration: parseInt(examData.duration),
                exam_type: examData.examType,
            }]);

        const { error: dbError } = await operation;

        if (dbError) {
            console.error("Database insert/update error:", dbError);
            toast.error("Failed to save exam info!");
        } else {
            toast.success(editExam ? "Exam updated successfully!" : "Exam added successfully!");
            navigate("/admin/manage-sat-exam");
        }

        setUploading(false);
    };

    return (
        <div className="min-h-screen md:w-[93%] w-[90%] mx-auto flex items-center justify-center py-5 mr-10">
            <div className="bg-white rounded-xl shadow-lg w-full">
                <ToastContainer position="top-right" autoClose={3000} />
                <div className="inset-0 bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-4 rounded-t-xl">
                    <h1 className="text-white text-xl font-semibold">
                        {editExam ? "Edit Exam" : "Import Exam"}
                    </h1>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                {SatExamOptions.map((item, index) => (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                        {/* <div className="space-y-2">
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
                        </div> */}
                        {/* Uncomment if you want examType */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Exam Type
                            </label>
                            <select
                                name="examType"
                                value={examData.examType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition duration-200"
                            >
                                {examTypes.map((type, index) => (
                                    <option key={index} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                                className={`px-5 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition duration-200 ${
                                    uploading ? "opacity-50 cursor-not-allowed" : ""
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