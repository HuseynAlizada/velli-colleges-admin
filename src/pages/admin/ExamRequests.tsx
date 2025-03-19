import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase-client";
import { RequestedExams } from "../../types";
import ExamRequest from "./ExamRequest";

const ExamRequests = () => {
  const [requestedExams, setRequestedExams] = useState<RequestedExams[] | null>(null);

  // Function to fetch data, which can be called whenever needed
  const fetchRequestExams = async () => {
    try {
      const { data, error } = await supabase
        .from("approved-exams")
        .select("*");
      if (error) throw error;
      setRequestedExams(data);
      console.log(data, 'data')
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchRequestExams();
  }, []);

  // Callback to pass to child to trigger data re-fetch
  const handleDataChange = () => {
    fetchRequestExams(); // Re-fetch data after a change
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white p-8 py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-3">
        {
          requestedExams && requestedExams?.length > 0 ? (
            requestedExams?.map((exam) => (
              <ExamRequest
                key={exam.id}
                exam={exam}
                onDataChange={handleDataChange} // Pass callback to child
              />
            ))
          ) : (
            <h1>There is no have any exam request</h1>
          )
        }
      </div>
    </div>
  );
};

export default ExamRequests;