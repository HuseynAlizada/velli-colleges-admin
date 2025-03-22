import { useEffect, useState } from "react"
import ExamCard from "../../components/user/ExamCard"
import { supabase } from "../../utils/supabase-client"
import { Exam } from "../../types"

export default function LockedExams() {
    const [exams, setExams] = useState<Exam[] | []>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchExams = async () => {
        try {
            setIsLoading(true)
            const { data, error } = await supabase.from('exams').select("*")
            if (error) throw error
            setExams(data)
        }
        catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchExams()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white p-8 py-20">
            {isLoading ? (
                <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[50vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
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
                <h1 className="text-center text-3xl mt-4 w-full">There are no approved exams</h1>
            )}
        </div>
    )
}