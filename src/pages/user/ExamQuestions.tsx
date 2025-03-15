// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { supabase } from "../../utils/supabase-client";
// import * as XLSX from "xlsx";
// import { Loader2 } from "lucide-react";
// import { motion } from "framer-motion";

// interface Exam {
//     id: string;
//     title: string;
//     file_url: string;
// }

// interface Question {
//     "Question No": number;
//     Question: string;
//     "Option A": string;
//     "Option B": string;
//     "Option C": string;
//     "Option D": string;
//     "Correct Option": string;
//     Section: string;
//     content?: string; // Optional field for Reading or Listening content
// }

// export default function ExamQuestions() {
//     const params = useParams();
//     const id = params?.id;

//     const [exam, setExam] = useState<Exam | null>(null);
//     const [questions, setQuestions] = useState<Question[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
//     const [examType, setExamType] = useState<string>("Listening");
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [score, setScore] = useState<number | null>(null);
//     const [incorrectAnswers, setIncorrectAnswers] = useState<{ [key: number]: string }>({});
//     const examSections = ["Listening", "Reading", "Grammar", "Vocabulary"];


//     useEffect(() => {
//         const fetchExamAndExcel = async () => {
//             try {
//                 setLoading(true);

//                 // Fetch exam data
//                 const { data, error } = await supabase.from("exams").select("*").eq("id", id).single();
//                 if (error) throw error;
//                 setExam(data);

//                 // Fetch and parse Excel file
//                 if (data.file_url) {
//                     const response = await fetch(data.file_url);
//                     if (!response.ok) throw new Error("Failed to fetch Excel file");

//                     const arrayBuffer = await response.arrayBuffer();
//                     const workbook = XLSX.read(arrayBuffer, { type: "array" });
//                     const firstSheetName = workbook.SheetNames[0];
//                     const worksheet = workbook.Sheets[firstSheetName];
//                     const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

//                     const formattedData = jsonData.map((row: any, index: number) => ({
//                         "Question No": row["Question No"] || row["question_no"] || row["QuestionNo"] || index,
//                         Question: row["Question"],
//                         "Option A": row["Option A"],
//                         "Option B": row["Option B"],
//                         "Option C": row["Option C"],
//                         "Option D": row["Option D"],
//                         "Correct Option": row["Correct Option"],
//                         Section: row["Section"],
//                         content: row["content"] || "", // Optional field
//                     }));

//                     setQuestions(formattedData);

//                 }
//             } catch (err) {
//                 console.error(err);
//                 setError("Failed to fetch exam or Excel data.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (id) {
//             fetchExamAndExcel();
//         }
//     }, [id]);

//     const handleAnswerSelect = (questionNo: number, option: string) => {
//         console.log("Selected Question No:", questionNo);
//         console.log("Selected Option:", option);

//         if (!isSubmitted) {
//             setSelectedAnswers((prev) => ({
//                 ...prev,
//                 [questionNo]: option, // Seçilen sorunun cevabını değiştir
//             }));
//         }
//     };


//     const handleNavigation = (direction) => {
//         const currentIndex = examSections.indexOf(examType);
//         const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
//         if (newIndex >= 0 && newIndex < examSections.length) {
//             setExamType(examSections[newIndex]);
//         }
//     };



//     const handleSubmit = () => {
//         setIsSubmitted(true);
//         let correctCount = 0;
//         let incorrect: { [key: number]: string } = {};

//         filteredQuestions.forEach((question) => {
//             const questionNo = question["Question No"];
//             const selectedAnswer = selectedAnswers[questionNo];
//             const correctAnswer = question["Correct Option"];
//             console.log(correctAnswer, selectedAnswer, 'test')

//             if (`Option ${selectedAnswer}` === correctAnswer) {
//                 correctCount++;
//             } else {
//                 incorrect[questionNo] = correctAnswer; // Store incorrect answers
//             }
//         });

//         setScore(correctCount);
//         setIncorrectAnswers(incorrect);
//     };

//     // Filter questions based on the selected exam type
//     const filteredQuestions = questions.filter((question) => question.Section === examType);

