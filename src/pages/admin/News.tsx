import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import NewsModal from "../../components/admin/NewsModal";
import { supabase } from "../../utils/supabase-client";
import { news } from "../../types";
import { toast, ToastContainer } from "react-toastify";

export default function News() {
  const [news, setNews] = useState<news[] | []>([]);
  const [popUp, setPopUp] = useState(false);
  const fetchNews = async () => {
    const { data, error } = await supabase.from("news").select("*");
    if (error) {
      console.log("error");
    } else setNews(data);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      try {
        const { error } = await supabase.from("news").delete().eq("id", id);
        if (error) {
          console.log("deleted error", error);
        }
        setNews(news.filter((level) => level.id !== id));
        toast.success("Level Deleted!");
      } catch (err) {
        console.log(err);
        // toast.error("Delete error", err.message);
      }
    }
  };

  const openPopUp = () => {
    setPopUp(true);
  };

  const closePopUp = () => {
    setPopUp(false);
  };

  return (
    <div className="p-6 w-full ">
      <ToastContainer autoClose={3000} closeOnClick={true} />
      {popUp && (
        <div
          style={{ backgroundColor: "rgba(196, 194, 194, 0.6)" }}
          className="fixed  w-full h-screen top-0 left-0 flex items-center justify-center"
        >
          <NewsModal fetchNews={fetchNews} closePopUp={closePopUp} />
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">News</h2>
        <button
          onClick={openPopUp}
          className="p-2 rounded-full translate-x-[-80px] bg-rose-500 text-white hover:bg-rose-600 transition-colors"
        >
          <AddIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-purple-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                #
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Link
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Image
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {news.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4  text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4  text-sm text-gray-900">
                  {item.title}
                </td>
                <td className="px-6 py-4  text-sm text-gray-500">
                  {item.description}
                </td>
                <td className="px-6 py-4  text-sm text-gray-500">
                  {item.link}
                </td>
                <td className="px-6 py-4  text-sm text-gray-500">
                  <img
                    className="w-[60px] h-[60px] object-cover"
                    src={item.image_url}
                    alt=""
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors inline-flex items-center gap-1"
                    >
                      <DeleteIcon className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
