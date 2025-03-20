import { motion } from "framer-motion"
import { Clock, Award, Calendar, GraduationCap, Target, PlayCircle } from "lucide-react"
import { format } from "date-fns"
import { Exam, StudentData } from "../../types"
import { levelColors } from "../../data/studentMenu"
import { useEffect, useState } from "react"
import { supabase } from "../../utils/supabase-client"
import Cookies from 'js-cookie'



export default function ExamCard({ exam }: { exam: Exam }) {
    const colors = levelColors[exam.level]
    const userId = Cookies.get('studentID')
    const [userData, setUserData] = useState<StudentData | null>(null)
    const [sendRequest, setSendRequest] = useState(false)
    const [approvedExams, setApprovedExams] = useState<[number, string][][] | null>(null)
    const [data, setData] = useState<string | null>(null)


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data, error } = await supabase.from('students')
                    .select('*')
                    .eq('id', userId)
                    .single()
                if (error) throw error
                console.log(data, 'data user')
                setUserData(data)
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchUser()
    }, [userId])



    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data, error } = await supabase.from('approved-exams')
                    .select('*')
                if (error) throw error
                const titles = data.map(item => [item.student_id, item.title])
                console.log(titles)
                setApprovedExams(titles)
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchUser()
    }, [data])


    const handleRequestUnlock = async () => {
        if (!userId) {
            console.error("User ID not found.");
            return;
        }

        try {
            const { error } = await supabase.from('approved-exams').insert({
                student_id: userId,
                title: exam.title,
                level: exam.level,
                duration: exam.duration,
                pass_score: exam.pass_score,
                created_at: exam.created_at, // Keep original creation time
                file_url: exam.file_url,  // Add file URL
                locked: false // New column with default value false
            });

            if (error) throw error;
            console.log("Exam request submitted successfully!");
            setSendRequest(true)
            setData('salam')
        } catch (err) {
            console.error("Error submitting exam request:", err);
        }
    };


    return (
        <>
            {
                (userData?.level.toUpperCase() === exam.level &&
                    (!approvedExams ||
                        !approvedExams.some(item => item[0] === userData.id && item[1] === exam.title))
                ) && (
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


                        {
                           
                                (
                                    <motion.button
                                        onClick={handleRequestUnlock}
                                        whileHover={{ scale: 1.02 }}
                                        disabled={sendRequest}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full flex items-center justify-center gap-1 px-4 py-3 rounded-xl text-white font-medium ${colors.button} shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 mb-6`}
                                    >
                                        <PlayCircle className="w-5 h-5" />
                                        {sendRequest ? 'Request Sended' : 'Reuqest To Unlock'}
                                    </motion.button>
                                )
                        }
                        {/* </Link> */}

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
                            <span>Created {format( exam.created_at, "MMM d, yyyy")}</span>
                        </div>

                        {/* Decorative Elements */}
                        <div className={`absolute top-0 right-0 -mt-4 mr-4 w-24 h-24 bg-opacity-5 rounded-full blur-xl ${colors.text}`} />
                        <div
                            className={`absolute bottom-0 left-0 -mb-4 ml-4 w-24 h-24 bg-opacity-5 rounded-full blur-xl ${colors.text}`}
                        />
                    </motion.div >
                )
            }
        </>
    )
}