//     // Extract unique content for the selected exam type (assuming content is the same for all questions in a section)
//     const sectionContent = filteredQuestions.length > 0 ? filteredQuestions[0].content : null;

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-gray-50 to-gray-100">
//                 <div className="text-center">
//                     <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
//                     <p className="text-gray-600">Loading exam questions...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-gray-50 to-gray-100">
//                 <div className="text-center text-red-600 p-8 rounded-lg bg-red-50 border border-red-100">
//                     <p>{error}</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!exam) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
//                 <div className="text-center text-gray-600">
//                     <p>No exam found.</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br w-full">
//             <div className="question-header mt-12">
//                 <div className="text-center mb-12">
//                     <h1 className="text-3xl font-bold text-gray-900 mb-4">{exam.title}</h1>
//                     <p className="text-gray-600 italic">Please read each question carefully and select the correct answer.</p>
//                 </div>

//                 <div className="flex items-center justify-center gap-5 mb-10">
//                     {["Listening", "Reading", "Grammar", "Vocabulary"].map((type) => (
//                         <button
//                             key={type}
//                             className={`relative overflow-hidden px-6 py-4 rounded-full text-left cursor-pointer
//                 transition-all duration-200 group hover:shadow-md
//                 ${examType === type
//                                     ? "bg-indigo-500 text-white"
//                                     : "bg-gray-50 text-gray-900 hover:bg-indigo-500 hover:text-white"
//                                 }`}
//                             onClick={() => setExamType(type)}
//                             disabled={isSubmitted} // Disable section switching after submission
//                         >
//                             {type}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             <div className="max-w-4xl mx-auto px-4 py-12">
//                 {filteredQuestions.length === 0 ? (
//                     <div className="text-center text-gray-600">
//                         <p>No questions available for the {examType} section.</p>
//                     </div>
//                 ) : (
//                     <div className="space-y-12">
//                         {/* Display content for Reading or Listening section only once at the top */}
//                         {sectionContent && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="bg-white rounded-2xl p-8 shadow-sm mb-12"
//                             >
//                                 {examType === "Reading" && (
//                                     <div className="mb-6 text-gray-700">
//                                         <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reading Passage</h2>
//                                         <p>{sectionContent}</p>
//                                     </div>
//                                 )}
//                                 {examType === "Listening" && (
//                                     <div className="mb-6">
//                                         <h2 className="text-2xl font-semibold text-gray-900 mb-4">Listening Audio</h2>
//                                         <audio controls className="w-full max-w-md mx-auto">
//                                             <source src={sectionContent} type="audio/mpeg" />
//                                             Your browser does not support the audio tag.
//                                         </audio>
//                                     </div>
//                                 )}
//                             </motion.div>
//                         )}

//                         {/* Display score if submitted */}
//                         {isSubmitted && score !== null && (
//                             <div className="text-center mb-12">
//                                 <h2 className="text-2xl font-semibold text-gray-900">
//                                     Your Score: {score} / {filteredQuestions.length}
//                                 </h2>
//                                 <p className="text-gray-600">
//                                     {score === filteredQuestions.length
//                                         ? "Perfect! All answers are correct!"
//                                         : "Review the feedback below to see your correct and incorrect answers."}
//                                 </p>
//                             </div>
//                         )}

//                         {/* Questions */}
//                         {filteredQuestions.map((question, index) => {
//                             const questionKey = question["Question No"] || index;
//                             const selectedAnswer = selectedAnswers[questionKey];
//                             const correctAnswer = question["Correct Option"];
//                             const isCorrect = selectedAnswer === correctAnswer;
//                             const isIncorrect = incorrectAnswers[questionKey];

