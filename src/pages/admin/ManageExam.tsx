
import { useEffect, useState } from "react"
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { supabase } from '../../utils/supabase-client'
import { Exam } from "../../types";
import { Link, useNavigate } from "react-router-dom";


export default function ManageExam() {
    const [exams, setExams] = useState<Exam[] | []>([])
    const navigate = useNavigate()

    const fetchExamFiles = async () => {
        const { data, error } = await supabase.from("exams").select('*');

        if (error) {
            console.error("Error fetching files:", error);
            return;
        }

        setExams(data)
    };

    useEffect(() => {
        fetchExamFiles()
    }, [])

    const handleEdit = (id: number) => {
        navigate(`/admin/import-exam/${id}`)
    }

    const handleDelete = async (id: number) => {
        if(confirm('Are you sure?')){
            try {
                const { error } = await supabase.from('exams').delete().eq('id', id)
                if (error) throw error
                setExams(exams.filter((level) => level.id !== id))
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    const openPopUp = () => {
        navigate('/admin/import-exam')
    }
    return (
        <div className="p-6 w-full ">

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Exams</h2>
                <button onClick={openPopUp} className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors">
                    <AddIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-purple-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                #
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Pass Score
                            </th>
                            {/* <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Total Score
                            </th> */}
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Duration
                            </th>
                         
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Level
                            </th>
                           
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {exams && exams.map((exam, index) => (
                            <tr key={exam.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exam.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exam.pass_score.toFixed(2)}</td>
                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.total_score}</td> */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.duration} hr</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.level}</td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(exam.id)}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-rose-600 transition-colors inline-flex items-center gap-1"
                                        >
                                            <EditIcon className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exam.id)}
                                            className="px-3 py-1 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors inline-flex items-center gap-1"
                                        >
                                            <DeleteIcon className="w-4 h-4" />
                                            Delete
                                        </button>
                                        <Link to={`/admin/exam-details/${exam.id}`}
                                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-rose-600 transition-colors inline-flex items-center gap-1"
                                        >
                                            <RemoveRedEyeIcon className="w-4 h-4" />
                                            View Questions
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

