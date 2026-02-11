import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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

export default function ExamQuestions() {
  const params = useParams();
  const { pathname } = useLocation();
  const id = params?.id;
  const userId = Cookies.get("studentID");

  const pathNameUrl = pathname.split("/");

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [examType, setExamType] = useState<string>("Listening");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sectionScores, setSectionScores] = useState<{ [key: string]: number }>(
    {}
  );
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [examScore, setExamScore] = useState<number | null>(null);
  const [submited, setSubmited] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [studentLevelData, setStudentLevelData] = useState<string>("");
  const examSections = ["Listening", "Reading", "Grammar", "Vocabulary"];

  const [sectionTotals, setSectionTotals] = useState<{ [key: string]: number }>(
    {}
  );

  const navigate = useNavigate();

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
          .from(
            pathNameUrl[1] === "approved-exams" ? "approved-exams" : "exams"
          )
          .select("*")
          .eq("id", id)
          .single();

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
          }));

          setQuestions(formattedData);

          const totals = examSections.reduce((acc, section) => {
            acc[section] = formattedData.filter(
              (q) => q.Section === section
            ).length;
            return acc;
          }, {} as { [key: string]: number });
          setSectionTotals(totals);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch exam veya Excel verisi.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExamAndExcel();
    }
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
      let correctCount = 0;

      filteredQuestions.forEach((question) => {
        const questionNo = question["Question No"];
        const selectedAnswer = selectedAnswers[questionNo];
        const correctAnswer = question["Correct Option"];

        if (selectedAnswer && `Option ${selectedAnswer}` === correctAnswer) {
          correctCount++;
        }
      });

      newSectionScores[section] = correctCount;
      totalCorrectCount += correctCount;
      totalExamScore = (totalCorrectCount * 100) / questions.length;
      setExamScore(totalExamScore);
    });

    setSectionScores(newSectionScores);
    setTotalScore(totalCorrectCount);

    try {
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("id", userId)
        .single();

      if (studentError) {
        throw new Error("Failed to get student level: " + studentError.message);
      }

      const studentLevel = studentData?.level || "Unknown";
      const studentName = studentData?.name || "Unknown";
      setStudentLevelData(studentLevel);

      const { error: resultError } = await supabase
        .from("student_results")
        .insert({
          student_id: userId,
          student_score: totalExamScore,
          student_level: studentLevel,
          exam_name: exam?.title || "İsimsiz Sınav",
          student_name: studentName,
          listening_score: newSectionScores["Listening"],
          reading_score: newSectionScores["Reading"],
          grammar_score: newSectionScores["Grammar"],
          vocabulary_score: newSectionScores["Vocabulary"],
          listening_count: sectionTotals["Listening"],
          reading_count: sectionTotals["Reading"],
          vocabulary_count: sectionTotals["Vocabulary"],
          grammar_count: sectionTotals["Grammar"],
          finish_time: timeLeft
        });

      if (resultError) {
        throw new Error(
          "Exam results could not be saved: " + resultError.message
        );
      }

      const { data: takenExamsData, error: fetchError } = await supabase
        .from("taken-exams")
        .select("exam_count")
        .eq("student_id", userId)
        .single();

      if (fetchError) {
        throw new Error(
          "Unable to take the available number of exams: " + fetchError.message
        );
      }

      const currentExamCount = takenExamsData?.exam_count || 0;

      const { error: updateError } = await supabase
        .from("taken-exams")
        .update({ exam_count: currentExamCount + 1 })
        .eq("student_id", userId);

      if (updateError) {
        throw new Error(
          "Failed to update the number of exams: " + updateError.message
        );
      }

      toast.success("The exam was successfully submitted!");
      setSubmited(true);
      setIsModalOpen(true);

      try {
        const { error } = await supabase
          .from("approved-exams")
          .delete()
          .eq("id", exam?.id);

        if (error) throw error;
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.error(err);
      toast.error("The exam results could not be sent. Please try again.");
      setIsModalOpen(true);
    }
  };

  const filteredQuestions = questions.filter(
    (question) => question.Section === examType
  );

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/locked-exams");
  };

  // İçerik türünü belirleyen yardımcı fonksiyon
  const renderContent = (content: string, section: string) => {
    if (section === "Listening" && content.startsWith("http")) {
      return (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Listening Voice
          </h2>
          <audio controls className="w-full max-w-md mx-auto">
            <source src={content} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    } else if (section === "Reading") {
      return (
        <div className="mb-6 text-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Reading Content
          </h2>
          <p>{content}</p>
        </div>
      );
    } else if (content.startsWith("http")) {
      if (content.endsWith(".jpg") || content.endsWith(".png")) {
        return (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              PDF Content
            </h2>
            <img
              src={content}
              alt="Soru İçeriği"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        );
      } else if (content.endsWith(".pdf")) {
        return (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              PDF Content
            </h2>
            <a
              href={content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline"
            >
              View PDF Content
            </a>
          </div>
        );
      }
    }
    return (
      <div className="mb-6 text-gray-700 select-none">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Content</h2>
        <p>{content}</p>
      </div>
    );
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
      if (score < 60) return { text: "Fail", className: "label-fail" };
      if (score < 70) return { text: "Pass", className: "label-pass" };
      if (score < 80) return { text: "Credit", className: "label-credit" };
      if (score < 95)
        return { text: "Distinction", className: "label-distinction" };
      return { text: "High Distinction", className: "label-high" };
    }

    return { text: "N/A", className: "label-na" };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Exam Questions Loading...</p>
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
          <p>Exam Not Found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br w-full select-none">
      <ToastContainer autoClose={3000} />
      <div className="question-header mt-12 relative">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {exam.title}
          </h1>
          <p className="text-white  text-2xl">Read the questions carefully</p>{" "}
          <p className="text-gray-600  text-xl">Good Luck</p>
        </div>

        <div className="flex items-center justify-center gap-5 mb-10">
          {examSections.map((type) => (
            <button
              key={type}
              className={`relative overflow-hidden px-6 py-4 rounded-full text-left cursor-pointer
                                transition-all duration-200 group hover:shadow-md
                                ${
                                  examType === type
                                    ? "bg-indigo-500 text-white"
                                    : "bg-gray-50 text-gray-900 hover:bg-indigo-500 hover:text-white"
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
              Time Remaining {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-12">
        {filteredQuestions.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>{examType} There are no questions for the section.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {isSubmitted && totalScore !== null && (
              <div className="text-center mb-12">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Toplam Puan: {totalScore} / {questions.length} ({examScore}%)
                </h2>
              </div>
            )}

            {(() => {
              const seenContents = new Set<string>(); // Daha önce görülen içerikleri takip et
              return filteredQuestions.map((question, index) => {
                const questionKey = question["Question No"] || index;
                const selectedAnswer = selectedAnswers[questionKey];
                const availableOptions = ["A", "B", "C", "D"].filter(
                  (option) => question[`Option ${option}` as keyof Question]
                );

                const shouldShowContent =
                  question.content && !seenContents.has(question.content);
                if (question.content) {
                  seenContents.add(question.content); // İçeriği görüldü olarak işaretle
                }

                return (
                  <motion.div
                    key={questionKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-8 shadow-md"
                  >
                    {shouldShowContent &&
                      renderContent(question.content!, examType)}
                    <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                      {index + 1}. {question.Question}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableOptions.map((option) => {
                        const isOptionSelected = selectedAnswer === option;

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
                              {question[`Option ${option}` as keyof Question]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              });
            })()}
          </div>
        )}

        <div className="mt-12 text-center">
          {!submited &&
            (examType === "Vocabulary" ? (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
              >
                Send Answers
              </button>
            ) : (
              <div className="flex justify-between max-w-lg mx-auto">
                <button
                  onClick={() => handleNavigation("prev")}
                  disabled={examType === "Listening"}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md disabled:opacity-50"
                >
                  Prev
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
              {" "}
              Examination Results
            </h2>
            <p className="text-gray-600 mb-6">
              {timeLeft === 0
                ? "Time's up! Here are your results:"
                : "Congratulations on completing the exam! Here are your results:"}
            </p>
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Total Answer: {totalScore} / {questions.length}
                </h3>
                <h3 className="text-xl font-semibold text-gray-900">
                  Total Score: {examScore?.toFixed(2)} %
                </h3>
                {examScore !== null && (
                  <h3 className={getScoreLabel(examScore, studentLevelData).className}>
                    {getScoreLabel(examScore, studentLevelData).text}
                  </h3>
                )}
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-gray-900">
                  Section Scores and Totals:
                </h4>
                {examSections.map((section) => (
                  <p key={section} className="text-gray-700">
                    {section}: {sectionScores[section] || 0} /{" "}
                    {sectionTotals[section] || 0}
                  </p>
                ))}
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
