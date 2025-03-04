// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { supabase } from "../../utils/supabase-client";
// import { Plus, Pencil, Trash2 } from "lucide-react";
// import * as XLSX from "xlsx";

// const ExamDetails = () => {
//     const { id } = useParams();
//     const [questions, setQuestions] = useState([]);
//     const [level, setLevel] = useState<string | null>(null)
//     const [title, setTitle] = useState<string | null>(null)

//     useEffect(() => {
//         const fetchExamData = async () => {
//             try {
//                 // Fetch the exam details
//                 const { data: examData, error: examError } = await supabase
//                     .from("exams")
//                     .select("*")
//                     .eq("id", id)
//                     .single();

//                 if (examError) throw examError;
//                 console.log(examData);
//                 setLevel(examData.level)
//                 setTitle(examData.title)


//                 // Extract XLS file URL
//                 const fileUrl = examData.file_url;

//                 // Fetch the XLS file as a Blob
//                 const response = await fetch(fileUrl);
//                 const blob = await response.blob();

//                 // Read the XLS file
//                 const reader = new FileReader();
//                 reader.readAsArrayBuffer(blob);
//                 reader.onload = (e) => {
//                     const data = new Uint8Array(e.target.result);
//                     const workbook = XLSX.read(data, { type: "array" });

//                     // Assuming the first sheet contains the questions
//                     const sheetName = workbook.SheetNames[0];
//                     const sheet = workbook.Sheets[sheetName];

//                     // Convert the sheet to JSON format
//                     const parsedData = XLSX.utils.sheet_to_json(sheet);
//                     console.log(parsedData[0]);


//                     // Set the parsed questions in state
//                     setQuestions(parsedData);
//                 };
//             } catch (err) {
//                 console.error("Error fetching exam data:", err);
//             }
//         };

//         fetchExamData();
//     }, [id]);

//     const handleEdit = (id: string) => {
//         console.log("Edit question:", id);
//     };
//     // const handleDelete = async (index: number) => {
//     //     try {
//     //         // Remove the selected question
//     //         const updatedQuestions = questions.filter((_, i) => i !== index);
//     //         setQuestions(updatedQuestions); // Update UI immediately
    
//     //         const filePath = `exams/${id}.xlsx`;
    
//     //         // If no questions remain, delete the file
//     //         if (updatedQuestions.length === 0) {
//     //             await supabase.storage.from("uploads").remove([filePath]);
//     //             await supabase.from("exams").update({ file_url: null }).eq("id", id);
//     //             console.log("Excel file deleted because no questions remain.");
//     //             return;
//     //         }
    
//     //         // **STEP 1: Convert updated questions to Excel format**
//     //         const ws = XLSX.utils.json_to_sheet(updatedQuestions);
//     //         const wb = XLSX.utils.book_new();
//     //         XLSX.utils.book_append_sheet(wb, ws, "Questions");
    
//     //         // Convert workbook to Blob
//     //         const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     //         const blob = new Blob([wbout], {
//     //             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     //         });
    
//     //         // **STEP 2: Delete the old file first**
//     //         await supabase.storage.from("uploads").remove([filePath]);
    
//     //         // **STEP 3: Wait for the deletion to complete**
//     //         await new Promise((resolve) => setTimeout(resolve, 2000)); // Ensure deletion
    
//     //         // **STEP 4: Upload the updated Excel file**
//     //         const { error: uploadError } = await supabase.storage
//     //             .from("uploads")
//     //             .upload(filePath, blob, { upsert: false });
    
//     //         if (uploadError) throw uploadError;
    
//     //         // **STEP 5: Fetch the new file URL**
//     //         const { data: publicURLData } = supabase.storage.from("uploads").getPublicUrl(filePath);
//     //         const newFileUrl = publicURLData.publicUrl;
    
//     //         // **STEP 6: Update file_url in the database**
//     //         const { error: updateError } = await supabase
//     //             .from("exams")
//     //             .update({ file_url: newFileUrl })
//     //             .eq("id", id);
    
//     //         if (updateError) throw updateError;
    