//                             return (
//                                 <motion.div
//                                     key={questionKey}
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ delay: index * 0.1 }}
//                                     className="bg-white rounded-2xl p-8 shadow-sm"
//                                 >
//                                     <h2 className="text-2xl font-semibold text-gray-900 mb-8">
//                                         {index + 1}. {question.Question}
//                                     </h2>

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         {/* {["A", "B", "C", "D"].map((option) => {
//                                             const isOptionSelected = selectedAnswer === option;
//                                             const isOptionCorrect = correctAnswer === option;

//                                             return (
//                                                 <button
//                                                     key={option}
//                                                     onClick={() => handleAnswerSelect(questionKey, option)}
//                                                     disabled={isSubmitted}
//                                                     className={`
//                                 relative overflow-hidden px-6 py-4 rounded-full text-left
//                                 transition-all duration-200 group hover:shadow-md
//                                 ${isSubmitted
//                                                             ? isOptionCorrect
//                                                                 ? "bg-green-500 text-white"
//                                                                 : isOptionSelected
//                                                                     ? "bg-red-500 text-white"
//                                                                     : "bg-gray-50 text-gray-900"
//                                                             : isOptionSelected
//                                                                 ? "bg-indigo-600 text-white"
//                                                                 : "bg-gray-50 text-gray-900 hover:bg-gray-100"
//                                                         }
//                             `}
//                                                 >
//                                                     <span className="font-medium">
//                                                         {option}. {question[`Option ${option}` as keyof Question]}
//                                                     </span>
//                                                 </button>
//                                             );
//                                         })} */}


//                                         {["A", "B", "C", "D"].map((option) => {
//                                             console.log(option, correctAnswer, 'test')
//                                             const isOptionSelected = selectedAnswer === option;
//                                             const isOptionCorrect = correctAnswer === `Option ${option}`;
//                                             const isIncorrect = isOptionSelected && !isOptionCorrect;

//                                             return (
//                                                 <button
//                                                     key={option}
//                                                     onClick={() => handleAnswerSelect(questionKey, option)}
//                                                     disabled={isSubmitted} // Disable selection after submission
//                                                     className={`relative overflow-hidden px-6 py-4 rounded-full text-left transition-all duration-200 group hover:shadow-md
//                 ${isSubmitted
//                                                             ? isOptionCorrect
//                                                                 ? "bg-green-500 text-white" // Correct answer (always green after submission)
//                                                                 : isIncorrect
//                                                                     ? "bg-red-500 text-white" // Incorrect answer (red if selected)
//                                                                     : "bg-gray-50 text-gray-900"
//                                                             : isOptionSelected
//                                                                 ? "bg-indigo-600 text-white"
//                                                                 : "bg-gray-50 text-gray-900 hover:bg-gray-100"
//                                                         }
//             `}
//                                                 >
//                                                     <span className="font-medium">
//                                                         {option}. {question[`Option ${option}` as keyof Question]}
//                                                     </span>
//                                                 </button>
//                                             );
//                                         })}

//                                     </div>

//                                     {/* Show Correct Answer if Incorrect */}
//                                     {isIncorrect && (
//                                         <p className="mt-4 text-red-500">
//                                             Correct Answer: <strong>{correctAnswer}</strong>
//                                         </p>
//                                     )}
//                                 </motion.div>
//                             );
//                         })}


//                     </div>
//                 )}

//                 {/* Submit Button */}
//                 {
//                     examType === 'Vocabulary' ? (
//                         <div className="mt-12 text-center">
//                             {!isSubmitted ? (
//                                 <button
//                                     onClick={handleSubmit}
//                                     className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
//                                 >
//                                     Submit Answers
//                                 </button>
//                             ) : (
//                                 <button
//                                     onClick={() => {
//                                         setIsSubmitted(false);
//                                         setSelectedAnswers({});
//                                         setScore(null);
//                                     }}
//                                     className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
//                                 >
//                                     Retake Test
//                                 </button>
//                             )}
//                         </div>
//                     ) : (
//                         <div className="flex justify-between max-w-lg mx-auto mt-6">
//                         <button
//                             onClick={() => handleNavigation("prev")}
//                             disabled={examType === "Listening"}
//                             className="px-4 py-2 bg-gray-500 text-white rounded-md disabled:opacity-50"
//                         >
//                             Previous
//                         </button>
//                         <button
//                             onClick={() => handleNavigation("next")}
//                             disabled={examType === "Vocabulary"}
//                             className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
//                         >
//                             Next
//                         </button>
//                     </div>
//                     )
//                 }

//             </div>
//         </div>
//     );
// }









// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { supabase } from "../../utils/supabase-client";
// import * as XLSX from "xlsx";
// import { Loader2 } from "lucide-react";
// import { motion } from "framer-motion";

// interface Exam {
//     id: string;
//     title: string;
//     file_url: string;
// }

// interface Question {
//     "Question No": number;
//     Question: string;
//     "Option A": string;
//     "Option B": string;
//     "Option C": string;
//     "Option D": string;
//     "Correct Option": string;
//     Section: string;
//     content?: string; // Optional field for Reading or Listening content
// }

// export default function ExamQuestions() {
//     const params = useParams();
//     const id = params?.id;

//     const [exam, setExam] = useState<Exam | null>(null);
//     const [questions, setQuestions] = useState<Question[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
//     const [examType, setExamType] = useState<string>("Listening");
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [sectionScores, setSectionScores] = useState<{ [key: string]: number }>({});
//     const [totalScore, setTotalScore] = useState<number | null>(null);
//     const [sectionIncorrectAnswers, setSectionIncorrectAnswers] = useState<{ [key: string]: { [key: number]: string } }>({});
//     const examSections = ["Listening", "Reading", "Grammar", "Vocabulary"];

//     useEffect(() => {
//         const fetchExamAndExcel = async () => {
//             try {
//                 setLoading(true);

//                 // Fetch exam data
//                 const { data, error } = await supabase.from("exams").select("*").eq("id", id).single();
//                 if (error) throw error;
//                 setExam(data);

//                 // Fetch and parse Excel file
//                 if (data.file_url) {
//                     const response = await fetch(data.file_url);
//                     if (!response.ok) throw new Error("Failed to fetch Excel file");

//                     const arrayBuffer = await response.arrayBuffer();
//                     const workbook = XLSX.read(arrayBuffer, { type: "array" });
//                     const firstSheetName = workbook.SheetNames[0];
//                     const worksheet = workbook.Sheets[firstSheetName];
//                     const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

//                     const formattedData = jsonData.map((row: any, index: number) => ({
//                         "Question No": row["Question No"] || row["question_no"] || row["QuestionNo"] || index,
//                         Question: row["Question"],
//                         "Option A": row["Option A"],
//                         "Option B": row["Option B"],
//                         "Option C": row["Option C"],
//                         "Option D": row["Option D"],
//                         "Correct Option": row["Correct Option"],
//                         Section: row["Section"],
//                         content: row["content"] || "", // Optional field
//                     }));

//                     setQuestions(formattedData);
//                 }
//             } catch (err) {
//                 console.error(err);
//                 setError("Failed to fetch exam or Excel data.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (id) {
//             fetchExamAndExcel();
//         }
//     }, [id]);

//     const handleAnswerSelect = (questionNo: number, option: string) => {
//         if (!isSubmitted) {
//             setSelectedAnswers((prev) => ({
//                 ...prev,
//                 [questionNo]: option,
//             }));
//         }
//     };

//     const handleNavigation = (direction: string) => {
//         const currentIndex = examSections.indexOf(examType);
//         const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
//         if (newIndex >= 0 && newIndex < examSections.length) {
//             setExamType(examSections[newIndex]);
//         }
//     };

//     const handleSubmit = () => {
//         setIsSubmitted(true);
//         let totalCorrectCount = 0;
//         const newSectionScores: { [key: string]: number } = {};
//         const newSectionIncorrectAnswers: { [key: string]: { [key: number]: string } } = {};

//         examSections.forEach((section) => {
//             const filteredQuestions = questions.filter((q) => q.Section === section);
//             let correctCount = 0;
//             let incorrect: { [key: number]: string } = {};

//             filteredQuestions.forEach((question) => {
//                 const questionNo = question["Question No"];
//                 const selectedAnswer = selectedAnswers[questionNo];
//                 const correctAnswer = question["Correct Option"];

//                 if (selectedAnswer && `Option ${selectedAnswer}` === correctAnswer) {
//                     correctCount++;
//                 } else if (selectedAnswer) {
//                     incorrect[questionNo] = correctAnswer;
//                 }
//             });

