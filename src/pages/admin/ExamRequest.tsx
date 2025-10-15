import { motion } from "framer-motion";
import { Clock, GraduationCap, Target, PlayCircle } from "lucide-react";
import { levelColors } from "../../data/studentMenu";
import { RequestedExams, StudentData } from "../../types";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase-client";

const ExamRequest = ({
  exam,
  onDataChange, // Add callback prop
}: {
  exam: RequestedExams | null;
  onDataChange: () => void; // Callback to notify parent of data change
}) => {
  const [approveExam, setApproveExam] = useState<boolean>(false);
  const [userData, setUserData] = useState<StudentData  | null>(null); // Define type for userData if possible

  const colors = levelColors[ exam?.level || 'C1'];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from("students")
          .select("*")
          .eq("id", exam?.student_id)
          .single();
        if (error) throw error;
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    if (exam?.student_id) {
      fetchUser();
    }
  }, [exam?.student_id]); // Only re-fetch user data if student_id changes

  const ApproveExam = async () => {
    try {
      const {  error } = await supabase
        .from("approved-exams")
        .update({
          student_id: exam?.student_id,
          title: exam?.title,
          level: exam?.level,
          duration: exam?.duration,
          pass_score: exam?.pass_score,
          created_at: exam?.created_at,
          file_url: exam?.file_url,
          locked: true,
        })
        .eq("id", exam?.id);

      if (error) throw error;

      // Notify parent to re-fetch data
      onDataChange();

      // Update local state to disable button
      setApproveExam(true);
    } catch (error) {
      console.error("Error approving exam:", error);
    }
  };

  return (
    <>
      {exam && !exam.locked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`relative w-full max-w-sm bg-gradient-to-b ${colors?.bg} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border ${colors.border}`}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1.5">
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-medium ${colors.badge}`}>
                Level: {exam.level}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{exam.title}</h3>
            </div>
            <motion.div whileHover={{ rotate: 15, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
              <GraduationCap className={`w-6 h-6 ${colors.icon}`} />
            </motion.div>
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

          <motion.button
            onClick={ApproveExam}
            whileHover={{ scale: 1.02 }}
            disabled={approveExam} // Disable button after approval
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center gap-1 px-4 py-3 rounded-xl text-white font-medium ${colors.button} shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 mb-6`}
          >
            <PlayCircle className="w-5 h-5" />
            Unlock the exam
          </motion.button>

          {/* Active Users Stats */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <p>
                <span className="font-medium text-gray-900">Student Name:</span> {userData?.name || "Loading..."}
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <p>
                <span className="font-medium text-gray-900">Student Level:</span>{" "}
                {userData?.level?.toUpperCase() || "Loading..."}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ExamRequest;