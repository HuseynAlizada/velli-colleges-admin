import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../utils/supabase-client";
import { ExamResult, examResults, StudentData } from "../../types";
import "./style.css";
const StudentProfileData: React.FC = () => {
  const [student, setStudent] = useState<StudentData | undefined>(undefined);
  const [results, setResults] = useState<ExamResult[] | null>(null);
  const [placementTestResults, setPlacementTestResults] =
    useState<examResults | null>(null);
  const [satPlacementTestResults, setSatPlacementTestResults] =
    useState<examResults | null>(null);
  const [practiceResults, setPracticeResults] = useState<examResults[] | null>(
    null
  );
  const [resultScore, setResultScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [studentLevel, setStudentLevel] = useState<string | null>("");

  const { id: studentId } = useParams();
  const navigate = useNavigate();

  const countTrueQuestion = (totalQuestions: number, score: number | null) => {
    return (score ? (score * 100) / totalQuestions : 0).toFixed(0);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      if (!studentId) return;

      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", studentId)
        .single();
      if (error) {
        console.error("Error fetching students:", error);
      } else {
        setStudent(data);
        setStudentLevel(data.level);
      }
    };

    fetchStudents();
  }, [studentId]);

  useEffect(() => {
    const fetchPlacementTest = async () => {
      if (!studentId) return;

      const { data, error } = await supabase
        .from("placement_test_results")
        .select("*")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) {
        console.error("Error fetching placement test results:", error);
      } else {
        setPlacementTestResults(data);
      }
    };

    fetchPlacementTest();
  }, [studentId]);

  useEffect(() => {
    const fetchSatPlacementTest = async () => {
      if (!studentId) return;

      const { data, error } = await supabase
        .from("sat_placement_test_results")
        .select("*")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching SAT placement test results:", error);
      } else {
        setSatPlacementTestResults(data);
      }
    };

    fetchSatPlacementTest();
  }, [studentId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!studentId) {
          console.warn("Missing studentId");
          return;
        }

        const { data, error } = await supabase
          .from("student_results")
          .select("*")
          .eq("student_id", studentId);

        if (error) throw error;

        const sortedData = data
          .slice()
          .sort(
            (a: ExamResult, b: ExamResult) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );

        const gpaData = studentLevel
          ? sortedData.filter(
              (result: ExamResult) => result.student_level === studentLevel
            )
          : sortedData;

        const uniqueData = gpaData.reduce(
          (acc: ExamResult[], current: ExamResult) => {
            if (!acc.some((item) => item.id === current.id)) {
              acc.push(current);
            }
            return acc;
          },
          []
        );

        setResults(sortedData);

        if (uniqueData.length > 0) {
          setResultScore(
            Math.round(
              uniqueData.reduce(
                (total: number, item: ExamResult) => total + item.student_score,
                0
              ) / uniqueData.length
            )
          );
        } else {
          setResultScore(null);
        }
      } catch (err) {
        console.error("Error fetching exam results:", err);
      }
    };

    fetchData();
  }, [studentId, studentLevel]);

  useEffect(() => {
    const fetchData = async () => {
      if (!studentId) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("student_practice_results")
          .select("*")
          .eq("student_id", studentId)
          .order("created_at", { ascending: false });
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

        setPracticeResults(uniqueData);
      } catch (err) {
        console.error("Error fetching exam results:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  const getLevel = (score: number) => {
    if (score <= 25) return "A1";
    if (score <= 45) return "A2";
    if (score <= 60) return "B1";
    if (score <= 75) return "B1+";
    if (score <= 100) return "B2";
    return "";
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getScoreColorPractice = (
    totalQuestions: number,
    score: number | null
  ) => {
    const scorePercentage = +(
      score ? (score * 100) / totalQuestions : 0
    ).toFixed(0);

    if (scorePercentage >= 90) return "from-green-400 to-emerald-500";
    if (scorePercentage >= 75) return "from-blue-400 to-indigo-500";
    if (scorePercentage >= 60) return "from-yellow-400 to-amber-500";
    return "from-red-400 to-rose-500";
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "from-green-400 to-emerald-500";
    if (score >= 75) return "from-blue-400 to-indigo-500";
    if (score >= 60) return "from-yellow-400 to-amber-500";
    return "from-red-400 to-rose-500";
  };

  const getScoreLabel = (score: number, level: string) => {
    const lvl = level.toUpperCase();

    if (["A1", "A2", "B1"].includes(lvl)) {
      if (score < 65) return { text: "Fail", className: "label-fail" };
      if (score < 75) return { text: "Pass", className: "label-pass" };
      if (score < 85) return { text: "Credit", className: "label-credit" };
      if (score < 95)
        return { text: "Distinction", className: "label-distinction" };
      return { text: "High Distinction", className: "label-high" };
    }

    // B1+ – B2
    if (["B1+", "B2"].includes(lvl)) {
      if (score < 65) return { text: "Fail", className: "label-fail" };
      if (score < 75) return { text: "Pass", className: "label-pass" };
      if (score < 85) return { text: "Credit", className: "label-credit" };
      if (score < 95)
        return { text: "Distinction", className: "label-distinction" };
      return { text: "High Distinction", className: "label-high" };
    }

    return { text: "N/A", className: "label-na" };
  };

  const getScoreLabel2 = (totalQuestions: number, score: number) => {
    const scorePercentage = +(
      score ? (score * 100) / totalQuestions : 0
    ).toFixed(0);
    if (scorePercentage >= 90) return "Excellent";
    if (scorePercentage >= 75) return "Good";
    if (scorePercentage >= 60) return "Satisfactory";
    return "Needs Improvement";
  };

  const addToStock = async (
    student: StudentData | undefined,
    stock_value: boolean
  ) => {
    if (!student) return;

    const { error } = await supabase
      .from("students")
      .update({ stock: stock_value }) // ✅ only update 'stock' field
      .eq("id", student.id); // or use your `edit` variable if that’s the student ID

    if (error) {
      console.error("Error updating stock:", error);
    } else {
      alert(
        `Student has been ${
          stock_value ? "added to" : "removed from"
        } stock successfully.`
      );
      if (stock_value) {
        navigate("/admin/dashboard");
      } else {
        navigate("/admin/stock-dashboard");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-background">
      <div className="bg-card rounded-lg shadow-lg border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="bg-primary text-primary-foreground px-6 py-4">
            <h1 className="text-2xl font-bold">Student Profile</h1>
          </div>

          {student?.stock ? (
            <button
              onClick={() => addToStock(student, false)}
              className="ml-auto mr-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Remove from Stock
            </button>
          ) : (
            <button
              onClick={() => addToStock(student, true)}
              className="ml-auto mr-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Add to Stock
            </button>
          )}
        </div>

        <div className="p-6 space-y-8">
          {/* Personal Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                Personal Information
              </h2>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-medium text-muted-foreground min-w-20">
                    Name:
                  </span>
                  <span className="text-foreground font-medium">
                    {student?.name}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-medium text-muted-foreground min-w-20">
                    Email:
                  </span>
                  <span className="text-foreground">{student?.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-medium text-muted-foreground min-w-20">
                    Phone:
                  </span>
                  <span className="text-foreground">{student?.phone}</span>
                </div>
                {student?.level && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="font-medium text-muted-foreground min-w-20">
                      Level:
                    </span>
                    <span className="text-foreground font-medium">
                      {student?.level}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                Parent/Guardian Information
              </h2>
              <div className="space-y-3">
                {student?.sat_level && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="font-medium text-muted-foreground min-w-28">
                      SAT Level:
                    </span>
                    <span className="text-foreground font-medium">
                      {student?.sat_level}
                    </span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-medium text-muted-foreground min-w-28">
                    Parent Name:
                  </span>
                  <span className="text-foreground font-medium">
                    {student?.parent_name}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-medium text-muted-foreground min-w-28">
                    Parent Phone:
                  </span>
                  <span className="text-foreground">
                    {student?.parent_phone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Performance */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
              Academic Performance
            </h2>
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-muted-foreground">
                  Current GPA:
                </span>
                <span className={`text-2xl font-bold `}>{resultScore}</span>
                <span className="text-muted-foreground">/ 100</span>
              </div>
            </div>
          </div>

          {/* Placement Test */}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
              Recent Placement Test Results
            </h2>
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                <p className="text-gray-600">Loading exam results...</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                {placementTestResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {placementTestResults?.student_name}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            Exam Name: Plcament Test
                          </p>
                        </div>
                        <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full">
                          <BookOpen className="w-4.5 h-4.5 text-gray-600" />
                          <span className="text-xl font-medium text-gray-700">
                            {/* {result.student_level.toUpperCase()} */}
                          </span>
                        </div>
                      </div>

                      {/* Score Display */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Score</span>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-indigo-500" />
                            <span className="font-bold text-gray-900">
                              {placementTestResults?.total_score?.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Level</span>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-indigo-500" />

                            <span>
                              {getLevel(placementTestResults?.total_score ?? 0)}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Reading</span>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-indigo-500" />
                            <span className="font-bold text-gray-900">
                              {placementTestResults?.reading} /{" "}
                              {placementTestResults?.reading_count}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">
                            Listening
                          </span>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-indigo-500" />
                            <span className="font-bold text-gray-900">
                              {placementTestResults?.listening} /{" "}
                              {placementTestResults?.listening_count}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Grammar</span>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-indigo-500" />
                            <span className="font-bold text-gray-900">
                              {placementTestResults?.grammar} /{" "}
                              {placementTestResults?.grammar_count}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">
                            Vocabulary
                          </span>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-indigo-500" />
                            <span className="font-bold text-gray-900">
                              {placementTestResults?.vocabulary} /{" "}
                              {placementTestResults?.vocabulary_count}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">
                            Finish Time
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-gray-900">
                              {formatTime(
                                placementTestResults?.finish_time || 0
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(
                              placementTestResults?.total_score ?? 0
                            )}`}
                            style={{
                              width: `${
                                placementTestResults?.total_score ?? 0
                              }%`,
                            }}
                          />
                        </div>

                        {/* Score Label */}

                        <div className="flex justify-between items-center mt-4">
                          <p className="text-left text-sm  font-medium text-gray-600">
                            Date:{" "}
                            {
                              String(placementTestResults?.created_at).split(
                                "T"
                              )[0]
                            }
                          </p>
                        </div>
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
                )}
              </div>
            </div>

            {!placementTestResults && !isLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-gray-700 text-lg font-semibold">
                  ❌ Placement test results not found
                </p>
              </div>
            )}
          </div>

          {/* SAT Placement Test */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
              Recent SAT Placement Test Results
            </h2>
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                <p className="text-gray-600">Loading exam results...</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                {satPlacementTestResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {satPlacementTestResults?.student_name}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            Exam Name: SAT Placement Test
                          </p>
                        </div>
                        <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full">
                          <BookOpen className="w-4.5 h-4.5 text-gray-600" />
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Score</span>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-indigo-500" />
                            <span className="font-bold text-gray-900">
                              {satPlacementTestResults?.total_score?.toFixed(2)}
                              %
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">
                            Finish Time
                          </span>
                          <span className="font-bold text-gray-900">
                            {formatTime(
                              satPlacementTestResults?.finish_time || 0
                            )}
                          </span>
                        </div>

                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(
                              satPlacementTestResults?.total_score ?? 0
                            )}`}
                            style={{
                              width: `${
                                satPlacementTestResults?.total_score ?? 0
                              }%`,
                            }}
                          />
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <p className="text-left text-sm font-medium text-gray-600">
                            Date:{" "}
                            {
                              String(satPlacementTestResults?.created_at).split(
                                "T"
                              )[0]
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {!satPlacementTestResults && !isLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-gray-700 text-lg font-semibold">
                  ❌ SAT placement test results not found
                </p>
              </div>
            )}
          </div>

          {/* Exam Results */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
              Recent Exam Results
            </h2>
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                <p className="text-gray-600">Loading exam results...</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results?.map((result, index) => (
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
                          Exam Name: {result.exam_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full">
                        <BookOpen className="w-4.5 h-4.5 text-gray-600" />
                        <span className="text-xl font-medium text-gray-700">
                          {result.student_level.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Score Display */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Score</span>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-indigo-500" />
                          <span className="font-bold text-gray-900">
                            {Math.round(result.student_score)}%
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Reading</span>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-indigo-500" />
                          <span className="font-bold text-gray-900">
                            {result.reading_score} / {result.reading_count}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Listening</span>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-indigo-500" />
                          <span className="font-bold text-gray-900">
                            {result.listening_score} / {result.listening_count}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Grammar</span>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-indigo-500" />
                          <span className="font-bold text-gray-900">
                            {result.grammar_score} / {result.grammar_count}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Vocabulary
                        </span>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-indigo-500" />
                          <span className="font-bold text-gray-900">
                            {result.vocabulary_score} /{" "}
                            {result.vocabulary_count}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Finish Time
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-gray-900">
                            {formatTime(result?.finish_time || 0)}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(
                            result.student_score
                          )}`}
                          style={{ width: `${result.student_score}%` }}
                        />
                      </div>

                      {/* Score Label */}

                      <div className="flex justify-between items-center mt-4">
                        <p className="text-left text-sm  font-medium text-gray-600">
                          Date: {String(result?.created_at).split("T")[0]}
                        </p>

                        {(() => {
                          if (
                            typeof result.student_score === "number" &&
                            typeof result.student_level === "string"
                          ) {
                            const { text, className } = getScoreLabel(
                              result.student_score,
                              result.student_level
                            );
                            return (
                              <div className="flex items-center gap-2 text-sm">
                                Result:
                                <p
                                  className={`text-right text-md  font-medium ${className}`}
                                >
                                  {text}
                                </p>
                              </div>
                            );
                          }
                          return (
                            <div className="flex items-center gap-2 text-sm">
                              Result:
                              <p className="text-right text-md font-medium label-na">
                                N/A
                              </p>
                            </div>
                          );
                        })()}
                      </div>
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
            </div>

            {results?.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-gray-700 text-lg font-semibold">
                  ❌ Level exam results not found
                </p>
              </div>
            )}
          </div>

          {/* Practice Exam Results */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
              Practice Exam Results
            </h2>
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                <p className="text-gray-600">Loading exam results...</p>
              </div>
            )}
            <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {practiceResults?.map((result, index) => (
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
                          {result.name}
                        </h3>
                        <p className="text-gray-700 font-bold text-sm">
                          Exam Name: {result.exam_name}{" "}
                          {result.unit && `- Unit ${result.unit}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full">
                        <BookOpen className="w-4.5 h-4.5 text-gray-600" />
                        <span className="text-xl font-medium text-gray-700">
                          {result.student_level.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    {/* Score Display */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Score</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <Award className="w-4 h-4 text-indigo-500" />
                            <span className="font-bold mr-1 text-gray-900">
                              {countTrueQuestion(
                                result?.total_questions ?? 0,
                                result.score ?? 0
                              )}
                              %
                            </span>
                          </div>
                          <div className="flex font-bold text-gray-900">
                            {result.score} / {result.total_questions}
                            <div>
                              {/* {countTrueQuestion(
                                result?.total_questions ?? 0,
                                result.score ?? 0
                              )} */}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getScoreColorPractice(
                            result?.total_questions ?? 0,
                            result.score ?? 0
                          )}`}
                          style={{
                            width: `${countTrueQuestion(
                              result?.total_questions ?? 0,
                              result.score ?? 0
                            )}%`,
                          }}
                        />
                      </div>

                      {/* Score Label */}
                      <p className="text-right text-xs mt-1 font-medium text-gray-600">
                        {getScoreLabel2(
                          result?.total_questions ?? 0,
                          result.score ?? 0
                        )}
                      </p>
                      <p className="text-left text-md mt-1 font-medium text-gray-600">
                        Date: {String(result?.created_at).split("T")[0]}
                      </p>

                      <p className="text-left text-md mt-1 font-medium text-gray-600">
                        Finish Time: {formatTime(result?.finish_time || 0)}
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
            </div>

            {practiceResults?.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-gray-700 text-lg font-semibold">
                  ❌ Practice exam results not found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileData;