//     //         console.log("Excel file updated successfully.");
//     //     } catch (error) {
//     //         console.error("Error updating Excel file:", error);
//     //     }
//     // };
    
    
//     const handleDelete = async (index: number) => {
//         try {
//             console.log("Deleting question at index:", index);
//             const updatedQuestions = questions.filter((_, i) => i !== index);
//             console.log("Updated questions count:", updatedQuestions.length);
//             setQuestions(updatedQuestions);
    
//             const filePath = `exams/${id}.xlsx`;
//             console.log("File path:", filePath);
    
//             if (updatedQuestions.length === 0) {
//                 console.log("No questions left, deleting file...");
//                 const { error: deleteError } = await supabase.storage
//                     .from("uploads")
//                     .remove([filePath]);
//                 if (deleteError) throw deleteError;
    
//                 const { error: updateError } = await supabase
//                     .from("exams")
//                     .update({ file_url: null })
//                     .eq("id", id);
//                 if (updateError) throw updateError;
    
//                 console.log("File deleted successfully");
//                 return;
//             }
    
//             // Step 3: Convert updated questions to Excel format
//             console.log("Converting to Excel...");
//             const ws = XLSX.utils.json_to_sheet(updatedQuestions);
//             const wb = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(wb, ws, "Questions");
    
//             // Step 4: Write the workbook to an array buffer
//             const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//             console.log("Excel file size:", wbout.byteLength); // Use byteLength for Uint8Array
    
//             // Step 5: Create blob from workbook
//             const blob = new Blob([wbout], {
//                 type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//             });
//             console.log("Blob size:", blob.size); // Verify blob creation
    
//             // Step 6: Upload to Supabase
//             console.log("Uploading to Supabase...");
//             const { error: uploadError } = await supabase.storage
//                 .from("uploads")
//                 .upload(filePath, blob, { upsert: true, cacheControl: "3600" });
    
//             if (uploadError) throw uploadError;
    
//             // Step 7: Get the new public URL
//             const { data: publicURLData } = supabase.storage
//                 .from("uploads")
//                 .getPublicUrl(filePath);
//             console.log("New URL:", publicURLData.publicUrl);
    
//             // Step 8: Update the exam record with new file URL
//             const { error: updateError } = await supabase
//                 .from("exams")
//                 .update({ file_url: publicURLData.publicUrl })
//                 .eq("id", id);
//             if (updateError) throw updateError;
    
//             console.log("Delete operation completed successfully");
    
//         } catch (error) {
//             console.error("Detailed error:", error);
//             setQuestions(questions); // Revert state on error
//             alert("Failed to delete question. Check console for details.");
//         }
//     };
    




//     return (
//         <div className="bg-white rounded-lg shadow-sm w-full">
//             {/* Header */}
//             <div className="p-6 flex justify-between items-center border-b">
//                 <h1 className="text-xl font-semibold text-gray-900">Questions</h1>
//             </div>
//             {/* Table */}
//             <div className="overflow-x-auto">
//                 <table className="w-full">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct Option</th>
//                             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {questions.map((question, index) => (
//                             <tr key={index} className="hover:bg-gray-50">
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
//                                 <td className="px-6 py-4 text-sm text-gray-900">{question.Question}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{title}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{level}</td>
//                                 <td className="px-6 py-4 text-sm text-gray-900">{question[question['Correct Option']]}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                     <div className="flex justify-end gap-2">
//                                         <button
//                                             onClick={() => handleEdit(index)}
//                                             className="inline-flex items-center px-3 py-1.5 bg-amber-500 text-white text-sm font-medium rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
//                                         >
//                                             <Pencil className="w-4 h-4 mr-1" />
//                                             Edit
//                                         </button>
//                                         <button
//                                             onClick={() => handleDelete(index)}
//                                             className="inline-flex items-center px-3 py-1.5 bg-rose-500 text-white text-sm font-medium rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
//                                         >
//                                             <Trash2 className="w-4 h-4 mr-1" />
//                                             Delete
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default ExamDetails;










// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { supabase } from "../../utils/supabase-client";
// import {  Pencil, Trash2 } from "lucide-react";
// import * as XLSX from "xlsx";

// const ExamDetails = () => {
//     const { id } = useParams();
//     const [questions, setQuestions] = useState([]);
//     const [level, setLevel] = useState<string | null>(null);
//     const [title, setTitle] = useState<string | null>(null);
//     const [editingIndex, setEditingIndex] = useState<number | null>(null);
//     const [editedQuestion, setEditedQuestion] = useState<any>(null);

//     useEffect(() => {
//         const fetchExamData = async () => {
//             try {
//                 console.log("Fetching exam data for ID:", id);
//                 const { data: examData, error: examError } = await supabase
//                     .from("exams")
//                     .select("*")
//                     .eq("id", id)
//                     .single();

//                 if (examError) throw examError;
//                 console.log("Exam data:", examData);
//                 setLevel(examData.level);
//                 setTitle(examData.title);

//                 const fileUrl = examData.file_url;
//                 if (!fileUrl) {
//                     console.log("No file URL found, setting empty questions");
//                     setQuestions([]);
//                     return;
//                 }

//                 // Add cache-busting to avoid fetching cached file
//                 const urlWithTimestamp = `${fileUrl}?t=${Date.now()}`;
//                 console.log("Fetching file from URL:", urlWithTimestamp);
//                 const response = await fetch(urlWithTimestamp);
//                 if (!response.ok) throw new Error(`Failed to fetch Excel file: ${response.statusText}`);
//                 const blob = await response.blob();

//                 const reader = new FileReader();
//                 reader.readAsArrayBuffer(blob);
//                 reader.onload = (e) => {
//                     const data = new Uint8Array(e.target.result);
//                     const workbook = XLSX.read(data, { type: "array" });
//                     const sheetName = workbook.SheetNames[0];
//                     const sheet = workbook.Sheets[sheetName];
//                     const parsedData = XLSX.utils.sheet_to_json(sheet);
//                     console.log("Parsed questions from file:", parsedData);
//                     setQuestions(parsedData);
//                 };
//                 reader.onerror = () => {
//                     console.error("Error reading Excel file");
//                 };
//             } catch (err) {
//                 console.error("Error fetching exam data:", err);
//             }
//         };

//         fetchExamData();
//     }, [id]);

//     const handleEdit = (index: number) => {
//         console.log("Editing question at index:", index, questions[index]);
//         setEditingIndex(index);
//         setEditedQuestion({ ...questions[index] });
//     };

//     const handleSaveEdit = async () => {
//         try {
//             console.log("Saving edited question:", editedQuestion);
//             const updatedQuestions = questions.map((q, i) =>
//                 i === editingIndex ? editedQuestion : q
//             );
//             console.log("Updated questions:", updatedQuestions);
//             setQuestions(updatedQuestions);
//             setEditingIndex(null);
//             setEditedQuestion(null);

//             const filePath = `exams/${id}.xlsx`; // Ensure consistent file naming
//             console.log("File path for upload:", filePath);

//             // Convert to Excel
//             const ws = XLSX.utils.json_to_sheet(updatedQuestions);
//             const wb = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(wb, ws, "Questions");

//             const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//             console.log("Excel file size:", wbout.byteLength);
//             const blob = new Blob([wbout], {
//                 type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//             });
//             console.log("Blob size:", blob.size);

//             // Upload to Supabase with upsert to overwrite existing file
//             console.log("Uploading to Supabase...");
//             const { error: uploadError } = await supabase.storage
//                 .from("uploads")
//                 .upload(filePath, blob, {
//                     upsert: true, // Overwrite the existing file
//                     cacheControl: "3600",
//                 });

//             if (uploadError) {
//                 console.error("Upload error:", uploadError);
//                 throw uploadError;
//             }
//             console.log("File uploaded successfully");

//             // Get the new public URL
//             const { data: publicURLData } = supabase.storage
//                 .from("uploads")
//                 .getPublicUrl(filePath);
//             const newFileUrl = `${publicURLData.publicUrl}?t=${Date.now()}`; // Add timestamp to avoid caching
//             console.log("New public URL:", newFileUrl);

