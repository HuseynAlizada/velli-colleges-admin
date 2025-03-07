"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../../utils/supabase-client"
import * as XLSX from "xlsx"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface Exam {
    id: string
    title: string
    file_url: string
}

interface Question {
    "Question No": number
    Question: string
    "Option A": string
    "Option B": string
    "Option C": string
    "Option D": string
    "Correct Answer": string
}

export default function ExamQuestions() {
    const params = useParams()
    const id = params?.id

    const [exam, setExam] = useState<Exam | null>(null)
    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})

    const [examType, setExamType] = useState('Listening')

    useEffect(() => {
        const fetchExamAndExcel = async () => {
            try {
                setLoading(true)

                // Fetch exam data
                const { data, error } = await supabase.from("exams").select("*").eq("id", id).single()

                if (error) throw error
                setExam(data)

                // Fetch and parse Excel file
                if (data.file_url) {
                    const response = await fetch(data.file_url)
                    if (!response.ok) throw new Error("Failed to fetch Excel file")

                    const arrayBuffer = await response.arrayBuffer()
                    const workbook = XLSX.read(arrayBuffer, { type: "array" })
                    const firstSheetName = workbook.SheetNames[0]
                    const worksheet = workbook.Sheets[firstSheetName]
                    const jsonData = XLSX.utils.sheet_to_json(worksheet)

                    setQuestions(jsonData as Question[])

                    console.log(jsonData);

                }
            } catch (err) {
                console.error(err)
                setError("Failed to fetch exam or Excel data.")
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchExamAndExcel()
        }
    }, [id])

    const handleAnswerSelect = (questionNo: number, option: string) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionNo]: option,
        }))
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading exam questions...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center text-red-600 p-8 rounded-lg bg-red-50 border border-red-100">
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    if (!exam) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center text-gray-600">
                    <p>No exam found.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br w-full from-gray-300 via-gray-50 to-indigo-500">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{exam.title}</h1>
                    <p className="text-gray-600 italic">Please read each question carefully and select the correct answer.</p>
                </div>

                <div className="flex items-center justify-center gap-5 mb-10">
                    <button className={`relative overflow-hidden px-6 py-4 rounded-full text-left
                      transition-all duration-200 group hover:shadow-md  bg-gray-50 text-gray-900 hover:bg-rose-500 hover:text-white ${examType == 'Vocabulary' && 'bg-rose-500'}`}
                        onClick={() => setExamType('Listening')}
                    >Listening</button>
                    <button className={`relative overflow-hidden px-6 py-4 rounded-full text-left
                      transition-all duration-200 group hover:shadow-md bg-gray-50 text-gray-900  hover:bg-rose-500 hover:text-white ${examType == 'Vocabulary' && 'bg-rose-500'}`}
                        onClick={() => setExamType('Reading')}>Reading</button>
                    <button className={`relative overflow-hidden px-6 py-4 rounded-full text-left
                      transition-all duration-200 group hover:shadow-md bg-gray-50 text-gray-900  hover:bg-rose-500 hover:text-white ${examType == 'Vocabulary' && 'bg-rose-500'}`}
                        onClick={() => setExamType('Grammar')}
                    >Grammar</button>
                    <button className={`relative overflow-hidden px-6 py-4 rounded-full text-left
                      transition-all duration-200 group hover:shadow-md bg-gray-50 text-gray-900  hover:bg-rose-500 hover:text-white ${examType == 'Vocabulary' && 'bg-rose-500'}`}
                        onClick={() => setExamType('Vocabulary')}
                    >Vocabulary</button>
                </div>

                {/* Questions */}
                <div className="space-y-12">
                    {questions.map((question, index) => (
                        <motion.div
                            key={question["Question No"] || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-8 shadow-sm"
                        >
                            {/* Question */}
                            {question["Section"] == 'Reading' &&
                                (
                                    <>
                                        <div>{question.content}</div>
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-8">{question["Question"]}</h2>
                                    </>
                                )
                            }

                            {question["Section"] == 'Listening' &&
                                (
                                    <>
                                        <div className="mb-6">
                                            <audio controls className="w-full max-w-md mx-auto">
                                                <source src={question.content} type="audio/mpeg" />
                                                Your browser does not support the audio tag.
                                            </audio>
                                        </div>
                                    </>
                                )
                            }



                            {/* Options Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {["A", "B", "C", "D"].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleAnswerSelect(question["Question No"], option)}
                                        className={`
                      relative overflow-hidden px-6 py-4 rounded-full text-left
                      transition-all duration-200 group hover:shadow-md
                      ${selectedAnswers[question["Question No"]] === option
                                                ? "bg-indigo-600 text-white"
                                                : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                                            }
                    `}
                                    >
                                        <div className="relative z-10">
                                            <span className="font-medium">
                                                {option}. {question[`Option ${option}` as keyof Question]}
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="mt-12 text-center">
                    <button className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors">
                        Submit Answers
                    </button>
                </div>
            </div>
        </div>
    )
}

