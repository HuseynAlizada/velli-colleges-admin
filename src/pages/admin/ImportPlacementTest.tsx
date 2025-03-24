// import { useEffect, useState } from "react";
// import { supabase } from "../../utils/supabase-client";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useLocation, useNavigate, useParams } from "react-router-dom";

// export default function ImportPlacementTest() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { pathname } = useLocation();
//   const editedPathName = pathname.split('/')[2];

//   console.log(editedPathName);

//   const [examData, setExamData] = useState({
//     selectedFile: null,
//     passScore: "",
//     duration: "",
//   });
//   const [uploading, setUploading] = useState(false);
//   const [editExam] = useState(id || null);

//   useEffect(() => {
//     const fetchExamData = async () => {
//       if (!editExam) return;
//       try {
//         const { data, error } = await supabase
//           .from("placement_test")
//           .select("*")
//           .eq("id", editExam)
//           .single();
//         if (error) throw error;

//         setExamData({
//           selectedFile: data.exam_file,
//           passScore: data.pass_score,
//           duration: data.duration,
//         });
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchExamData();
//   }, [editExam]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setExamData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0] || null;
//     setExamData((prev) => ({ ...prev, selectedFile: file }));
// };

//   const onClose = () => {
//     setExamData({
//       selectedFile: null,
//       passScore: "",
//       duration: "",
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (
//       !examData.selectedFile ||
//       !examData.passScore ||
//       !examData.duration
//     ) {
//       toast.error("Please fill in all required fields.");
//       return;
//     }

//     setUploading(true);
//     let fileUrl = examData.selectedFile;

//     if (examData.selectedFile && typeof examData.selectedFile !== "string") {
//       const fileName = `exams/${Date.now()}-${examData.selectedFile.name}`;
//       const { data: fileData, error: fileError } = await supabase.storage
//         .from("uploads")
//         .upload(fileName, examData.selectedFile);

//       if (fileError) {
//         console.error("Upload error:", fileError);
//         toast.error("File upload failed!");
//         setUploading(false);
//         return;
//       }

//       fileUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
//     }

//     const operation = editExam
//       ? supabase
//           .from("placement_test")
//           .update([{
//             exam_file: fileUrl,
//             pass_score: parseInt(examData.passScore),
//             duration: parseInt(examData.duration),
//           }])
//           .eq("id", editExam)
//       : supabase.from("placement_test").insert([{
//           exam_file: fileUrl,
//           pass_score: parseInt(examData.passScore),
//           duration: parseInt(examData.duration),
//         }]);

//     const { error: dbError } = await operation;

//     if (dbError) {
//       console.error("Database insert/update error:", dbError);
//       toast.error("Failed to save exam info!");
//     } else {
//       toast.success(editExam ? "Exam updated successfully!" : "Exam added successfully!");
//       navigate("/admin/manage-exam");
//       onClose();
//     }

//     setUploading(false);
//   };

//   return (
//     <div className="min-h-screen md:w-[93%] w-[90%] mx-auto  flex items-center justify-center py-5 mr-10">
//       <div className="bg-white rounded-xl shadow-lg w-full">
//         <ToastContainer position="top-right" autoClose={3000} />
//         <div className="inset-0 bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-4 rounded-t-xl">
//           <h1 className="text-white text-xl font-semibold">
//             {editExam ? "Edit Placement Test" : "Import Placement Test"}
//           </h1>
//         </div>

//         <div className="p-6">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 Upload Test File
//               </label>
//               {examData.selectedFile && typeof examData.selectedFile === "string" ? (
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className="text-gray-600 text-sm">Current File:</span>
//                   <a
//                     href={examData.selectedFile}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inset-0 bg-gradient-to-r from-rose-500 to-pink-600 hover:underline text-white px-2 rounded-md"
//                   >
//                     View File
//                   </a>
//                 </div>
//               ) : null}
//               <input
//                 type="file"
//                 onChange={handleFileChange}
//                 accept=".xlsx, .xls"
//                 className="w-full border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 transition duration-200"
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Pass Score
//                 </label>
//                 <input
//                   type="number"
//                   name="passScore"
//                   placeholder="Pass Score"
//                   value={examData.passScore}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition duration-200"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Duration (hours)
//                 </label>
//                 <input
//                   type="number"
//                   name="duration"
//                   placeholder="Duration (hours)"
//                   max="100"
//                   value={examData.duration}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition duration-200"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end gap-3 pt-4">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={uploading}
//                 className={`px-5 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition duration-200 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
//               >
//                 {editExam
//                   ? uploading
//                     ? "Updating..."
//                     : "Update Exam"
//                   : uploading
//                     ? "Uploading..."
//                     : "Upload Exam"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// } 



import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  useNavigate, useParams } from "react-router-dom";

// Define the type for examData
interface ExamData {
  selectedFile: string | File | null; // Can be string (URL), File (upload), or null
  passScore: string;
  duration: string;
}

export default function ImportPlacementTest() {
  const { id } = useParams<{ id?: string }>(); // id is optional since editExam can be null
  const navigate = useNavigate();
  // const { pathname } = useLocation();
  // const editedPathName = pathname.split("/")[2];


  const [examData, setExamData] = useState<ExamData>({
    selectedFile: null,
    passScore: "",
    duration: "",
  });
  const [uploading, setUploading] = useState(false);
  const [editExam] = useState(id || null);

  useEffect(() => {
    const fetchExamData = async () => {
      if (!editExam) return;
      try {
        const { data, error } = await supabase
          .from("placement_test")
          .select("*")
          .eq("id", editExam)
          .single();
        if (error) throw error;

        setExamData({
          selectedFile: data.exam_file, // string from DB
          passScore: data.pass_score.toString(), // Convert to string for input
          duration: data.duration.toString(), // Convert to string for input
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchExamData();
  }, [editExam]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setExamData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null; // File | null
    setExamData((prev) => ({ ...prev, selectedFile: file }));
  };

  const onClose = () => {
    setExamData({
      selectedFile: null,
      passScore: "",
      duration: "",
    });
    navigate("/admin/manage-exam"); // Added navigation to match typical behavior
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!examData.selectedFile || !examData.passScore || !examData.duration) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setUploading(true);
    let fileUrl: string | File | null = examData.selectedFile;

    if (examData.selectedFile && typeof examData.selectedFile !== "string") {
      const fileName = `exams/${Date.now()}-${examData.selectedFile.name}`;
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
    }

    const operation = editExam
      ? supabase
          .from("placement_test")
          .update([
            {
              exam_file: fileUrl,
              pass_score: parseInt(examData.passScore),
              duration: parseInt(examData.duration),
            },
          ])
          .eq("id", editExam)
      : supabase.from("placement_test").insert([
          {
            exam_file: fileUrl,
            pass_score: parseInt(examData.passScore),
            duration: parseInt(examData.duration),
          },
        ]);

    const { error: dbError } = await operation;

    if (dbError) {
      console.error("Database insert/update error:", dbError);
      toast.error("Failed to save exam info!");
    } else {
      toast.success(
        editExam ? "Exam updated successfully!" : "Exam added successfully!"
      );
      navigate("/admin/manage-placement-test");
      onClose();
    }

    setUploading(false);
  };

  return (
    <div className="min-h-screen md:w-[93%] w-[90%] mx-auto flex items-center justify-center py-5 mr-10">
      <div className="bg-white rounded-xl shadow-lg w-full">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="inset-0 bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-4 rounded-t-xl">
          <h1 className="text-white text-xl font-semibold">
            {editExam ? "Edit Placement Test" : "Import Placement Test"}
          </h1>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Upload Test File
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