//             // Update the database with the new URL
//             console.log("Updating database...");
//             const { error: updateError } = await supabase
//                 .from("exams")
//                 .update({ file_url: newFileUrl })
//                 .eq("id", id);

//             if (updateError) {
//                 console.error("Database update error:", updateError);
//                 throw updateError;
//             }
//             console.log("Database updated successfully");

//             // Re-fetch data to confirm update (optional)
//             await fetchExamData();
//         } catch (error) {
//             console.error("Error saving edit:", error);
//             setQuestions(questions); // Revert on failure
//             setEditingIndex(null);
//             setEditedQuestion(null);
//             // alert("Failed to save changes. Check console for details.");
//         }
//     };

//     const handleDelete = async (index: number) => {
//         try {
//             const updatedQuestions = questions.filter((_, i) => i !== index);
//             setQuestions(updatedQuestions);

//             const filePath = `exams/${id}.xlsx`;

//             if (updatedQuestions.length === 0) {
//                 const { error: deleteError } = await supabase.storage
//                     .from("uploads")
//                     .remove([filePath]);
//                 if (deleteError) throw deleteError;

//                 const { error: updateError } = await supabase
//                     .from("exams")
//                     .update({ file_url: null })
//                     .eq("id", id);
//                 if (updateError) throw updateError;

//                 console.log("File deleted successfully");
//                 return;
//             }

//             const ws = XLSX.utils.json_to_sheet(updatedQuestions);
//             const wb = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(wb, ws, "Questions");

//             const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//             const blob = new Blob([wbout], {
//                 type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//             });

//             const { error: uploadError } = await supabase.storage
//                 .from("uploads")
//                 .upload(filePath, blob, { upsert: true, cacheControl: "3600" });
//             if (uploadError) throw uploadError;

//             const { data: publicURLData } = supabase.storage
//                 .from("uploads")
//                 .getPublicUrl(filePath);

//             const { error: updateError } = await supabase
//                 .from("exams")
//                 .update({ file_url: publicURLData.publicUrl })
//                 .eq("id", id);
//             if (updateError) throw updateError;

//             console.log("Question deleted successfully");
//         } catch (error) {
//             console.error("Error in handleDelete:", error);
//             setQuestions(questions);
//             alert("Failed to delete question.");
//         }
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         console.log(`Changing ${name} to ${value}`);
//         setEditedQuestion((prev) => ({ ...prev, [name]: value }));
//     };

//     return (
//         <div className="bg-white rounded-lg shadow-sm w-full">
//             <div className="p-6 flex justify-between items-center border-b">
//                 <h1 className="text-xl font-semibold text-gray-900">Questions</h1>
//             </div>
//             <div className="overflow-x-auto">
//                 <table className="w-full">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct Option</th>
//                             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {questions.map((question, index) => (
//                             <tr key={index} className="hover:bg-gray-50">
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
//                                 <td className="px-6 py-4 text-sm text-gray-900">
//                                     {editingIndex === index ? (
//                                         <input
//                                             type="text"
//                                             name="Question"
//                                             value={editedQuestion?.Question || ""}
//                                             onChange={handleInputChange}
//                                             className="w-full border rounded p-1"
//                                         />
//                                     ) : (
//                                         question.Question
//                                     )}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{title}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{level}</td>
//                                 <td className="px-6 py-4 text-sm text-gray-900">
//                                     {editingIndex === index ? (
//                                         <input
//                                             type="text"
//                                             name={question["Correct Option"]}
//                                             value={editedQuestion?.[question["Correct Option"]] || ""}
//                                             onChange={handleInputChange}
//                                             className="w-full border rounded p-1"
//                                         />
//                                     ) : (
//                                         question[question["Correct Option"]]
//                                     )}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                     <div className="flex justify-end gap-2">
//                                         {editingIndex === index ? (
//                                             <>
//                                                 <button
//                                                     onClick={handleSaveEdit}
//                                                     className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600"
//                                                 >
//                                                     Save
//                                                 </button>
//                                                 <button
//                                                     onClick={() => {
//                                                         setEditingIndex(null);
//                                                         setEditedQuestion(null);
//                                                     }}
//                                                     className="inline-flex items-center px-3 py-1.5 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600"
//                                                 >
//                                                     Cancel
//                                                 </button>
//                                             </>
//                                         ) : (
//                                             <button
//                                                 onClick={() => handleEdit(index)}
//                                                 className="inline-flex items-center px-3 py-1.5 bg-amber-500 text-white text-sm font-medium rounded-md hover:bg-amber-600"
//                                             >
//                                                 <Pencil className="w-4 h-4 mr-1" />
//                                                 Edit
//                                             </button>
//                                         )}
//                                         <button
//                                             onClick={() => handleDelete(index)}
//                                             className="inline-flex items-center px-3 py-1.5 bg-rose-500 text-white text-sm font-medium rounded-md hover:bg-rose-600"
//                                         >
//                                             <Trash2 className="w-4 h-4 mr-1" />
//                                             Delete
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default ExamDetails;














