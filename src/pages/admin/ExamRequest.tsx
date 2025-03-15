import { motion } from "framer-motion"
import { Clock, Award, Calendar, GraduationCap, Target, PlayCircle } from "lucide-react"
import { format } from "date-fns"
import { levelColors } from "../../data/studentMenu"
import { RequestedExams } from "../../types"
import { useEffect, useState } from "react"
import { supabase } from "../../utils/supabase-client"

const ExamRequest = ({ exam, setFetchData }: { exam: RequestedExams | null, setFetchData:Dispatch<SetStateAction<string>> }) => {

    const [aproveExam, setApproveExam] = useState<boolean>(false)
    const [userData, setUserData] = useState()

    // console.log(exam, 'exam')

    const colors = levelColors[exam?.level]

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data, error } = await supabase.from('students')
                    .select('*')
                    .eq('id', exam?.student_id)
                    .single()
                if (error) throw error
                setUserData(data)
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchUser()
        setFetchData('test')

    }, [])



    const ApproveExam = async () => {
        setApproveExam(true)
        const { data, error } = await supabase.from("approved-exams").update({
            student_id: exam?.student_id,
            title: exam?.title,
            level: exam?.level,
            duration: exam?.duration,
            pass_score: exam?.pass_score,
            created_at: exam?.created_at, // Keep original creation time
            file_url: exam?.file_url,  // Add file URL
            locked: true
        }).eq("id", exam?.id)
        if (error) throw error;

        // console.log(data)
        //   setRequestedExams(data)
    }

    return (
        <>

            {exam && !exam.locked && (
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


                    {/* <Link to={`${exam.id}`}> */}
                    <motion.button
                        onClick={ApproveExam}
                        whileHover={{ scale: 1.02 }}
                        disabled={aproveExam}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center justify-center gap-1 px-4 py-3 rounded-xl text-white font-medium ${colors.button} shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 mb-6`}
                    >
                        <PlayCircle className="w-5 h-5" />
                        Unlock the exam
                    </motion.button>
                    {/* </Link> */}

                    {/* Active Users Stats */}
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600">
                            {/* <Award className={`w-5 h-5 ${colors.icon}`} /> */}
                            <p>
                                <span className="font-medium text-gray-900">Student Name:</span> {userData?.name}
                            </p>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600">
                            {/* <Award className={`w-5 h-5 ${colors.icon}`} /> */}
                            <p>
                                <span className="font-medium text-gray-900">Student Level:</span> {userData?.level.toUpperCase()}
                            </p>
                        </div>
                    </div>
                    {/* Created At */}
                  
                    {/* Decorative Elements */}
                   
                </motion.div>
            )}

        </>
    )
}

export default ExamRequest