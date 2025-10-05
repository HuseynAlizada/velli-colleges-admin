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
  "Content"?: string;
}

export default function SATPlacementTestQuestions() {
  const params = useParams();
  const id = params?.id;
  const userId = Cookies.get("studentID");

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [examScore, setExamScore] = useState<number | null>(null);
  const [submited, setSubmited] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 1 hour
  const navigate = useNavigate();

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

        const { data, error } = await supabase
          .from("approved-exams")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setExam(data);
        console.log(data, "exam data");

        if (data.file_url) {
          const response = await fetch(data.file_url);
          if (!response.ok) throw new Error("Failed to fetch Excel file");

          const arrayBuffer = await response.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

          const formattedData = jsonData.map((row: any, index: number) => ({
            "Question No": row["Question No"] || index + 1,
            Question: row["Question"],
            "Option A": row["Option A"],
            "Option B": row["Option B"],
            "Option C": row["Option C"],
            "Option D": row["Option D"] || undefined,
            "Correct Option": row["Correct Option"],
            Content: row["content"] || undefined,
          }));

          setQuestions(formattedData);

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

  const handleSubmit = async () => {
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    setIsSubmitted(true);
    let correctCount = 0;

    questions.forEach((question) => {
      const selectedAnswer = selectedAnswers[question["Question No"]];
      const correctAnswer = question["Correct Option"];
      if (selectedAnswer && `Option ${selectedAnswer}` === correctAnswer) {
        correctCount++;
      }
    });

    const score = (correctCount * 100) / questions.length;
    setTotalScore(correctCount);
    setExamScore(score);

    try {
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("id", userId)
        .single();

      if (studentError) throw new Error(studentError.message);

      const studentName = studentData?.name || "Unknown";

      const { error: resultError } = await supabase
        .from("placement_test_results")
        .insert({
          student_id: userId,
          total_score: score,
          student_name: studentName,
        });

      if (resultError) throw new Error(resultError.message);

      toast.success("Exam submitted successfully!");
      setSubmited(true);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit exam results.");
      setIsModalOpen(true);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading exam questions...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center text-red-600 p-8 rounded-lg bg-red-50 border border-red-100">
          <p>{error}</p>
        </div>
      </div>
    );

  if (!exam)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center text-gray-600">
          <p>No exam found.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br w-full select-none">
      <ToastContainer autoClose={3000} />
      <div className="text-center mt-12 mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{exam.title}</h1>
        <p className="text-gray-600 text-xl">
          Answer all questions carefully. Good Luck!
        </p>
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

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {questions.map((question, index) => {
          const questionKey = question["Question No"] || index;
          const selectedAnswer = selectedAnswers[questionKey];
          const availableOptions = ["A", "B", "C", "D"].filter(
            (option) => question[`Option ${option}` as keyof Question]
          );

          return (
            <motion.div
              key={questionKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-8 shadow-md"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {index + 1}. {question.Question}
              </h2>

              {/* Render Content if exists */}
              {question.Content && (
                <div className="mb-6">
                  {question.Content.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                    <img
                      src={question.Content}
                      alt={`Question ${index + 1}`}
                      className="max-w-full rounded-lg shadow-md"
                    />
                  ) : question.Content.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={question.Content}
                      controls
                      className="w-full rounded-lg shadow-md"
                    />
                  ) : (
                    <p className="text-gray-600 italic">{question.Content}</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableOptions.map((option) => {
                  const isOptionSelected = selectedAnswer === option;
                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(questionKey, option)}
                      disabled={isSubmitted}
                      className={`px-6 py-4 rounded-full text-left transition-all duration-200 ${
                        isOptionSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {option}. {question[`Option ${option}` as keyof Question]}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {!submited && (
          <div className="text-center mt-12">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
            >
              Submit Answers
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white rounded-lg p-8 max-w-lg w-full mx-4 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Exam Results
            </h2>
            <p className="text-gray-600 mb-6">
              {timeLeft === 0
                ? "Time's up! Here are your results:"
                : "Congratulations on completing the exam!"}
            </p>
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Total Answers: {totalScore} / {questions.length}
              </h3>
              <h3 className="text-xl font-semibold text-gray-900">
                Total Score: {examScore} %
              </h3>
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
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