import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../utils/supabase-client";
import { Plus, Pencil, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";

const ExamDetails = () => {
    const { id } = useParams();
    const [questions, setQuestions] = useState([]);
    const [level, setLevel] = useState<string | null>(null);
    const [title, setTitle] = useState<string | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editedQuestion, setEditedQuestion] = useState<any>(null);
    const [loading, setLoading] = useState(false); // Added for UI feedback

    useEffect(() => {
        const fetchExamData = async () => {
            try {
                setLoading(true);
                console.log("Fetching exam data for ID:", id);
                const { data: examData, error: examError } = await supabase
                    .from("exams")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (examError) throw examError;
                console.log("Exam data:", examData);
                setLevel(examData.level);
                setTitle(examData.title);

                const fileUrl = examData.file_url;
                if (!fileUrl) {
                    console.log("No file URL found, setting empty questions");
                    setQuestions([]);
                    setLoading(false);
                    return;
                }

                const urlWithTimestamp = `${fileUrl}?t=${Date.now()}`;
                console.log("Fetching file from URL:", urlWithTimestamp);
                const response = await fetch(urlWithTimestamp);
                if (!response.ok) throw new Error(`Failed to fetch Excel file: ${response.statusText}`);
                const blob = await response.blob();

                const reader = new FileReader();
                reader.readAsArrayBuffer(blob);
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: "array" });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const parsedData = XLSX.utils.sheet_to_json(sheet);
                    console.log("Parsed questions from file:", parsedData);
                    setQuestions(parsedData);
                    setLoading(false);
                };
                reader.onerror = () => {
                    console.error("Error reading Excel file");
                    setLoading(false);
                };
            } catch (err) {
                console.error("Error fetching exam data:", err);
                setLoading(false);
            }
        };

        fetchExamData();
    }, [id]);

    const handleEdit = (index: number) => {
        console.log("Editing question at index:", index, questions[index]);
        setEditingIndex(index);
        setEditedQuestion({ ...questions[index] });
    };

    const handleSaveEdit = async () => {
        try {
            setLoading(true);
            console.log("Saving edited question:", editedQuestion);
            const updatedQuestions = questions.map((q, i) =>
                i === editingIndex ? editedQuestion : q
            );
            console.log("Updated questions:", updatedQuestions);
            setQuestions(updatedQuestions);
            setEditingIndex(null);
            setEditedQuestion(null);

            const filePath = `exams/${id}.xlsx`;
            console.log("File path for upload:", filePath);

            const ws = XLSX.utils.json_to_sheet(updatedQuestions);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Questions");

            const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
            console.log("Excel file size:", wbout.byteLength);
            const blob = new Blob([wbout], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            console.log("Blob size:", blob.size);

            console.log("Uploading to Supabase...");
            const { error: uploadError } = await supabase.storage
                .from("uploads")
                .upload(filePath, blob, {
                    upsert: true,
                    cacheControl: "3600",
                });

            if (uploadError) throw uploadError;
            console.log("File uploaded successfully");

            const { data: publicURLData } = supabase.storage
                .from("uploads")
                .getPublicUrl(filePath);
            const newFileUrl = `${publicURLData.publicUrl}?t=${Date.now()}`;
            console.log("New public URL:", newFileUrl);

            console.log("Updating database...");
            const { error: updateError } = await supabase
                .from("exams")
                .update({ file_url: newFileUrl })
                .eq("id", id);

            if (updateError) throw updateError;
            console.log("Database updated successfully");

            setLoading(false);
        } catch (error) {
            console.error("Error saving edit:", error);
            setQuestions(questions);
            setEditingIndex(null);
            setEditedQuestion(null);
            setLoading(false);
            alert("Failed to save changes. Check console for details.");
        }
    };

    const handleDelete = async (index: number) => {
        try {
            setLoading(true);
            const updatedQuestions = questions.filter((_, i) => i !== index);
            setQuestions(updatedQuestions);

            const filePath = `exams/${id}.xlsx`;

            if (updatedQuestions.length === 0) {
                const { error: deleteError } = await supabase.storage
                    .from("uploads")
                    .remove([filePath]);
                if (deleteError) throw deleteError;

                const { error: updateError } = await supabase
                    .from("exams")
                    .update({ file_url: null })
                    .eq("id", id);
                if (updateError) throw updateError;

                console.log("File deleted successfully");
                setLoading(false);
                return;
            }

            const ws = XLSX.utils.json_to_sheet(updatedQuestions);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Questions");

            const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
            const blob = new Blob([wbout], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const { error: uploadError } = await supabase.storage
                .from("uploads")
                .upload(filePath, blob, { upsert: true, cacheControl: "3600" });
            if (uploadError) throw uploadError;

            const { data: publicURLData } = supabase.storage
                .from("uploads")
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from("exams")
                .update({ file_url: publicURLData.publicUrl })
                .eq("id", id);
            if (updateError) throw updateError;

            console.log("Question deleted successfully");
            setLoading(false);
        } catch (error) {
            console.error("Error in handleDelete:", error);
            setQuestions(questions);
            setLoading(false);
            alert("Failed to delete question.");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(`Changing ${name} to ${value}`);
        setEditedQuestion((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white rounded-lg shadow-sm w-full">
            <div className="p-6 flex justify-between items-center border-b">
                <h1 className="text-xl font-semibold text-gray-900">Questions</h1>
            </div>
            {loading && (
                <div className="p-4 text-center text-gray-500">Loading...</div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct Option</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {questions.map((question, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {editingIndex === index ? (
                                        <input
                                            type="text"
                                            name="Question"
                                            value={editedQuestion?.Question || ""}
                                            onChange={handleInputChange}
                                            className="w-full border rounded p-1"
                                            disabled={loading}
                                        />
                                    ) : (
                                        question.Question
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{level}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {editingIndex === index ? (
                                        <input
                                            type="text"
                                            name={question["Correct Option"]}
                                            value={editedQuestion?.[question["Correct Option"]] || ""}
                                            onChange={handleInputChange}
                                            className="w-full border rounded p-1"
                                            disabled={loading}
                                        />
                                    ) : (
                                        question[question["Correct Option"]]
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        {editingIndex === index ? (
                                            <>
                                                <button
                                                    onClick={handleSaveEdit}
                                                    className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 disabled:bg-green-300"
                                                    disabled={loading}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingIndex(null);
                                                        setEditedQuestion(null);
                                                    }}
                                                    className="inline-flex items-center px-3 py-1.5 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 disabled:bg-gray-300"
                                                    disabled={loading}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleEdit(index)}
                                                className="inline-flex items-center px-3 py-1.5 bg-amber-500 text-white text-sm font-medium rounded-md hover:bg-amber-600 disabled:bg-amber-300"
                                                disabled={loading}
                                            >
                                                <Pencil className="w-4 h-4 mr-1" />
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(index)}
                                            className="inline-flex items-center px-3 py-1.5 bg-rose-500 text-white text-sm font-medium rounded-md hover:bg-rose-600 disabled:bg-rose-300"
                                            disabled={loading}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExamDetails;