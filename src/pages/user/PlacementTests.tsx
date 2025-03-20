
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

import { useEffect, useState } from "react";
import { RequestedExams } from "../../types";
import { supabase } from "../../utils/supabase-client";
import Cookies from "js-cookie";
import PlacementTest from "./PlacementTest";

const PlacementTests = () => {
  const [exams, setExams] = useState<RequestedExams[] | []>([]);
  const userId = Cookies.get("studentID");

  const fetchExams = async () => {
    try {
      const { data, error } = await supabase.from('placement_test').select("*");
      if (error) throw error;
      console.log(data, 'data')
      setExams(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-amber-50/50 to-white p-8 py-20">
      {exams.length > 0 ? (
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
          {exams.map(exam => (
            <PlacementTest key={exam.id} exam={exam} />
          ))}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center h-[60vh]">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg 
              className="w-16 h-16 mx-auto mb-4 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              No Placement Tests Available
            </h1>
            <p className="text-gray-600 max-w-md">
              It looks like there are no placement tests assigned to you at the moment. Please check back later or contact your instructor.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementTests;