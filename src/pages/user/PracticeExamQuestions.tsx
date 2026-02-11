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
  Section?: string;
  content?: string;
}

export default function PracticeExamQuestions() {
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
  const [submited, setSubmited] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
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
          .from("practice_exam")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        setExam(data);

        if (data.exam_file) {
          const response = await fetch(data.exam_file);
          if (!response.ok) throw new Error("Failed to fetch Excel file");

          const arrayBuffer = await response.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
          const normalizeRow = (row: any) => {
            const newRow: any = {};
            Object.keys(row).forEach((key) => {
              newRow[key.trim()] = row[key];
            });
            return newRow;
          };
          const formattedData = jsonData.map((rawRow: any, index: number) => {
            const row = normalizeRow(rawRow);

            return {
              "Question No":
                row["Question No"] ||
                row["question_no"] ||
                row["QuestionNo"] ||
                index,

              Question: row["Question"],

              "Option A": row["Option A"],
              "Option B": row["Option B"],
              "Option C": row["Option C"],
              "Option D": row["Option D"] || undefined,

              "Correct Option": row["Correct Option"],
              Section: row["Section"],
              content: row["content"] || "",
            };
          });

          setQuestions(formattedData);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch exam or Excel data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExamAndExcel();
    }
  }, [id]);

  const inferContentType = (content: string): "audio" | "video" | "text" => {
    if (!content) return "text";
    const isUrl =
      content.startsWith("http://") || content.startsWith("https://");
    if (!isUrl) return "text";
    const extension = content.split(".").pop()?.toLowerCase();
    if (extension === "mp3" || extension === "wav") return "audio";
    if (extension === "mp4" || extension === "webm") return "video";
    return "text";
  };

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
    const totalQuestions = questions.length; // Calculate total questions

    questions.forEach((question) => {
      const questionNo = question["Question No"];
      const selectedAnswer = selectedAnswers[questionNo];
      const correctAnswer = question["Correct Option"];

      if (selectedAnswer && `Option ${selectedAnswer}` === correctAnswer) {
        correctCount++;
      }
    });

    setTotalScore(correctCount);

    try {
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("id", userId)
        .single();

      if (studentError)
        throw new Error(
          "Failed to fetch student level: " + studentError.message,
        );

      const studentLevel = studentData?.level || "Unknown";
      const studentName = studentData?.name || "Unknown";

      const examUnit = localStorage.getItem("practiceExamUnit");

      const { error: resultError } = await supabase
        .from("student_practice_results")
        .insert({
          student_id: userId,
          score: correctCount,
          student_level: studentLevel,
          exam_name: exam?.title || "Unnamed Exam",
          name: studentName,
          total_questions: totalQuestions,
          unit: examUnit, // Add total_questions to the database
          finish_time: timeLeft,
        });

      if (resultError)
        throw new Error("Failed to save exam results: " + resultError.message);

      const { data: takenExamsData, error: fetchError } = await supabase
        .from("taken-exams")
        .select("practice_count")
        .eq("student_id", userId)
        .single();

      if (fetchError)
        throw new Error(
          "Failed to fetch current exam count: " + fetchError.message,
        );

      const currentExamCount = takenExamsData?.practice_count || 0;

      const { error: updateError } = await supabase
        .from("taken-exams")
        .update({ practice_count: currentExamCount + 1 })
        .eq("student_id", userId);

      if (updateError)
        throw new Error("Failed to update exam count: " + updateError.message);

      toast.success("Exam submitted successfully!");
      setSubmited(true);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit exam results. Please try again.");
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
    navigate("/practice-exam");
  };

  // Group questions by content or section
  const groupedQuestions = questions.reduce(
    (acc, question) => {
      const key = question.content || question.Section || "default"; // Use content or Section as the grouping key
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(question);
      return acc;
    },
    {} as { [key: string]: Question[] },
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading exam questions...</p>
        </div>
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
        <div className="text-center text-gray-600">
          <p>No exam found.</p>
        </div>
      </div>
    );
  }

  const getScoreLabel = (totalScore: number, totalQuestions: number) => {
    return (totalScore / totalQuestions) * 100 + "%";
  };

  const totalQuestions = questions.length; // Define totalQuestions for use in UI

  return (
    <div className="min-h-screen bg-gradient-to-br w-full select-none">
      <ToastContainer autoClose={3000} />
      <div className="question-header mt-12 relative">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">{exam.title}</h1>
          <p className="text-white  text-2xl">
            Read the questions carefully
          </p>{" "}
          <p className="text-white     text-xl">Good Luck</p>
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
        {questions.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>No questions available for this exam.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {isSubmitted && totalScore !== null && (
              <div className="text-center mb-12">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Total Score: {totalScore} / {totalQuestions}
                </h2>
              </div>
            )}

            {Object.entries(groupedQuestions).map(
              ([groupKey, groupQuestions]) => {
                const firstQuestion = groupQuestions[0];
                const contentType = inferContentType(
                  firstQuestion.content || "",
                );

                return (
                  <div key={groupKey} className="space-y-12">
                    {/* Render content only once per group */}
                    {firstQuestion.content && (
                      <div className="mb-6 bg-white rounded-2xl p-8 shadow-md">
                        {contentType === "audio" && (
                          <>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                              Listening Audio
                            </h2>
                            <audio controls className="w-full max-w-md mx-auto">
                              <source
                                src={firstQuestion.content}
                                type="audio/mpeg"
                              />
                              Your browser does not support the audio tag.
                            </audio>
                          </>
                        )}
                        {contentType === "video" && (
                          <>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                              Video Content
                            </h2>
                            <video controls className="w-full max-w-md mx-auto">
                              <source
                                src={firstQuestion.content}
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          </>
                        )}
                        {contentType === "text" && (
                          <>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                              Reading Passage
                            </h2>
                            <p className="text-gray-700">
                              {firstQuestion.content}
                            </p>
                          </>
                        )}
                      </div>
                    )}

                    {/* Render questions in the group */}
                    {groupQuestions.map((question, index) => {
                      const questionKey = question["Question No"] || index;
                      const selectedAnswer = selectedAnswers[questionKey];
                      const availableOptions = ["A", "B", "C", "D"].filter(
                        (option) =>
                          question[`Option ${option}` as keyof Question],
                      );

                      return (
                        <motion.div
                          key={questionKey}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-2xl p-8 shadow-md"
                        >
                          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                            {questions.indexOf(question) + 1}.{" "}
                            {question.Question}
                          </h2>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableOptions.map((option) => {
                              const isOptionSelected =
                                selectedAnswer === option;

                              return (
                                <button
                                  key={option}
                                  onClick={() =>
                                    handleAnswerSelect(questionKey, option)
                                  }
                                  disabled={isSubmitted}
                                  className={`relative overflow-hidden px-6 py-4 rounded-full text-left transition-all duration-200 group hover:shadow-md
                                  ${
                                    isOptionSelected
                                      ? "bg-indigo-600 text-white"
                                      : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                                  }`}
                                >
                                  <span className="font-medium">
                                    {option}.{" "}
                                    {
                                      question[
                                        `Option ${option}` as keyof Question
                                      ]
                                    }
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                );
              },
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          {!submited && (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
            >
              Submit Answers
            </button>
          )}
        </div>
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
                : "Congratulations on completing the exam! Here are your results:"}
            </p>
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Total Score: {totalScore} / {totalQuestions}
                  <div>
                    {" "}
                    Percentage: {getScoreLabel(totalScore || 0, totalQuestions)}
                  </div>
                </h3>
                {/* {examScore !== null && (
                                    <h3 className={getScoreLabel(examScore, studentLevelData).className}>
                                        {getScoreLabel(examScore, studentLevelData).text}
                                    </h3>
                                )} */}
                {/* )} */}
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
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
