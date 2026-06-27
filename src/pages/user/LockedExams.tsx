import { useEffect, useState } from "react"
import ExamCard from "../../components/user/ExamCard"
import { supabase } from "../../utils/supabase-client"
import { Exam, StudentData } from "../../types"
import Cookies from 'js-cookie'

export default function LockedExams() {
    const [exams, setExams] = useState<Exam[] | []>([])
    const [isLoading, setIsLoading] = useState(true)
    const userId = Cookies.get('studentID')
    const [userData, setUserData] = useState<StudentData | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data, error } = await supabase.from('students')
                    .select('*')
                    .eq('id', userId)
                    .single()
                if (error) throw error
                setUserData(data)
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchUser()
    }, [userId])


    const fetchExams = async () => {
        try {
            setIsLoading(true)
            const { data, error } = await supabase.from('exams').select("*")
            if (error) throw error

            const filteredData = data.filter(item => item.level == userData?.level.toUpperCase())
            setExams(filteredData)
        }
        catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchExams()
    }, [userData])

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-[#84A3F9]/10 to-white p-8 py-20">
            {isLoading ? (
                <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[50vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#487ACB]"></div>
                        <span className="text-gray-600 text-lg">Loading exams...</span>
                    </div>
                </div>
            ) : exams.length > 0 ? (
                <div className="max-w-7xl mx-auto grid lg:grid-cols-4 sm:grid-cols-2 gap-3">
                    {exams.map((exam) => (
                        <ExamCard key={exam.id} exam={exam} />
                    ))}
                </div>
            ) : (
                <h1 className="text-center text-3xl mt-4 w-full">There are no Locked exams</h1>
            )}
        </div>
    )
}