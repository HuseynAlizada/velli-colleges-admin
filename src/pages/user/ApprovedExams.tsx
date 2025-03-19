
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
            const approvedExams = data.filter(item => item.student_id == userId && item.locked)
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
                        <h1 className="text-center text-3xl mt-4 w-full">There is no have any approved exam</h1>
                    )
            }

        </div>
    )
}

export default ApprovedExams