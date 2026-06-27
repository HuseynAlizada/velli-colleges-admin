import { useEffect, useState } from "react"
import { RequestedExams } from "../../types"
import { supabase } from "../../utils/supabase-client"
import Cookies from "js-cookie"

import ApprovedExam from "./ApprovedExam"


const ApprovedExams = () => {

    const [exams, setExams] = useState<RequestedExams[] | []>([])
    const userId = Cookies.get("studentID")


    const fetchExams = async () => {
        try {
            const { data, error } = await supabase.from('approved-exams').select("*")
            if (error) throw error
            const approvedExams = data.filter(item => item.student_id == userId && item.locked && item.title!="Placement Test")
            setExams(approvedExams)
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchExams()
    }, [])

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-[#84A3F9]/10 to-white p-8 py-20">
            {
                exams.length > 0 ? (
                    <div className="max-w-7xl mx-auto grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-3">
                        {
                            exams.map(exam => (
                                <ApprovedExam exam={exam} />
                            ))
                        }
                    </div>
                ) :
                    (
                        <div className="flex flex-col items-center justify-center h-full text-center mt-10">
                        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
                          No Approved Exams Available
                        </h1>
                        <p className="text-lg text-gray-500 max-w-md">
                          It looks like there are no approved exams at the moment. Check back later!
                        </p>
                      </div>
                    )
            }

        </div>
    )
}

export default ApprovedExams