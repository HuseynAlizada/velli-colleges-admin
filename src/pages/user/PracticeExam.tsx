
import { useEffect, useState } from "react"
import ExamCard from "../../components/user/ExamCard"
import { supabase } from "../../utils/supabase-client"
import { Exam } from "../../types"
import PracticeExamCard from "../../components/user/PracticeExamCard"

// title, file_url, pass_score, duration, level


export default function PracticeExam() {
  const [exams, setExams] = useState<Exam[] | []>([])
  const fetchExams = async () => {
    try {
      const { data, error } = await supabase.from('practice_exam').select("*")
      if (error) throw error
      setExams(data)
      console.log(data, 'data')
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
      <div className="w-full mx-auto grid lg:grid-cols-4 sm:grid-cols-2  gap-3">
        {exams.map((exam) => (
          <PracticeExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </div>
  )
}

