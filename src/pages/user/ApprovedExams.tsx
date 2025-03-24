
// import { useEffect, useState } from "react"
// import ExamCard from "../../components/user/ExamCard"
// import { supabase } from "../../utils/supabase-client"
// import { Exam } from "../../types"

// // title, file_url, pass_score, duration, level


// export default function ExamList() {
//     const [exams, setExams] = useState<Exam[] | []>([])
//     const fetchExams = async () => {
//         try {
//             const { data, error } = await supabase.from('exams').select("*")
//             if (error) throw error
//             console.log(data);
//             setExams(data)

//         }
//         catch (err) {
//             console.log(err);
//         }
//     }

//     useEffect(() => {
//         fetchExams()
//     }, [])




//     return (
//         <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white p-8 py-20">
//             <div className="max-w-7xl mx-auto grid grid-cols-4 gap-3">
//                 {/* {exams.map((exam) => (
//                     <ExamCard key={exam.id} exam={exam} />
//                 ))} */}

//                 {exams.map((exam) => (
//                     <ExamCard key={exam.id} exam={exam} />
//                 ))}

//                 {/* {exams.map((exam) => (
//                     <ExamCard key={exam.id} exam={exam} />
//                 ))}

//                 {exams.map((exam) => (
//                     <ExamCard key={exam.id} exam={exam} />
//                 ))} */}
//             </div>
//         </div>
//     )
// }


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
            // console.log(approvedExams)
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchExams()
    }, [])

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-amber-50/50 to-white p-8 py-20">
            {
                exams.length > 0 ? (
                    <div className="max-w-7xl mx-auto grid grid-cols-4 gap-3">
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