"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../utils/supabase-client"
import { Phone, Mail, User, UserCircle, Shield } from 'lucide-react'
import { useNavigate } from "react-router-dom"

interface Student {
    id: string | string
    name: string
    email: string
    phone: string
    level: string
    parent_name: string
    parent_phone: string
}

export default function AdminDashboard() {
    const navigate = useNavigate()
    const [students, setStudents] = useState<Student[]>([])

    useEffect(() => {
        fetchStudents()
    }, [])

    const fetchStudents = async () => {
        const { data, error } = await supabase.from("students").select("*")

        if (error) {
            console.error("Error fetching students:", error)
        } else {
            console.log("Fetched students:", data)
            setStudents(data)
        }
    }




    const getLevelColor = (level: string) => {
        const colors = {
            beginner: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
            intermediate: "bg-blue-50 text-blue-700 ring-blue-600/20",
            advanced: "bg-purple-50 text-purple-700 ring-purple-600/20",
        }
        return colors[level.toLowerCase()] || "bg-gray-50 text-gray-700 ring-gray-600/20"
    }

    const handleDelete = async (id: number) => {
        try {
            const { error } = await supabase.from('students').delete().eq('id', id)
            if (error) {
                console.log("Error deleting student", error);
                return
            }
            setStudents((prevStudents) => prevStudents.filter(student => student.id !== id))
        }
        catch (err) {
            console.error("Unexpected error", err);

        }
    }


    const handleEdit = (id: number) => {
        console.log(id);
        navigate(`/admin/edit-student/${id}`)
    }

    return (
        <div className="w-full mx-auto p-6 bg-gray-50/50">
            <h1 className="text-3xl font-bold text-[#D33D5A] mb-8 text-center">
                Students List
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {students.length > 0 ? (
                    students.map((student) => (
                        <div
                            key={student.id}
                            className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        >
                            {/* Card Header with Image */}
                            <div className="relative h-32 bg-gradient-to-r from-rose-400 to-rose-600">
                                <div className="absolute -bottom-12 left-6">
                                    <img
                                        src='/images/student_avatar.jpeg'
                                        alt={student.name}
                                        className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-md"
                                    />
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6 pt-16">
                                {/* Level Badge */}
                                <div className="absolute top-4 right-4">
                                    <span
                                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getLevelColor(
                                            student.level
                                        )}`}
                                    >
                                        <Shield className="w-3 h-3 mr-1" />
                                        {student.level.toUpperCase()}
                                    </span>
                                </div>

                                {/* Student Info */}
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

                                    {/* Parent Info */}
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

                                {/* Action Buttons */}
                                <div className="mt-6 flex gap-2">
                                    <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg transition-all hover:scale-110" onClick={() => handleEdit(student.id)} >
                                        Edit
                                    </button>
                                    {/* <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-lg  transition-all hover:scale-110">
                                        View 
                                    </button> */}
                                    <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg transition-all hover:scale-110" onClick={() => handleDelete(student.id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                        <UserCircle className="w-12 h-12 mb-4 text-gray-400" />
                        <p className="text-lg font-medium">No students found</p>
                        <p className="text-sm">Start by adding new students to the system</p>
                    </div>
                )}
            </div>
        </div>
    )
}
