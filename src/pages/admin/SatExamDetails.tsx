


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../utils/supabase-client";
import { Pencil, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";

// Define the shape of a question object
interface Question {
  Question: string;
  "Correct Option"?: string;
  Section?: string;
  [key: string]: string | undefined; // Allow dynamic "Option A", "Option B", etc.
}

const ExamDetails = () => {
  const { id } = useParams<{ id: string }>(); // Explicitly type id as string
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
//   const [maxOptions, setMaxOptions] = useState(0); 
  const [optionLabels, setOptionLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);
        const { data: examData, error: examError } = await supabase
          .from("sat_exams")
          .select("*")
          .eq("id", id)
          .single();

        if (examError) throw examError;
        setTitle(examData.title);

        const fileUrl = examData.file_url;
        if (!fileUrl) {
          console.log("No file URL found, setting empty questions");
          setQuestions([]);
          setLoading(false);
          return;
        }

        const urlWithTimestamp = `${fileUrl}?t=${Date.now()}`;
        const response = await fetch(urlWithTimestamp);
        if (!response.ok) throw new Error(`Failed to fetch Excel file: ${response.statusText}`);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json<Question>(sheet); // Type the parsed data
          setQuestions(parsedData);

          // Determine the maximum number of options and their labels
          const optionKeysSet = new Set<string>();
          parsedData.forEach((q) => {
            Object.keys(q).forEach((key) => {
              if (key.startsWith("Option ")) {
                optionKeysSet.add(key);
              }
            });
          });
          const sortedOptionKeys = Array.from(optionKeysSet).sort();
        //   setMaxOptions(sortedOptionKeys.length); // Fixed: Use setMaxOptions
          setOptionLabels(sortedOptionKeys.map((key) => key.split(" ")[1])); // Extract A, B, C, etc.
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
    setEditingIndex(index);
    setEditedQuestion({ ...questions[index] });
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null || !editedQuestion) return;

    try {
      setLoading(true);
      const updatedQuestions = questions.map((q, i) =>
        i === editingIndex ? editedQuestion : q
      );
      setQuestions(updatedQuestions);
      setEditingIndex(null);
      setEditedQuestion(null);

      const filePath = `sat_exams/${id}.xlsx`;
      const ws = XLSX.utils.json_to_sheet(updatedQuestions);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Questions");

      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, blob, {
          upsert: true,
          cacheControl: "3600",
        });

      if (uploadError) throw uploadError;

      const { data: publicURLData } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);
      const newFileUrl = `${publicURLData.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("sat_exams")
        .update({ file_url: newFileUrl })
        .eq("id", id);

      if (updateError) throw updateError;

      setLoading(false);
    } catch (error) {
      console.error("Error saving edit:", error);
      setQuestions(questions); // Revert to previous state
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

      const filePath = `sat_exams/${id}.xlsx`;

      if (updatedQuestions.length === 0) {
        const { error: deleteError } = await supabase.storage
          .from("uploads")
          .remove([filePath]);
        if (deleteError) throw deleteError;

        const { error: updateError } = await supabase
          .from("sat_exams")
          .update({ file_url: null })
          .eq("id", id);
        if (updateError) throw updateError;

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
        .from("sat_exams")
        .update({ file_url: publicURLData.publicUrl })
        .eq("id", id);
      if (updateError) throw updateError;

      setLoading(false);
    } catch (error) {
      console.error("Error in handleDelete:", error);
      setQuestions(questions); // Revert to previous state
      setLoading(false);
      alert("Failed to delete question.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedQuestion((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const renderOptions = (question: Question, isEditing: boolean, optionLabel: string) => {
    const optionKey = `Option ${optionLabel}`;
    if (isEditing && editingIndex !== null) {
      return (
        <td className="px-6 py-4 text-sm text-gray-900">
          <input
            type="text"
            name={optionKey}
            value={editedQuestion?.[optionKey] || ""}
            onChange={handleInputChange}
            className="w-full border rounded p-1"
            disabled={loading}
          />
        </td>
      );
    }
    return (
      <td className="px-6 py-4 text-sm text-gray-900">
        {question[optionKey] ? (
          <span className={question["Correct Option"] === optionKey ? "text-green-600" : ""}>
            {question[optionKey]}
          </span>
        ) : (
          "-"
        )}
      </td>
    );
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
              {optionLabels.map((label) => (
                <th
                  key={`option-${label}`}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Option {label}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct Option</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
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
                {optionLabels.map((label) => renderOptions(question, editingIndex === index, label))}
                <td className="px-6 py-4 text-sm text-gray-900">
                  {editingIndex === index ? (
                    <select
                      name="Correct Option"
                      value={editedQuestion?.["Correct Option"] || ""}
                      onChange={handleInputChange}
                      className="w-full border rounded p-1"
                      disabled={loading}
                    >
                      <option value="">Select Correct Option</option>
                      {optionLabels.map((label) => (
                        <option key={`option-${label}`} value={`Option ${label}`}>
                          Option {label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    question["Correct Option"] || "-"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{question.Section || "-"}</td>
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