import { RequestedExams } from '../../types'

import { motion } from "framer-motion"
import { Clock, Award, Calendar, GraduationCap, Target, PlayCircle } from "lucide-react"
import { format } from "date-fns"
import { levelColors } from '../../data/studentMenu'
import { Link } from 'react-router-dom'

const ApprovedExam = ({ exam }: { exam: RequestedExams }) => {
    console.log(exam, 'exam')
    const colors = levelColors[exam.level ? exam?.level : "C1"]

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`relative w-full max-w-sm bg-gradient-to-b ${colors.bg} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border ${colors.border}`}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1.5">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-medium ${colors.badge}`}>
                            Level:  {exam.level}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{exam.title}</h3>
                    </div>
                    <motion.div whileHover={{ rotate: 15, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                        <GraduationCap className={`w-6 h-6 ${colors.icon}`} />
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                            <Clock className={`w-4 h-4 ${colors.icon}`} />
                            <span className="text-sm text-gray-600">Duration</span>
                        </div>
                        <p className="font-medium text-gray-900">{exam.duration} hr</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                            <Target className={`w-4 h-4 ${colors.icon}`} />
                            <span className="text-sm text-gray-600">Pass Score</span>
                        </div>
                        <p className="font-medium text-gray-900">{exam.pass_score}%</p>
                    </div>
                </div>


                <Link to={`${exam.id}`}>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center justify-center gap-1 px-4 py-3 rounded-xl text-white font-medium ${colors.button} shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 mb-6`}
                    >
                        <PlayCircle className="w-5 h-5" />
                        Start Exam
                    </motion.button>
                </Link>

                {/* Active Users Stats */}
                <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Award className={`w-5 h-5 ${colors.icon}`} />
                        <p>
                            <span className="font-medium text-gray-900">22 Students</span> are solving{" "}
                            per day
                        </p>
                    </div>
                </div>
                {/* Created At */}
                <div className="mt-4 flex items-center gap-1.5 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Created { exam.created_at ?format(new Date(exam.created_at), "MMM d, yyyy"):"Unknown date"}</span>
                </div>

                {/* Decorative Elements */}
                <div className={`absolute top-0 right-0 -mt-4 mr-4 w-24 h-24 bg-opacity-5 rounded-full blur-xl ${colors.text}`} />
                <div
                    className={`absolute bottom-0 left-0 -mb-4 ml-4 w-24 h-24 bg-opacity-5 rounded-full blur-xl ${colors.text}`}
                />
            </motion.div>
        </div>
    )
}

export default ApprovedExam