//             newSectionScores[section] = correctCount;
//             newSectionIncorrectAnswers[section] = incorrect;
//             totalCorrectCount += correctCount;
//         });

//         setSectionScores(newSectionScores);
//         setSectionIncorrectAnswers(newSectionIncorrectAnswers);
//         setTotalScore(totalCorrectCount);
//     };

//     // Filter questions based on the selected exam type
//     const filteredQuestions = questions.filter((question) => question.Section === examType);

//     // Extract unique content for the selected exam type
//     const sectionContent = filteredQuestions.length > 0 ? filteredQuestions[0].content : null;

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-gray-50 to-gray-100">
//                 <div className="text-center">
//                     <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
//                     <p className="text-gray-600">Loading exam questions...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-gray-50 to-gray-100">
//                 <div className="text-center text-red-600 p-8 rounded-lg bg-red-50 border border-red-100">
//                     <p>{error}</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!exam) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
//                 <div className="text-center text-gray-600">
//                     <p>No exam found.</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br w-full">
//             <div className="question-header mt-12">
//                 <div className="text-center mb-12">
//                     <h1 className="text-3xl font-bold text-gray-900 mb-4">{exam.title}</h1>
//                     <p className="text-gray-600 italic">Please read each question carefully and select the correct answer.</p>
//                 </div>

//                 <div className="flex items-center justify-center gap-5 mb-10">
//                     {examSections.map((type) => (
//                         <button
//                             key={type}
//                             className={`relative overflow-hidden px-6 py-4 rounded-full text-left cursor-pointer
//                 transition-all duration-200 group hover:shadow-md
//                 ${examType === type
//                                     ? "bg-indigo-500 text-white"
//                                     : "bg-gray-50 text-gray-900 hover:bg-indigo-500 hover:text-white"
//                                 }`}
//                             onClick={() => setExamType(type)}
//                         >
//                             {type}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             <div className="max-w-4xl mx-auto px-4 py-12">
//                 {filteredQuestions.length === 0 ? (
//                     <div className="text-center text-gray-600">
//                         <p>No questions available for the {examType} section.</p>
//                     </div>
//                 ) : (
//                     <div className="space-y-12">
//                         {/* Display content for Reading or Listening section only once at the top */}
//                         {sectionContent && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="bg-white rounded-2xl p-8 shadow-sm mb-12"
//                             >
//                                 {examType === "Reading" && (
//                                     <div className="mb-6 text-gray-700">
//                                         <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reading Passage</h2>
//                                         <p>{sectionContent}</p>
//                                     </div>
//                                 )}
//                                 {examType === "Listening" && (
//                                     <div className="mb-6">
//                                         <h2 className="text-2xl font-semibold text-gray-900 mb-4">Listening Audio</h2>
//                                         <audio controls className="w-full max-w-md mx-auto">
//                                             <source src={sectionContent} type="audio/mpeg" />
//                                             Your browser does not support the audio tag.
//                                         </audio>
//                                     </div>
//                                 )}
//                             </motion.div>
//                         )}

//                         {/* Display Total Score and Section Score if Submitted */}
//                         {isSubmitted && totalScore !== null && (
//                             <div className="text-center mb-12">
//                                 <h2 className="text-2xl font-semibold text-gray-900">
//                                     Total Score: {totalScore} / {questions.length}
//                                 </h2>
//                                 <h3 className="text-xl font-semibold text-gray-700 mt-4">
//                                     {examType} Score: {sectionScores[examType]} / {filteredQuestions.length}
//                                 </h3>
//                                 <p className="text-gray-600 mt-2">
//                                     {totalScore === questions.length
//                                         ? "Perfect! All answers are correct across all sections!"
//                                         : "Review the feedback below to see your correct and incorrect answers for each section."}
//                                 </p>
//                             </div>
//                         )}

//                         {/* Questions */}
//                         {filteredQuestions.map((question, index) => {
//                             const questionKey = question["Question No"] || index;
//                             const selectedAnswer = selectedAnswers[questionKey];
//                             const correctAnswer = question["Correct Option"];
//                             const isOptionCorrect = (option: string) => `Option ${option}` === correctAnswer;
//                             const isIncorrect = isSubmitted && selectedAnswer && !isOptionCorrect(selectedAnswer);

