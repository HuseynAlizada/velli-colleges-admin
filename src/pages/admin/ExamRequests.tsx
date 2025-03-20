import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase-client";
import { RequestedExams } from "../../types";
import ExamRequest from "./ExamRequest";

const ExamRequests = () => {
  const [requestedExams, setRequestedExams] = useState<RequestedExams[] | null>(null);

  const fetchRequestExams = async () => {
    try {
      const { data, error } = await supabase.from("approved-exams").select("*");
      if (error) throw error;
      setRequestedExams(data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  useEffect(() => {
    fetchRequestExams();
  }, []);

  const handleDataChange = () => {
    fetchRequestExams();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white p-8 py-20 flex flex-col items-center">
      {requestedExams && requestedExams.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-3">
          {requestedExams.map((exam) => (
            <ExamRequest key={exam.id} exam={exam} onDataChange={handleDataChange} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-700">
          <h1 className="text-2xl font-semibold">No Exam Requests Available</h1>
          <p className="text-gray-500">Check back later for updates.</p>
        </div>
      )}
    </div>
  );
};

export default ExamRequests;
