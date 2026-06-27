
import { useEffect, useState } from "react"
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { supabase } from '../../utils/supabase-client'
import { Exam } from "../../types";
import { Link, useNavigate } from "react-router-dom";


export default function ManagePlacementTest() {
    const [exams, setExams] = useState<Exam[] | []>([])
    const navigate = useNavigate()

    const fetchExamFiles = async () => {
        const { data, error } = await supabase.from("placement_test").select('*');

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
        navigate(`/admin/import-placement-test/${id}`)
    }

    const handleDelete = async (id: number) => {

       if(confirm('Are you sure?')){
           try {
            const { error } = await supabase.from('placement_test').delete().eq('id', id)
            if (error) throw error
            setExams(exams.filter((level) => level.id !== id))
        }
        catch (err) {
            console.log(err);
        }
       }
    }
    const openPopUp = () => {
        navigate('/admin/import-placement-test')
    }
    return (
        <div className="p-6 w-full ">

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Placement Test</h2>
                <button onClick={openPopUp} className="p-2 translate-x-[-80px] rounded-full bg-[#11184F] text-white hover:bg-[#487ACB] transition-colors">
                    <AddIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg border w-full border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#84A3F9]/10">
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

                            {/* <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Level
                            </th>
                            */}
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {exams && exams.map((exam, index) => (
                            <tr key={exam.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Placement Test</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exam.pass_score}</td>
                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.total_score}</td> */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.duration} hr</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.level}</td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(exam.id)}
                                            className="px-3 py-1 bg-[#84A3F9] text-white rounded-md hover:bg-[#487ACB] transition-colors inline-flex items-center gap-1"
                                        >
                                            <EditIcon className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exam.id)}
                                            className="px-3 py-1 bg-[#11184F] text-white rounded-md hover:bg-[#487ACB] transition-colors inline-flex items-center gap-1"
                                        >
                                            <DeleteIcon className="w-4 h-4" />
                                            Delete
                                        </button>
                                        <Link to={`/admin/placement-test-details/${exam.id}`}
                                            className="px-3 py-1 bg-[#487ACB] text-white rounded-md hover:bg-[#487ACB] transition-colors inline-flex items-center gap-1"
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

