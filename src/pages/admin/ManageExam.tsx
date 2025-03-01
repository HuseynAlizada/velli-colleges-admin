
import { useEffect, useState } from "react"
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ExamModal from "../../components/admin/ExamModal";
import { supabase } from '../../utils/supabase-client'

// const initialExams = [
//     { id: 1, name: "A1", description: "General English" },
//     { id: 2, name: "B1", description: "General english" },
//     { id: 3, name: "B2", description: "General English" },
//     { id: 4, name: "B1+", description: "General English" },
//     { id: 5, name: "A2", description: "General English" },
//     { id: 6, name: "Placement", description: "Gen Eng" },
// ]

export default function ManageExam() {
    const [exams, setExams] = useState([])
    const [popUp, setPopUp] = useState(false)


    const fetchExamFiles = async () => {
        const { data, error } = await supabase.storage.from("uploads").list("exams");

        if (error) {
            console.error("Error fetching files:", error);
            return;
        }

        setExams(data.map(item => {
            return { ...item, name: item.name.split('-')[1].split('.')[0] }
        }))

        console.log("Exam Files:", data[0].name.split('-')[1].split('.')[0]);

    };


    useEffect(() => {
        fetchExamFiles()
    }, [])



    const handleEdit = (id: number) => {
        console.log("Edit level:", id)
    }

    const handleDelete = (id: number) => {
        setExams(exams.filter((level) => level.id !== id))
    }

    const openPopUp = () => {
        setPopUp(true)
    }


    const closePopUp = () => {

        setPopUp(false)
    }


    return (
        <div className="p-6 w-full ">
            {popUp && (
                <div style={{ backgroundColor: "rgba(196, 194, 194, 0.6)" }} className="absolute  w-full h-screen top-0 left-0 flex items-center justify-center">
                    <ExamModal closePopUp={closePopUp} />
                </div>
            )}
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
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Total Score
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Duration
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Re Take
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
                        {exams && exams.map((level, index) => (
                            <tr key={level.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{level.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">30</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">100</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 hr</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">B1</td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(level.id)}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-rose-600 transition-colors inline-flex items-center gap-1"
                                        >
                                            <EditIcon className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(level.id)}
                                            className="px-3 py-1 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors inline-flex items-center gap-1"
                                        >
                                            <DeleteIcon className="w-4 h-4" />
                                            Delete
                                        </button>

                                        <button
                                            onClick={() => handleDelete(level.id)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-rose-600 transition-colors inline-flex items-center gap-1"
                                        >
                                            <RemoveRedEyeIcon className="w-4 h-4" />
                                            View Questions
                                        </button>
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

