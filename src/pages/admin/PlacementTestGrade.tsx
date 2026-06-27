"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase-client";
import type { examResults } from "../../types";
import { Search, Filter, Award, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PlacementTestGrade = () => {
  const [results, setResults] = useState<examResults[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<string | null>(null);
  const [sortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);


  const getLevel = (score: number) => {
    if (score <= 25) return "A1";
    if (score <= 45) return "A2";
    if (score <= 60) return "B1";
    if (score <= 75) return "B1+";
    if (score <= 100) return "B2";
    return "";
  };

  // Get unique levels for filter dropdown
  // const uniqueLevels = results ? [...new Set(results.map((result) => result.student_level))] : []

  // Filter and sort results
  const filteredResults = results
    ? results
        .filter(
          (result) =>
            (filterLevel ? result?.student_level === filterLevel : true) &&
            (searchTerm
              ? result.student_name?.toLowerCase()
                  .includes(searchTerm?.toLowerCase()) ||
                result.exam_name?.toLowerCase()
                  .includes(searchTerm?.toLowerCase())
              : true)
        )
        .sort((a, b) => {
          if (!sortConfig) return 0;

          const aValue = a[sortConfig.key as keyof examResults];
          const bValue = b[sortConfig.key as keyof examResults];

          if (typeof aValue === "string" && typeof bValue === "string") {
            return sortConfig.direction === "ascending"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          } else if (typeof aValue === "number" && typeof bValue === "number") {
            return sortConfig.direction === "ascending"
              ? aValue - bValue
              : bValue - aValue;
          }
          return 0;
        })
    : [];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("placement_test_results")
          .select("*");
        if (error) throw error;


        const uniqueData = data.reduce(
          (acc: examResults[], current: examResults) => {
            if (!acc.some((item) => item.id === current.id)) {
              acc.push(current);
            }
            return acc;
          },
          []
        );

        setResults(uniqueData);
      } catch (err) {
        console.error("Error fetching exam results:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // No cleanup needed since this effect only runs once on mount
  }, []); // Empty dependency array ensures it runs only once on mount

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };
  // const requestSort = (key: string) => {
  //   let direction: "ascending" | "descending" = "ascending"
  //   if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
  //     direction = "descending"
  //   }
  //   setSortConfig({ key, direction })
  // }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "from-green-400 to-emerald-500";
    if (score >= 75) return "from-[#487ACB] to-[#11184F]";
    if (score >= 60) return "from-[#84A3F9] to-[#487ACB]";
    return "from-red-400 to-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Satisfactory";
    return "Needs Improvement";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto py-2">
        <div className="w-full max-w-7xl mx-auto p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Placement Test Results
              </h2>
              <p className="text-gray-500 mt-1">
                View and analyze student performance
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name or exam..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#487ACB] transition-all"
                />
              </div>

              {/* Filter Dropdown */}
              {/* <div className="relative">
                <div className="flex items-center gap-2">
                  <Filter className="text-gray-400 w-4 h-4" />
                  <select
                    value={filterLevel || ""}
                    onChange={(e) => setFilterLevel(e.target.value || null)}
                    className="appearance-none pl-2 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#487ACB] transition-all"
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
              </div> */}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm">
              <Loader2 className="w-10 h-10 text-[#487ACB] animate-spin mb-4" />
              <p className="text-gray-600">Loading exam results...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!results || results.length === 0) && (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-[#84A3F9]/20 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-[#487ACB]" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No results found
              </h3>
              <p className="text-gray-500 max-w-md text-center">
                There are no exam results available at the moment. Check back
                later or try a different search.
              </p>
            </div>
          )}

          {/* Results Grid */}
          {!isLoading && filteredResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {result.student_name}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            Exam Name: Placement Test
                          </p>
                        </div>
                        {/* <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full">
                          <BookOpen className="w-4.5 h-4.5 text-gray-600" />
                          <span className="text-xl font-medium text-gray-700">{result.student_level.toUpperCase()}</span>
                        </div> */}
                      </div>

                      {/* Score Display */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Reading</span>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-[#487ACB]" />
                            <span className="font-bold text-gray-900">
                              {result.total_score?.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Reading</span>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-[#487ACB]" />
                            <span className="font-bold text-gray-900">
                              {result.reading} / {result.reading_count}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">
                            Listening
                          </span>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-[#487ACB]" />
                            <span className="font-bold text-gray-900">
                              {result.listening} / {result.listening_count}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">
                            Vocabulary
                          </span>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-[#487ACB]" />
                            <span className="font-bold text-gray-900">
                              {result.vocabulary} / {result.vocabulary_count}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Grammar</span>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-[#487ACB]" />
                            <span className="font-bold text-gray-900">
                              {result.grammar} / {result.grammar_count}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(
                              result.total_score ?? 0
                            )}`}
                            style={{ width: `${result.total_score}%` }}
                          />
                        </div>

                        {/* Score Label */}
                        <p className="text-right text-xs mt-1 font-medium text-gray-600">
                          {getScoreLabel(result.total_score ?? 0)}
                        </p>
                        <p className="text-left text-md mt-1 font-medium text-gray-600">
                          Date: {String(result?.created_at).split("T")[0]}
                        </p>
                        <p className="text-left text-md mt-1 font-medium text-gray-600">
                          Finish Time: {formatTime(result?.finish_time || 0)}
                        </p>
                        <p className="text-left text-md mt-1 font-medium text-gray-600">
                          Level: {getLevel(result.total_score ?? 0)}
                        </p>
                      </div>

                      {/* Additional Info */}
                      {/* <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">ID: {result.id}</span>
                          <span className="text-gray-500">Rank: {index + 1}</span>
                        </div>
                      </div> */}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Filtered Results Empty State */}
          {!isLoading &&
            results &&
            results.length > 0 &&
            filteredResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-[#84A3F9]/20 rounded-full flex items-center justify-center mb-4">
                  <Filter className="w-8 h-8 text-[#487ACB]" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No matching results
                </h3>
                <p className="text-gray-500 max-w-md text-center">
                  No results match your current search or filter criteria. Try
                  adjusting your filters or search term.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterLevel(null);
                  }}
                  className="mt-4 px-4 py-2 bg-[#84A3F9]/10 text-[#11184F] rounded-lg hover:bg-[#84A3F9]/20 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PlacementTestGrade;
