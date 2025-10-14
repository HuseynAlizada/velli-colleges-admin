import { RequestedExams, StudentData } from "../../types";
import {
  Clock,
  Calendar,
  GraduationCap,
  Target,
  PlayCircle,
} from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { supabase } from "../../utils/supabase-client";

const SATPlacementTest = ({ exam }: { exam: RequestedExams }) => {
  const [sendRequest, setSendRequest] = useState(false);
  const [approvedExams, setApprovedExams] = useState<[number, string][] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<StudentData | null>(null);

  console.log(exam, "exam");

  const userId = Cookies.get("studentID");

  // console.log(exam, 'exam')

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
    const fetchApprovedExams = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("approved-exams")
          .select("*");
        if (error) throw error;
        const titles = data.map(
          (item) => [item.student_id, item.title] as [number, string]
        );
        setApprovedExams(titles);
      } catch (err) {
        console.error("Error fetching approved exams:", err);
        setError("Failed to load exam data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchApprovedExams();
  }, []);

  const handleRequestUnlock = async () => {
    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    setIsRequestLoading(true);
    try {
      const { error } = await supabase.from("approved-exams").insert({
        student_id: Number(userId),
        title: exam.title,
        level: null,
        duration: exam.duration,
        pass_score: exam.pass_score,
        created_at: exam.created_at,
        file_url: exam.file_url,
        locked: false,
        branch: userData?.branch,
      });

      if (error) throw error;
      // console.log("Exam request submitted successfully!");
      setSendRequest(true);
      setApprovedExams((prev) => [
        ...(prev || []),
        [Number(userId), "Placement Test"],
      ]);

      // console.log(userId,exam.title, 'test data' )
    } catch (err) {
      console.error("Error submitting exam request:", err);
      setError("Failed to request unlock. Please try again.");
    } finally {
      setIsRequestLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6 border border-gray-200 flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6 border border-gray-200 flex items-center justify-center min-h-[300px]">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  // const isExamApproved = approvedExams && approvedExams.some(item => item[0] === Number(userId) && item[1] === "Placement Test");

  // If the exam is not approved, show the test card
  return (
    <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
            SAT Placement Exam {exam.exam_type}
          </span>
          <h3 className="text-lg font-semibold text-gray-800">{exam.title}</h3>
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
          <p className="font-medium text-gray-900">{exam.duration} hr</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Target className="w-4 h-4" />
            <span className="text-sm">Pass Score</span>
          </div>
          <p className="font-medium text-gray-900">{exam.pass_score}%</p>
        </div>
      </div>

      {/* Start Exam Button */}
      <button
        onClick={handleRequestUnlock}
        disabled={sendRequest || isRequestLoading || exam.sended}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isRequestLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            <span>Requesting...</span>
          </div>
        ) : (
          <>
            <PlayCircle className="w-5 h-5" />
            {sendRequest ? "Request Sent" : "Request To Unlock"}
            {exam.sended && " (Request Sended)"}
          </>
        )}
      </button>

      {/* Created At */}
      <div className="mt-4 flex items-center gap-1.5 text-sm text-gray-500">
        <Calendar className="w-4 h-4" />
        <span>
          Created{" "}
          {exam.created_at
            ? format(new Date(exam.created_at), "MMM d, yyyy")
            : "Unknown date"}
        </span>
      </div>
    </div>
  );
};

export default SATPlacementTest;
