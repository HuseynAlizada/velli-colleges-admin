import {
  Clock,
  Calendar,
  GraduationCap,
  Target,
  PlayCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Exam, StudentData } from "../../types";
import { levelColors } from "../../data/studentMenu";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase-client";
import Cookies from "js-cookie";

export default function ExamCard({ exam }: { exam: Exam }) {
  const colors = levelColors[exam.level || "C1"];
  const userId = Cookies.get("studentID");
  const [userData, setUserData] = useState<StudentData | null>(null);
  const [sendRequest, setSendRequest] = useState(false);
  const [approvedExams, setApprovedExams] = useState<[number, string][] | null>(
    null,
  );
  const [data, setData] = useState<string | null>(null);

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
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from("approved-exams")
          .select("*");
        if (error) throw error;
        const titles = data.map(
          (item) => [item.student_id, item.title] as [number, string],
        );
        setApprovedExams(titles);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [data]);

  const handleRequestUnlock = async () => {
    if (!userId) {
      console.error("User ID not found.");
      return;
    }
    setSendRequest(true);

    try {
      const { error } = await supabase.from("approved-exams").insert({
        student_id: userId,
        title: exam.title,
        level: exam.level,
        duration: exam.duration,
        pass_score: exam.pass_score,
        created_at: exam.created_at,
        file_url: exam.file_url,
        locked: false,
        branch: userData?.branch,
        student_name: userData?.name,
      });

      if (error) throw error;
      setData("salam");
    } catch (err) {
      console.error("Error submitting exam request:", err);
    }
  };

  return (
    <>
      {(!approvedExams ||
        !approvedExams.some(
          (item) => item[0] === userData?.id && item[1] === exam.title,
        )) && (
        <div
          className={`relative w-full max-w-sm bg-gradient-to-b ${colors.bg} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border ${colors.border}`}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1.5">
              <div
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-medium ${colors.badge}`}
              >
                Level: {exam.level}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {exam.title}
              </h3>
            </div>
            <div>
              <GraduationCap className={`w-6 h-6 ${colors.icon}`} />
            </div>
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

          <button
            onClick={handleRequestUnlock}
            disabled={
              sendRequest ||
              approvedExams?.some(
                (item) => item[0] === userData?.id && item[1] === exam.title,
              )
            }
            className={`w-full flex items-center justify-center gap-1 px-4 py-3 rounded-xl text-white font-medium ${colors.button} shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 mb-6 disabled:opacity-50`}
          >
            <PlayCircle className="w-5 h-5" />
            {sendRequest ? "Request Sent" : "Request To Unlock"}
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

          {/* Decorative Elements */}
          <div
            className={`absolute top-0 right-0 -mt-4 mr-4 w-24 h-24 bg-opacity-5 rounded-full blur-xl ${colors.text}`}
          />
          <div
            className={`absolute bottom-0 left-0 -mb-4 ml-4 w-24 h-24 bg-opacity-5 rounded-full blur-xl ${colors.text}`}
          />
        </div>
      )}
    </>
  );
}
