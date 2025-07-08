import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase-client";
import { Exam, StudentData } from "../../types";
import PracticeExamCard from "../../components/user/PracticeExamCard";
import Cookies from 'js-cookie';

export default function PracticeExam() {
  const [exams, setExams] = useState<Exam[] | []>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Listening'); // default option
  const userId = Cookies.get('studentID');
  const [userData, setUserData] = useState<StudentData | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.from('students')
          .select('*')
          .eq('id', userId)
          .single();
        if (error) throw error;
        setUserData(data);
      }
      catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [userId]);

  const fetchExams = async () => {
    try {
      const { data, error } = await supabase.from('practice_exam').select("*");
      if (error) throw error;
      const filteredData = data.filter(item => item.level == userData?.level.toUpperCase());
      setExams(filteredData);
    }
    catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchExams();
    }
  }, [userData]);

  // Filter exams based on selectedCategory
  const filteredExams = exams.filter(exam => exam.title.toLowerCase() === selectedCategory.toLowerCase());

  const categories = ['Listening', 'Reading', 'Grammar'];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-amber-50/50 to-white p-8 py-20">
      <div className="flex  mb-8 space-x-4">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-[10px] border ${selectedCategory === category ? 'bg-blue-700 text-white' : 'bg-white text-gray-700'} shadow-sm hover:bg-blue-700 hover:text-white hover:border-1 hover:border-blue-700 transition`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredExams.length > 0 ? (
        <div className="w-full mx-auto grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-3">
          {filteredExams.map((exam, index) => (
            <PracticeExamCard key={exam.id} exam={exam} index={index} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center mt-10">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            No {selectedCategory} Exams Available
          </h1>
          <p className="text-lg text-gray-500 max-w-md">
            It seems there are no {selectedCategory.toLowerCase()} practice exams for your level yet. Please check back later!
          </p>
        </div>
      )}
    </div>
  );
}
