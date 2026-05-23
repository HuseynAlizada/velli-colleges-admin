import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, Loader2, Search } from "lucide-react";
import { supabase } from "../../utils/supabase-client";
import { ExamResult } from "../../types";

interface ExamResultWithBranch extends ExamResult {
  branch: string;
}

const RecentExams: React.FC = () => {
  const [results, setResults] = useState<ExamResultWithBranch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  const adminBranch: string = JSON.parse(localStorage.getItem("branch") || '""');

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "from-green-400 to-emerald-500";
    if (score >= 75) return "from-blue-400 to-indigo-500";
    if (score >= 65) return "from-yellow-400 to-amber-500";
    return "from-red-400 to-rose-500";
  };

  const getScoreLabel = (score: number, level: string) => {
    const lvl = level.toUpperCase();
    if (score < 65) return { text: "Fail", color: "bg-red-100 text-red-600" };
    if (["B1+", "B2", "C1"].includes(lvl)) {
      if (score < 75) return { text: "Pass", color: "bg-green-100 text-green-600" };
      if (score < 85) return { text: "Credit", color: "bg-blue-100 text-blue-600" };
      if (score < 95) return { text: "Distinction", color: "bg-purple-100 text-purple-600" };
      return { text: "High Distinction", color: "bg-indigo-100 text-indigo-600" };
    }
    if (score < 75) return { text: "Pass", color: "bg-green-100 text-green-600" };
    if (score < 85) return { text: "Credit", color: "bg-blue-100 text-blue-600" };
    if (score < 95) return { text: "Distinction", color: "bg-purple-100 text-purple-600" };
    return { text: "High Distinction", color: "bg-indigo-100 text-indigo-600" };
  };

  useEffect(() => {
    const fetchRecentExams = async () => {
      setIsLoading(true);
      try {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const [examRes, studentsRes] = await Promise.all([
          supabase
            .from("student_results")
            .select("*")
            .gte("created_at", threeDaysAgo.toISOString())
            .order("created_at", { ascending: false }),
          supabase.from("students").select("id, branch"),
        ]);

        if (examRes.error) throw examRes.error;
        if (studentsRes.error) throw studentsRes.error;

        // Filter students by admin's branch (same logic as AdminDashboard)
        const branchStudents =
          adminBranch === "Inqilab"
            ? (studentsRes.data || []).filter(
                (s) => s.branch === "Inqilab" || s.branch == null
              )
            : (studentsRes.data || []).filter((s) => s.branch === adminBranch);

        const allowedIds = new Set(branchStudents.map((s) => s.id));

        const branchMap = new Map<number, string>();
        (studentsRes.data || []).forEach((s) => {
          branchMap.set(s.id, s.branch || "");
        });

        const withBranch: ExamResultWithBranch[] = (examRes.data || [])
          .filter((r) => allowedIds.has(r.student_id))
          .map((r) => ({
            ...r,
            branch: branchMap.get(r.student_id) || "",
          }));

        setResults(withBranch);
      } catch (err) {
        console.error("Error fetching recent exams:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentExams();
  }, [adminBranch]);

  const filteredResults = results.filter(
    (r) =>
      r.student_name.toLowerCase().includes(search.toLowerCase()) ||
      r.exam_name.toLowerCase().includes(search.toLowerCase())
  );

  const renderCard = (result: ExamResultWithBranch, index: number) => {
    const label = getScoreLabel(result.student_score, result.student_level);
    return (
      <motion.div
        key={result.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {result.student_name}
              </h3>
              <p className="text-gray-500 text-xs mt-0.5 truncate">
                {result.exam_name}
              </p>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">
                {result.student_level?.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 mb-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Score</span>
              <div className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-sm font-bold text-gray-900">
                  {Math.round(result.student_score)}%
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Reading</span>
              <span className="text-xs font-semibold text-gray-700">
                {result.reading_score} / {result.reading_count}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Listening</span>
              <span className="text-xs font-semibold text-gray-700">
                {result.listening_score} / {result.listening_count}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Grammar</span>
              <span className="text-xs font-semibold text-gray-700">
                {result.grammar_score} / {result.grammar_count}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Vocabulary</span>
              <span className="text-xs font-semibold text-gray-700">
                {result.vocabulary_score} / {result.vocabulary_count}
              </span>
            </div>

            {result.finish_time != null && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Finish Time</span>
                <span className="text-xs font-semibold text-gray-700">
                  {formatTime(result.finish_time)}
                </span>
              </div>
            )}
          </div>

          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(
                result.student_score
              )}`}
              style={{ width: `${Math.min(result.student_score, 100)}%` }}
            />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-400">
              {String(result.created_at).split("T")[0]}
            </p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${label.color}`}>
              {label.text}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Son 3 günün imtahanları
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {adminBranch || "—"} branch · son 3 gün ərzindəki nəticələr
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Tələbə adı və ya imtahan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-gray-500 text-sm">İmtahan nəticələri yüklənir...</p>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="flex items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-sm">Son 3 gündə heç bir nəticə tapılmadı</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResults.map((result, index) => renderCard(result, index))}
        </div>
      )}
    </div>
  );
};

export default RecentExams;