//                             return (
//                                 <motion.div
//                                     key={questionKey}
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ delay: index * 0.1 }}
//                                     className="bg-white rounded-2xl p-8 shadow-sm"
//                                 >
//                                     <h2 className="text-2xl font-semibold text-gray-900 mb-8">
//                                         {index + 1}. {question.Question}
//                                     </h2>

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         {["A", "B", "C", "D"].map((option) => {
//                                             const isOptionSelected = selectedAnswer === option;
//                                             const isOptionCorrect = `Option ${option}` === correctAnswer;
//                                             const isIncorrect = isOptionSelected && !isOptionCorrect;

//                                             return (
//                                                 <button
//                                                     key={option}
//                                                     onClick={() => handleAnswerSelect(questionKey, option)}
//                                                     disabled={isSubmitted}
//                                                     className={`relative overflow-hidden px-6 py-4 rounded-full text-left transition-all duration-200 group hover:shadow-md
//                                                         ${isSubmitted
//                                                             ? isOptionCorrect
//                                                                 ? "bg-green-500 text-white"
//                                                                 : isIncorrect
//                                                                     ? "bg-red-500 text-white"
//                                                                     : "bg-gray-50 text-gray-900"
//                                                             : isOptionSelected
//                                                                 ? "bg-indigo-600 text-white"
//                                                                 : "bg-gray-50 text-gray-900 hover:bg-gray-100"
//                                                         }`}
//                                                 >
//                                                     <span className="font-medium">
//                                                         {option}. {question[`Option ${option}` as keyof Question]}
//                                                     </span>
//                                                 </button>
//                                             );
//                                         })}
//                                     </div>

//                                     {/* Show Correct Answer if Incorrect */}
//                                     {isIncorrect && (
//                                         <p className="mt-4 text-red-500">
//                                             Correct Answer: <strong>{correctAnswer}</strong>
//                                         </p>
//                                     )}
//                                 </motion.div>
//                             );
//                         })}
//                     </div>
//                 )}

//                 {/* Navigation and Submit Buttons */}
//                 <div className="mt-12 text-center">
//                     {!isSubmitted ? (
//                         <>
//                             {examType === "Vocabulary" ? (
//                                 <button
//                                     onClick={handleSubmit}
//                                     className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
//                                 >
//                                     Submit Answers
//                                 </button>
//                             ) : (
//                                 <div className="flex justify-between max-w-lg mx-auto">
//                                     <button
//                                         onClick={() => handleNavigation("prev")}
//                                         disabled={examType === "Listening"}
//                                         className="px-4 py-2 bg-gray-500 text-white rounded-md disabled:opacity-50"
//                                     >
//                                         Previous
//                                     </button>
//                                     <button
//                                         onClick={() => handleNavigation("next")}
//                                         disabled={examType === "Vocabulary"}
//                                         className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
//                                     >
//                                         Next
//                                     </button>
//                                 </div>
//                             )}
//                         </>
//                     ) : (
//                         <button
//                             onClick={() => {
//                                 setIsSubmitted(false);
//                                 setSelectedAnswers({});
//                                 setSectionScores({});
//                                 setTotalScore(null);
//                                 setSectionIncorrectAnswers({});
//                             }}
//                             className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
//                         >
//                             Retake Test
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }   










import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../utils/supabase-client";
import * as XLSX from "xlsx";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

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
    "Option D": string;
    "Correct Option": string;
    Section: string;
    content?: string; // Optional field for Reading or Listening content
}

export default function ExamQuestions() {
    const params = useParams();
    const id = params?.id;

    const [exam, setExam] = useState<Exam | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
    const [examType, setExamType] = useState<string>("Listening");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [sectionScores, setSectionScores] = useState<{ [key: string]: number }>({});
    const [totalScore, setTotalScore] = useState<number | null>(null);
    const [sectionIncorrectAnswers, setSectionIncorrectAnswers] = useState<{ [key: string]: { [key: number]: string } }>({});
    const [sectionUnansweredQuestions, setSectionUnansweredQuestions] = useState<{ [key: string]: number[] }>({}); // Track unanswered questions
    const examSections = ["Listening", "Reading", "Grammar", "Vocabulary"];

    useEffect(() => {
        const fetchExamAndExcel = async () => {
            try {
                setLoading(true);

                // Fetch exam data
                const { data, error } = await supabase.from("exams").select("*").eq("id", id).single();
                if (error) throw error;
                setExam(data);

                // Fetch and parse Excel file
                if (data.file_url) {
                    const response = await fetch(data.file_url);
                    if (!response.ok) throw new Error("Failed to fetch Excel file");

                    const arrayBuffer = await response.arrayBuffer();
                    const workbook = XLSX.read(arrayBuffer, { type: "array" });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

                    const formattedData = jsonData.map((row: any, index: number) => ({
                        "Question No": row["Question No"] || row["question_no"] || row["QuestionNo"] || index,
                        Question: row["Question"],
                        "Option A": row["Option A"],
                        "Option B": row["Option B"],
                        "Option C": row["Option C"],
                        "Option D": row["Option D"],
                        "Correct Option": row["Correct Option"],
                        Section: row["Section"],
                        content: row["content"] || "", // Optional field
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

    const handleSubmit = () => {
        setIsSubmitted(true);
        let totalCorrectCount = 0;
        const newSectionScores: { [key: string]: number } = {};
        const newSectionIncorrectAnswers: { [key: string]: { [key: number]: string } } = {};
        const newSectionUnansweredQuestions: { [key: string]: number[] } = {};

        examSections.forEach((section) => {
            const filteredQuestions = questions.filter((q) => q.Section === section);
            let correctCount = 0;
            let incorrect: { [key: number]: string } = {};
            let unanswered: number[] = [];

            filteredQuestions.forEach((question) => {
                const questionNo = question["Question No"];
                const selectedAnswer = selectedAnswers[questionNo];
                const correctAnswer = question["Correct Option"];

                if (!selectedAnswer) {
                    // Track unanswered questions
                    unanswered.push(questionNo);
                } else if (`Option ${selectedAnswer}` === correctAnswer) {
                    correctCount++;
                } else {
                    incorrect[questionNo] = correctAnswer;
                }
            });

            newSectionScores[section] = correctCount;
            newSectionIncorrectAnswers[section] = incorrect;
            newSectionUnansweredQuestions[section] = unanswered;
            totalCorrectCount += correctCount;
        });

        setSectionScores(newSectionScores);
        setSectionIncorrectAnswers(newSectionIncorrectAnswers);
        setSectionUnansweredQuestions(newSectionUnansweredQuestions);
        setTotalScore(totalCorrectCount);
    };

    // Filter questions based on the selected exam type
    const filteredQuestions = questions.filter((question) => question.Section === examType);

    // Extract unique content for the selected exam type
    const sectionContent = filteredQuestions.length > 0 ? filteredQuestions[0].content : null;

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

    return (
        <div className="min-h-screen bg-gradient-to-br w-full">
            <div className="question-header mt-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{exam.title}</h1>
                    <p className="text-gray-600 italic">Please read each question carefully and select the correct answer.</p>
                </div>

                <div className="flex items-center justify-center gap-5 mb-10">
                    {examSections.map((type) => (
                        <button
                            key={type}
                            className={`relative overflow-hidden px-6 py-4 rounded-full text-left cursor-pointer
                transition-all duration-200 group hover:shadow-md
                ${examType === type
                                    ? "bg-indigo-500 text-white"
                                    : "bg-gray-50 text-gray-900 hover:bg-indigo-500 hover:text-white"
                                }`}
                            onClick={() => setExamType(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {filteredQuestions.length === 0 ? (
                    <div className="text-center text-gray-600">
                        <p>No questions available for the {examType} section.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Display content for Reading or Listening section only once at the top */}
                        {sectionContent && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl p-8 shadow-sm mb-12"
                            >
                                {examType === "Reading" && (
                                    <div className="mb-6 text-gray-700">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reading Passage</h2>
                                        <p>{sectionContent}</p>
                                    </div>
                                )}
                                {examType === "Listening" && (
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Listening Audio</h2>
                                        <audio controls className="w-full max-w-md mx-auto">
                                            <source src={sectionContent} type="audio/mpeg" />
                                            Your browser does not support the audio tag.
                                        </audio>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Display Total Score and Section Score if Submitted */}
                        {isSubmitted && totalScore !== null && (
                            <div className="text-center mb-12">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Total Score: {totalScore} / {questions.length}
                                </h2>
                                <h3 className="text-xl font-semibold text-gray-700 mt-4">
                                    {examType} Score: {sectionScores[examType]} / {filteredQuestions.length}
                                </h3>
                                <p className="text-gray-600 mt-2">
                                    {totalScore === questions.length
                                        ? "Perfect! All answers are correct across all sections!"
                                        : "Review the feedback below to see your correct and incorrect answers for each section."}
                                </p>
                            </div>
                        )}

                        {/* Questions */}
                        {filteredQuestions.map((question, index) => {
                            const questionKey = question["Question No"] || index;
                            const selectedAnswer = selectedAnswers[questionKey];
                            const correctAnswer = question["Correct Option"];
                            const isOptionCorrect = (option: string) => `Option ${option}` === correctAnswer;
                            const isIncorrect = isSubmitted && selectedAnswer && !isOptionCorrect(selectedAnswer);
                            const isUnanswered = isSubmitted && !selectedAnswer && sectionUnansweredQuestions[examType]?.includes(questionKey);

                            return (
                                <motion.div
                                    key={questionKey}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl p-8 shadow-sm"
                                >
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                                        {index + 1}. {question.Question}
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {["A", "B", "C", "D"].map((option) => {
                                            const isOptionSelected = selectedAnswer === option;
                                            const isOptionCorrect = `Option ${option}` === correctAnswer;
                                            const isIncorrect = isOptionSelected && !isOptionCorrect;

                                            return (
                                                <button
                                                    key={option}
                                                    onClick={() => handleAnswerSelect(questionKey, option)}
                                                    disabled={isSubmitted}
                                                    className={`relative overflow-hidden px-6 py-4 rounded-full text-left transition-all duration-200 group hover:shadow-md
                                                        ${isSubmitted
                                                            ? isOptionCorrect
                                                                ? "bg-green-500 text-white" // Correct answer
                                                                : isIncorrect
                                                                    ? "bg-red-500 text-white" // Incorrect answer
                                                                    : isUnanswered
                                                                        ? "bg-yellow-300 text-gray-900" // Unanswered question
                                                                        : "bg-gray-50 text-gray-900" // Unselected option
                                                            : isOptionSelected
                                                                ? "bg-indigo-600 text-white" // Selected but not submitted
                                                                : "bg-gray-50 text-gray-900 hover:bg-gray-100" // Unselected option
                                                        }`}
                                                >
                                                    <span className="font-medium">
                                                        {option}. {question[`Option ${option}` as keyof Question]}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Show Feedback for Incorrect or Unanswered Questions */}
                                    {isSubmitted && (
                                        <p className={`mt-4 ${isIncorrect ? "text-red-500" : isUnanswered ? "text-yellow-600" : ""}`}>
                                            {isIncorrect && (
                                                <>
                                                    Incorrect. Correct Answer: <strong>{correctAnswer}</strong>
                                                </>
                                            )}
                                            {isUnanswered && (
                                                <>
                                                    Not Answered. Correct Answer: <strong>{correctAnswer}</strong>
                                                </>
                                            )}
                                        </p>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Navigation and Submit Buttons */}
                <div className="mt-12 text-center">
                    {!isSubmitted ? (
                        <>
                            {examType === "Vocabulary" ? (
                                <button
                                    onClick={handleSubmit}
                                    className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
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
                            )}
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                setIsSubmitted(false);
                                setSelectedAnswers({});
                                setSectionScores({});
                                setTotalScore(null);
                                setSectionIncorrectAnswers({});
                                setSectionUnansweredQuestions({});
                            }}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
                        >
                            Retake Test
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}