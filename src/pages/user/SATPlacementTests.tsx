import { useEffect, useState } from "react";
import { RequestedExams, StudentData } from "../../types";
import { supabase } from "../../utils/supabase-client";
import Cookies from "js-cookie";
import {
  Calendar,
  Clock,
  GraduationCap,
  PlayCircle,
  Target,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import SATPlacementTest from "./SATPlacementTest";

const SATPlacementTests = () => {
  const [exams, setExams] = useState<RequestedExams[]>([]);
  const [approvedData, setApprovedData] = useState<RequestedExams[]>([]);
  const userId = Cookies.get("studentID");
  const [userData, setUserData] = useState<StudentData | null>(null);

  useEffect(() => {
    const fetchApprovedTest = async () => {
      try {
        const { data, error } = await supabase
          .from("approved-exams")
          .select("*")
          .eq("student_id", userId); // Filter by student_id
        if (error) throw error;
        // console.log(data, 'data approved');
        const filteredData = data.filter(
          (item) => item.title === userData?.level 
        );
        setApprovedData(filteredData);
        // console.log(filteredData.length, 'approved');
      } catch (err: unknown) {
        console.log(err);
      }
    };

    if (userData?.level) {
      fetchApprovedTest();
    }
  }, [userData]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from("students")
          .select("*")
          .eq("id", userId)
          .single();
        if (error) throw error;
        setUserData(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [userId]);

useEffect(() => {
  const fetchExams = async () => {
    try {
      const { data, error } = await supabase.from("sat_exams").select("*");
      if (error) throw error;

      const filteredData = data.filter(
        (item) => item.title === userData?.level
      );

      // ✅ Mark exams that exist in approvedData
      const updatedExams = filteredData.map((exam) => {
        const isApproved = approvedData.some(
          (approved) => approved.file_url === exam.file_url && approved.title === exam.title
        );
        return { ...exam, sended: isApproved };
      });


      setExams(updatedExams);
    } catch (err) {
      console.log(err);
    }
  };

  if (userData?.level) {
    fetchExams();
  }
}, [userData, approvedData]);


  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-amber-50/50 to-white p-8 py-20">
      
      
      <div>
        {exams.length > 0 && (
          <div className="max-w-7xl mx-auto grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
            {exams.map((exam) => (
              <SATPlacementTest key={exam.id} exam={exam} />
            ))}
          </div>
        )}

     {/* <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6 border border-gray-200 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">No Placement Tests Available</h3>
          <p className="text-gray-600 mt-2">You have already requested or completed this placement test.</p>
        </div>
      </div> */}
        <h1 className="text-2xl text-center py-5">Approved Placement Test</h1>

        {approvedData.length > 0 ? (
          <div className="max-w-7xl mx-auto grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
           {approvedData
  .filter((approvedExam) => approvedExam.locked === true)
  .map((approvedExam) => (
    <div
      key={approvedExam.id}
      className="w-full max-w-sm bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
            SAT Placement Test - {approvedExam.level?.toLocaleUpperCase()}
          </span>
          <h3 className="text-lg font-semibold text-gray-800">
            {approvedExam.title}
          </h3>
        </div>
        <GraduationCap className="w-6 h-6 text-gray-500" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Duration</span>
          </div>
          <p className="font-medium text-gray-900">
            {approvedExam.duration} hr
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Target className="w-4 h-4" />
            <span className="text-sm">Pass Score</span>
          </div>
          <p className="font-medium text-gray-900">
            {approvedExam.pass_score}%
          </p>
        </div>
      </div>

      <Link to={`/sat-placement-tests/${approvedExam.id}`}>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
          <PlayCircle className="w-5 h-5" />
          Start Placement Test
        </button>
      </Link>

      <div className="mt-4 flex items-center gap-1.5 text-sm text-gray-500">
        <Calendar className="w-4 h-4" />
        <span>
          Created{" "}
          {approvedExam.created_at
            ? format(new Date(approvedExam.created_at), "MMM d, yyyy")
            : "Unknown date"}
        </span>
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
                It looks like there are no placement tests assigned to you at
                the moment. Please check back later or contact your instructor.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SATPlacementTests;
