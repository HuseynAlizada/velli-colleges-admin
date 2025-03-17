"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../utils/supabase-client"
import type { StudentData } from "../../types"
import { Target, Search, Loader2, Users, Filter, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const StudentsTargets = () => {
  const [students, setStudents] = useState<StudentData[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState<string | null>(null)

  // Get unique levels for filter dropdown
  const uniqueLevels = students ? [...new Set(students.map((student) => student.level))] : []

  // Filter students based on search term and level
  const filteredStudents = students
    ? students.filter(
        (student) =>
          (filterLevel ? student.level === filterLevel : true) &&
          (searchTerm
            ? student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (student.student_purpose && student.student_purpose.toLowerCase().includes(searchTerm.toLowerCase()))
            : true),
      )
    : []

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase.from("students").select("*")

        if (error) throw error
        setStudents(data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStudents()
  }, [])

  // Function to get a color based on the first letter of the purpose
  const getPurposeColor = (purpose: string) => {
    const colors = [
      "bg-gradient-to-br from-blue-400 to-indigo-500",
      "bg-gradient-to-br from-emerald-400 to-green-500",
      "bg-gradient-to-br from-amber-400 to-orange-500",
      "bg-gradient-to-br from-rose-400 to-pink-500",
      "bg-gradient-to-br from-violet-400 to-purple-500",
      "bg-gradient-to-br from-cyan-400 to-blue-500",
    ]

    const firstChar = purpose.charAt(0).toLowerCase()
    const index = firstChar.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-500" />
            Student Targets
          </h2>
          <p className="text-gray-500 mt-1">View student goals and purposes</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Filter Dropdown */}
          {uniqueLevels.length > 0 && (
            <div className="relative">
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 w-4 h-4" />
                <select
                  value={filterLevel || ""}
                  onChange={(e) => setFilterLevel(e.target.value || null)}
                  className="appearance-none pl-2 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="">All Levels</option>
                  {uniqueLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading student data...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!students || students.length === 0) && (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No students found</h3>
          <p className="text-gray-500 max-w-md text-center">There are no students in the database at the moment.</p>
        </div>
      )}

      {/* Filtered Results Empty State */}
      {!isLoading && students && students.length > 0 && filteredStudents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <Filter className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No matching students</h3>
          <p className="text-gray-500 max-w-md text-center">
            No students match your current search or filter criteria. Try adjusting your filters or search term.
          </p>
          <button
            onClick={() => {
              setSearchTerm("")
              setFilterLevel(null)
            }}
            className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Students Grid */}
      {!isLoading && filteredStudents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-5">
                    {/* Avatar or Initials */}
                    <div className="relative">
                      {student.image_url ? (
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-100">
                          <img
                            src={student.image_url || "/placeholder.svg"}
                            alt={student.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Level Badge */}
                      {student.level && (
                        <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                          {student.level.toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Student Name */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-500">{student.student_school || "Student"}</p>
                    </div>
                  </div>

                  {/* Purpose */}
                  {student.student_purpose ? (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-indigo-500" />
                        <h4 className="text-sm font-medium text-gray-700">Learning Purpose</h4>
                      </div>

                      <div className={`p-4 rounded-lg ${getPurposeColor(student.student_purpose)} text-white`}>
                        <p className="font-medium">{student.student_purpose}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 rounded-lg bg-gray-100 text-gray-500 text-center">
                      <p>No purpose specified</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default StudentsTargets

