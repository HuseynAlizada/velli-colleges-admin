"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase-client";
import { Phone, Mail, User, UserCircle, Shield, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Level = "beginner" | "intermediate" | "advanced";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: Level;
  parent_name: string;
  parent_phone: string;
  image_url: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState(""); // 🔍 new state for search input

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data, error } = await supabase.from("students").select("*");

    if (error) {
      console.error("Error fetching students:", error);
    } else {
      setStudents((data || []).filter((item) => !item.stock));
    }
  };

  const getLevelColor = (level: string): string => {
    const colors: Record<Level, string> = {
      beginner: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
      intermediate: "bg-[#84A3F9]/10 text-[#11184F] ring-[#487ACB]/20",
      advanced: "bg-[#84A3F9]/20 text-[#11184F] ring-[#11184F]/20",
    };
    return (
      colors[level?.toLowerCase() as Level] ||
      "bg-gray-50 text-gray-700 ring-gray-600/20"
    );
  };

  const handleDelete = async (id: string) => {
    if(confirm("Are you sure?")){
     try {
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (error) {
        console.log("Error deleting student", error);
        return;
      }
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== id)
      );
    } catch (err) {
      console.error("Unexpected error", err);
    }
   }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/edit-student/${id}`);
  };

  // 🔍 filter students by search input
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full mx-auto p-6 bg-gray-50/50">
      <h1 className="text-3xl font-bold text-[#11184F] mb-6 text-center">
        Students List
      </h1>

      {/* 🔍 Search input */}
      <div className="max-w-md mx-auto mb-8 relative">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#487ACB] focus:border-[#487ACB] outline-none"
        />
        <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div
              key={student.id}
              className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative h-32 bg-gradient-to-r from-[#11184F] to-[#487ACB]">
                <div className="absolute -bottom-12 left-6">
                  <img
                    src={student.image_url || "/images/student_avatar.jpeg"}
                    alt={student.name}
                    className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-md"
                  />
                </div>
              </div>
              <div className="p-6 pt-16">
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getLevelColor(
                      student.level
                    )}`}
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {student.level?.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {student.name}
                    </h2>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Mail className="w-4 h-4 mr-2" />
                      {student.email}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Phone className="w-4 h-4 mr-2" />
                      {student.phone}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm font-medium text-gray-700">
                      <UserCircle className="w-4 h-4 mr-2" />
                      Parent Information
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-2" />
                        {student.parent_name}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-2" />
                        {student.parent_phone}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    className="min-w-[78px] flex-1 cursor-pointer rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-all hover:scale-[1.03]"
                    onClick={() => handleEdit(student.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="min-w-[78px] flex-1 cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all hover:scale-[1.03]"
                    onClick={() => handleDelete(student.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="min-w-[78px] flex-1 cursor-pointer rounded-lg bg-[#487ACB] px-4 py-2 text-sm font-medium text-white transition-all hover:scale-[1.03]"
                    onClick={() =>
                      navigate(`/admin/student-profile/${student.id}`)
                    }
                  >
                    Info
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
            <UserCircle className="w-12 h-12 mb-4 text-gray-400" />
            <p className="text-lg font-medium">No students found</p>
            <p className="text-sm">Try searching with another name</p>
          </div>
        )}
      </div>
    </div>
  );
}
