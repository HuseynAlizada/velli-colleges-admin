import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase-client";
import { StudentData } from "../../types";


export default function StudentList() {
  const [students, setStudents] = useState<StudentData[] | []>([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data, error } = await supabase.from("students").select("*");


    if (error) {
      console.error("Error fetching students:", error);
    } else {
      console.log("Fetched students:", data);
      setStudents(data);
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Students List</h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Phone</th>
            <th className="border border-gray-300 px-4 py-2">Level</th>
            <th className="border border-gray-300 px-4 py-2">Parent Name</th>
            <th className="border border-gray-300 px-4 py-2">Parent Phone</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{student.name}</td>
                <td className="border border-gray-300 px-4 py-2">{student.email}</td>
                <td className="border border-gray-300 px-4 py-2">{student.phone}</td>
                <td className="border border-gray-300 px-4 py-2">{student.level.toUpperCase()}</td>
                <td className="border border-gray-300 px-4 py-2">{student.parent_name}</td>
                <td className="border border-gray-300 px-4 py-2">{student.parent_phone}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
