import { useEffect, useState } from "react"
import { supabase } from "../../utils/supabase-client"
import { RequestedExams } from "../../types"

import ExamRequest from "./ExamRequest"

const ExamRequests = () => {
  const [requestedExams, setRequestedExams] = useState<RequestedExams[] | null>(null)
  const [fetcData, setFetchData]=useState('')

  useEffect(() => {

    const fetchRequestExams = async () => {
      const { data, error } = await supabase
        .from("approved-exams")
        .select("*")
      if (error) throw Error
      setRequestedExams(data)
    }

    fetchRequestExams()

  }, [fetcData])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white p-8 py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-3">
        {requestedExams?.map((exam) => (
          <ExamRequest key={exam.id} exam={exam} setRequestedExams={setRequestedExams} setFetchData={setFetchData}/>
        ))}
      </div>
    </div>
  )
}

export default ExamRequests