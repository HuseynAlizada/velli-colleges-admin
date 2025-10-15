
import { useEffect, useState } from "react"
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LevelModal from "../../components/admin/LevelModal";
import { supabase } from "../../utils/supabase-client";
import { levels } from "../../types";
import { ToastContainer, toast } from 'react-toastify';







export default function Levels() {
  const [levels, setLevels] = useState<levels[] | null>(null)
  const [popUp, setPopUp] = useState(false)
  const [editLevelData, setEditLevelData] = useState<levels | null>(null)

  const getLevels = async () => {
    try {
      const { data, error } = await supabase.from('levels').select('*')
      if (error) {
        console.log('fetch error:', error);
      }
      setLevels(data)
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getLevels()
  }, [])


  const handleEdit = (id: number) => {
    const levelToEdit = levels?.find(item => item.id == id)
    if (levelToEdit) {
      setEditLevelData(levelToEdit)
      openPopUp()

    }
  }

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from('levels').delete().eq('id', id)
      if (error) {
        console.log('Delete error', error);
      }
      setLevels(levels && levels.filter((level) => level.id !== id))
      toast.success("Level Deleted!");
    }
    catch (err) {
      console.log(err);
    }
  }

  const openPopUp = () => {
    setPopUp(true)
  }

  const closePopUp = () => {
    setEditLevelData(null)
    setPopUp(false)
  }


  return (
    <div className="p-6 w-full ">
      <ToastContainer
        autoClose={3000} />

      {popUp && (
        <div style={{ backgroundColor: "rgba(196, 194, 194, 0.6)" }} className="absolute  w-full h-screen top-0 left-0 flex items-center justify-center">
          <LevelModal closePopUp={closePopUp} getLevels={getLevels} editLevelData={editLevelData} />
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Levels</h2>
        <button onClick={openPopUp} className="p-2 rounded-full cursor-pointer inset-0 bg-gradient-to-r from-rose-500 to-pink-600  text-white hover:bg-rose-600 transition-colors">
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
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          {
            (levels && levels.length > 0) && (
              <tbody className="bg-white divide-y divide-gray-200">
                {levels.map((level,index) => (
                  <tr key={level.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index+1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{level.name.toUpperCase()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{level.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(level.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 cursor-pointer transition-colors inline-flex items-center gap-1"
                        >
                          <EditIcon className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(level.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-rose-600 cursor-pointer transition-colors inline-flex items-center gap-1"
                        >
                          <DeleteIcon className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )
          }

        </table>


      </div>
      {
        levels?.length == 0 && (
          <h1 className="text-center text-4xl mt-4">There is no level.</h1>
        )
      }
    </div>
  )
}

