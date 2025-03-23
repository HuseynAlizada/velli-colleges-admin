
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
import { Calendar, Clock, GraduationCap, PlayCircle, Target } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const PlacementTests = () => {
  const [exams, setExams] = useState<RequestedExams[] | []>([]);
  const [approvedData, setApprovedData] = useState<RequestedExams[] | []>([])
  const userId = Cookies.get("studentID");


  useEffect(() => {

    const fetchApprovedTest = async () => {
      try {
        const { data, error } = await supabase
          .from("approved-exams")
          .select("*", userId)
        if (error) throw error
        console.log(data, 'data approved  ')
        const filteredData = data.filter(item => item.title == 'Placement Test' && item.locked == true)
        setApprovedData(filteredData)
        console.log(filteredData.length, 'approved')
      }
      catch (err) {
        console.log(err)
      }
    }

    fetchApprovedTest()

  }, [userId])

  const fetchExams = async () => {
    try {
      const { data, error } = await supabase.from('placement_test').select("*");
      if (error) throw error;
      console.log(data[0], 'dataawdawdaddd')
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



      <h1 className=" text-2xl text-center py-5">Approved Placement Test</h1>

      {approvedData && approvedData.length > 0 ? (
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
          {approvedData && approvedData.map(approvedExam => (
            <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                    Placement Exam
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800">{approvedExam.title}</h3>
                </div>
                <GraduationCap className="w-6 h-6 text-gray-500" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <p className="font-medium text-gray-900">{approvedExam.duration} hr</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">Pass Score</span>
                  </div>
                  <p className="font-medium text-gray-900">{approvedExam.pass_score}%</p>
                </div>
              </div>
              {/* Start Exam Button */}
              <Link to={`/placement-tests/${approvedExam.id}`}>
                <button

                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  <PlayCircle className="w-5 h-5" />
                  Start to Exam
                </button>
              </Link>
              {/* Created At */}
              <div className="mt-4 flex items-center gap-1.5 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Created {approvedExam.created_at? format(new Date(approvedExam.created_at), "MMM d, yyyy") : "Unknown date"}</span>
              </div>
            </div>
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