
import { useEffect, useState } from "react"
import ExamCard from "../../components/user/ExamCard"
import { supabase } from "../../utils/supabase-client"
import { Exam } from "../../types"

// title, file_url, pass_score, duration, level


export default function PracticeExam() {
  const [exams, setExams] = useState<Exam[] | []>([])
  const fetchExams = async () => {
    try {
      const { data, error } = await supabase.from('exams').select("*")
      if (error) throw error
      const exams = data.filter(item => item.exam_type == 'Practical Exam')
      setExams(exams)
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchExams()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white p-8 py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-3">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} practical={true} />
        ))}
      </div>
    </div>
  )
}

