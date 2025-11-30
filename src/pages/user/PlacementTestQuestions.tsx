
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../utils/supabase-client";
import * as XLSX from "xlsx";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Exam {
  id: string;
  title: string;
  file_url: string;
}

interface Question {
  "Question No": number;
  Question: string;
  "Option A": string;
  "Option B": string;
  "Option C": string;
  "Option D"?: string;
  "Correct Option": string;
  Section: string;
  content?: string;
}

export default function PlacementTestQuestions() {
  const params = useParams();
  const id = params?.id;
  const userId = Cookies.get("studentID");

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [examType, setExamType] = useState<string>("Listening");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sectionScores, setSectionScores] = useState<{ [key: string]: number }>({});
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [examScore, setExamScore] = useState<number | null>(null);
  const [submited, setSubmited] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ⏳ Timer — 1.5 hour
  const [timeLeft, setTimeLeft] = useState(90 * 60);
  const examSections = ["Listening", "Reading", "Grammar", "Vocabulary"];

  const [sectionTotals, setSectionTotals] = useState<{ [key: string]: number }>({});

  // 🔥 Listening 2 times play limit
  const [listeningPlayCount, setListeningPlayCount] = useState<{ [key: string]: number }>({});

  const navigate = useNavigate();

  const getLevel = (score: number) => {
    if (score <= 25) return "A1";
    if (score <= 45) return "A2";
    if (score <= 60) return "B1";
    if (score <= 75) return "B1+";
    if (score <= 100) return "B2";
    return "";
  };

  // Timer Logic
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            setSubmited(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isSubmitted]);

  useEffect(() => {
    const fetchExamAndExcel = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase.from("approved-exams").select("*").eq("id", id).single();
        if (error) throw error;
        setExam(data);

        if (data.file_url) {
          const response = await fetch(data.file_url);
          if (!response.ok) throw new Error("Failed to fetch Excel file");

          const arrayBuffer = await response.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

          const formattedData = jsonData.map((row: any, index: number) => ({
            "Question No": row["Question No"] || index,
            Question: row["Question"],
            "Option A": row["Option A"],
            "Option B": row["Option B"],
            "Option C": row["Option C"],
            "Option D": row["Option D"] || undefined,
            "Correct Option": row["Correct Option"],
            Section: row["Section"],
            content: row["content"] || "",
          }));

          setQuestions(formattedData);

          const totals = examSections.reduce((acc, section) => {
            acc[section] = formattedData.filter((q) => q.Section === section).length;
            return acc;
          }, {} as { [key: string]: number });

          setSectionTotals(totals);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch exam or Excel data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchExamAndExcel();
  }, [id]);

  const handleAnswerSelect = (questionNo: number, option: string) => {
    if (!isSubmitted) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [questionNo]: option,
      }));
    }
  };

  const handleNavigation = (direction: string) => {
    const currentIndex = examSections.indexOf(examType);
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < examSections.length) {
      setExamType(examSections[newIndex]);
    }
  };

  // ⭐ Placement scoring — 3 wrong = −1 correct
  const handleSubmit = async () => {
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    setIsSubmitted(true);
    let totalCorrectCount = 0;
    let totalExamScore = 0;
    const newSectionScores: { [key: string]: number } = {};

    examSections.forEach((section) => {
      const filteredQuestions = questions.filter((q) => q.Section === section);
      let correct = 0;
      let wrong = 0;

      filteredQuestions.forEach((question) => {
        const questionNo = question["Question No"];
        const selectedAnswer = selectedAnswers[questionNo];
        const correctAnswer = question["Correct Option"];

        if (selectedAnswer) {
          if (`Option ${selectedAnswer}` === correctAnswer) correct++;
          else wrong++;
        }
      });

      const net = correct - Math.floor(wrong / 3); // ⭐ 3 yanlış 1 doğru silir
      newSectionScores[section] = net;
      totalCorrectCount += net;
    });

    totalExamScore = (totalCorrectCount * 100) / questions.length;
    setSectionScores(newSectionScores);
    setTotalScore(totalCorrectCount);
    setExamScore(totalExamScore);

    try {
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("id", userId)
        .single();

      if (studentError) throw new Error(studentError.message);
      const studentName = studentData?.name || "Unknown";

      const { error: resultError } = await supabase.from("placement_test_results").insert({
        student_id: userId,
        total_score: totalExamScore,
        student_name: studentName,
        listening: newSectionScores["Listening"],
        reading: newSectionScores["Reading"],
        grammar: newSectionScores["Grammar"],
        vocabulary: newSectionScores["Vocabulary"],
        listening_count: sectionTotals["Listening"],
        reading_count: sectionTotals["Reading"],
        grammar_count: sectionTotals["Grammar"],
        vocabulary_count: sectionTotals["Vocabulary"],
        branch: studentData?.branch || null,
        finish_time: timeLeft,
      });

      if (resultError) throw new Error(resultError.message);

      toast.success("Exam submitted successfully!");
      setSubmited(true);
      setIsModalOpen(true);
    } catch {
      toast.error("Failed to submit exam results. Please try again.");
      setIsModalOpen(true);
    }
  };

  const filteredQuestions = questions.filter((question) => question.Section === examType);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading exam questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center text-red-600 p-8 rounded-lg bg-red-50 border border-red-100">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-gray-600">No exam found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br w-full select-none">
      <ToastContainer autoClose={3000} />
      <div className="question-header mt-12 relative">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{exam.title}</h1>
          <p className="text-gray-600  text-xl">Read the questions carefully</p>
          <p className="text-gray-600  text-xl">Good Luck</p>
        </div>

        <div className="flex items-center justify-center gap-5 mb-10">
          {examSections.map((type) => (
            <button
              key={type}
              className={`px-6 py-4 rounded-full transition-all ${
                examType === type
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-50 hover:bg-indigo-500 hover:text-white"
              }`}
              onClick={() => setExamType(type)}
              disabled={isSubmitted}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {!isSubmitted && (
        <div className="sticky z-[999] top-18 right-0 w-full flex items-center justify-end">
          <div className="w-[200px] z-10 bg-white shadow-md p-4 text-center">
            <p className="text-xl font-semibold text-indigo-600">
              Time Left: {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-12">
        {filteredQuestions.length === 0 ? (
          <p className="text-center text-gray-600">No questions found for {examType}.</p>
        ) : (
          <div className="space-y-12">
            {filteredQuestions.map((question, index) => {
              const questionKey = question["Question No"] || index;
              const selectedAnswer = selectedAnswers[questionKey];

              const availableOptions = ["A", "B", "C", "D"].filter(
                (opt) => question[`Option ${opt}` as keyof Question]
              );

              const showContent =
                question.content &&
                question.content.trim() !== "" &&
                filteredQuestions.findIndex((q) => q.content === question.content) === index;

              return (
                <div key={questionKey}>
                  {showContent && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-8 shadow-md mb-8">
                      {examType === "Reading" && (
                        <>
                          <h2 className="text-2xl font-semibold mb-4">Reading Passage</h2>
                          <p className="text-gray-700">{question.content}</p>
                        </>
                      )}

                      {examType === "Listening" && (
                        <>
                          <h2 className="text-2xl font-semibold mb-4">Listening Audio</h2>

                          <audio
                            controls
                            className="w-full max-w-md mx-auto"
                            onPlay={(e) => {
                              const key = String(questionKey);
                              const newCount = (listeningPlayCount[key] || 0) + 1;
                              setListeningPlayCount(prev => ({ ...prev, [key]: newCount }));
                              if (newCount > 2) e.currentTarget.pause();
                            }}
                          >
                            <source src={question.content} type="audio/mpeg" />
                          </audio>

                          {(listeningPlayCount[String(questionKey)] || 0) >= 2 && (
                            <p className="text-red-600 text-center mt-2">
                              You cannot listen more than 2 times.
                            </p>
                          )}
                        </>
                      )}
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-8 shadow-md mb-8"
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                      {index + 1}. {question.Question}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAnswerSelect(questionKey, option)}
                          disabled={isSubmitted}
                          className={`px-6 py-4 rounded-full transition-all ${
                            selectedAnswer === option
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          {option}. {question[`Option ${option}` as keyof Question]}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          {!submited &&
            (examType === "Vocabulary" ? (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
              >
                Submit Answers
              </button>
            ) : (
              <div className="flex justify-between max-w-lg mx-auto">
                <button
                  onClick={() => handleNavigation("prev")}
                  disabled={examType === "Listening"}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handleNavigation("next")}
                  disabled={examType === "Vocabulary"}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-8 max-w-lg w-full"
          >
            <h2 className="text-2xl font-bold mb-4">Exam Results</h2>
            <p className="text-gray-700 mb-6">
              {timeLeft === 0 ? "Time's up!" : "Congratulations!"}
            </p>

            <div className="text-center space-y-2">
              <p className="text-xl font-semibold">
                Total Correct (After 3 Wrong Rule): {totalScore} / {questions.length}
              </p>
              <p className="text-xl font-semibold">Total Score: {examScore}%</p>
              <p className="text-xl font-semibold">Your Level: {getLevel(totalScore ?? 0)}</p>
            </div>

            <div className="mt-6 space-y-1 text-gray-800">
              <h4 className="font-semibold">Section Scores:</h4>
              {examSections.map((section) => (
                <p key={section}>
                  {section}: {sectionScores[section] || 0} / {sectionTotals[section] || 0}
                </p>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
