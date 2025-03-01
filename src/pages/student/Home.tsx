
// import { useState } from "react";
// import { supabase } from "../../utils/supabase-client";

// export default function Home() {
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [uploading, setUploading] = useState(false);
//     const [message, setMessage] = useState("");

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             setSelectedFile(file);
//         }
//     };

//     const handleUpload = async () => {
//         if (!selectedFile) {
//             setMessage("Please select a file first.");
//             return;
//         }

//         setUploading(true);
//         setMessage("");

//         const filePath = `exams/${Date.now()}_${selectedFile.name}`;

//         const { data, error } = await supabase.storage
//             .from("uploads") // Storage bucket name
//             .upload(filePath, selectedFile);

//         if (error) {
//             setMessage("Upload failed: " + error.message);
//         } else {
//             setMessage("File uploaded successfully!");
//         }

//         setUploading(false);
//     };

//     return (
//         <div className="w-full px-4 mt-5 mx-auto bg-white rounded-lg shadow-sm">
//             <div className="bg-rose-500 p-4 rounded-t-lg">
//                 <h1 className="text-white text-xl font-medium">Upload Excel</h1>
//             </div>

//             <div className="p-6">
//                 <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />

//                 <button
//                     onClick={handleUpload}
//                     disabled={uploading}
//                     className="px-4 py-2 bg-rose-500 text-white rounded-md mt-3"
//                 >
//                     {uploading ? "Uploading..." : "Upload"}
//                 </button>

//                 {message && <p className="mt-3 text-sm">{message}</p>}
//             </div>
//         </div>
//     );
// }

// -------------------------------------------

// import React, { useEffect, useState } from 'react'
// import { supabase } from '../../utils/supabase-client'

// const Home = () => {
//     const [todoList, setTodoList] = useState([])
//     const [newTodo, setNewTodo] = useState("")



//     const fetchTodos = async () => {
//         const { data, error } = await supabase.from("todoList").select("*")
//         if (error) {
//             console.log('Error data fetching');
//         }
//         else {
//             console.log(data);
//             setTodoList(data)
//         }
//     }

//     useEffect(() => {
//         fetchTodos()
//     }, [])

//     const addTodo = async () => {
//         console.log('test');

//         const newTodoData = {
//             name: newTodo,
//             isCompleted: false
//         }
//         const { data, error } = await supabase
//             .from("todoList")
//             .insert([newTodoData])
//             .single()

//         if (error) {
//             console.log('Error adding data');
//         }
//         else {
//             setTodoList((prev) => [...prev, data])
//             setNewTodo('')
//         }
//     }

//     const completeTask = async (id, isCompleted) => {
//         console.log(id, isCompleted);

//         const { data, error } = await supabase
//             .from("todoList")
//             .update({ isCompleted: !isCompleted })
//             .eq("id", id)

//         if (error) {
//             console.log('Complete Error');
//         }
//         else {
//             const updatedTodoList = todoList.map(todo => todo.id == id ? { ...todo, isCompleted: !isCompleted } : todo)
//             setTodoList(updatedTodoList)
//         }

//     }


//     return (
//         <div>
//             <h1>Todo List</h1>
//             <div>
//                 <input type="text"
//                     value={newTodo}
//                     onChange={(e) => setNewTodo(e.target.value)} />
//                 <button onClick={addTodo}>Add Todo Item</button>
//             </div>
//             <ul>
//                 {todoList && todoList.map(item => (
//                     <li key={item.id}>
//                         <p>{item?.name}</p>
//                         <button onClick={() => completeTask(item.id, item.isCompleted)}>{item?.isCompleted ? "Undo" : "Completed"}</button>
//                         <button>Delete Task</button>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     )
// }

// export default Home













import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase-client"; // Import Supabase client
import * as XLSX from "xlsx";

export default function Home() {
    const [excelData, setExcelData] = useState([]);
    const [loading, setLoading] = useState(false);
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
            fetchExcelFile(); // Fetch new file after upload
        }

        setUploading(false);
    };

    // 🟢 Function to Fetch Latest Excel File from Supabase
    const fetchExcelFile = async () => {
        setLoading(true);

        // Fetch file list
        const { data, error } = await supabase.storage.from("uploads").list("exams");

        if (error) {
            console.error("Error fetching files:", error);
            setLoading(false);
            return;
        }

        if (!data || data.length === 0) {
            console.log("No files found.");
            setLoading(false);
            return;
        }

        // Get the latest file
        const latestFile = data[data.length - 1].name;

        // Download file from Supabase
        const { data: fileData, error: downloadError } = await supabase.storage
            .from("uploads")
            .download(`exams/${latestFile}`);

        if (downloadError) {
            console.error("Error downloading file:", downloadError);
            setLoading(false);
            return;
        }

        // Read and convert Excel file to JSON
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryString = e.target?.result;
            if (binaryString) {
                const workbook = XLSX.read(binaryString, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                setExcelData(jsonData);
            }
        };
        reader.readAsBinaryString(fileData);

        setLoading(false);
    };

    // 🔵 Fetch Data on Component Mount
    useEffect(() => {
        fetchExcelFile();
    }, []);

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
            <h2 className="text-lg font-semibold mb-2">Exam Data</h2>
            {loading ? (
                <p>Loading...</p>
            ) : excelData.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300 mt-4">
                    <thead>
                        <tr className="bg-gray-200">
                            {Object.keys(excelData[0]).map((key) => (
                                <th key={key} className="border p-2">{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {excelData.map((row, index) => (
                            <tr key={index} className="text-center">
                                {Object.values(row).map((value, idx) => (
                                    <td key={idx} className="border p-2">{value as string}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No data found.</p>
            )}
        </div>
    );
}
