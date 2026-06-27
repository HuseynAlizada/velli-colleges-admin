import { useEffect, useState } from "react"
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from "../../utils/supabase-client";
import { toast, ToastContainer } from "react-toastify";
import { levelModal } from "../../types";

export default function LevelModal({ closePopUp, getLevels, editLevelData }: levelModal) {
  const [formData, setFormData] = useState({
    name: editLevelData?.name || "a1",
    description: editLevelData?.description || "",
  });

  useEffect(() => {
    if (editLevelData) {
      setFormData({
        name: editLevelData.name,
        description: editLevelData.description,
      });
    }
  }, [editLevelData]);

  const handleSubmit = async (e: React.FormEvent) => {


    e.preventDefault();
    const action = editLevelData ? "update" : "insert";
    const operation = editLevelData
      ? supabase.from("levels").update({ name: formData.name, description: formData.description }).eq("id", editLevelData.id)
      : supabase.from("levels").insert([{ name: formData.name, description: formData.description }]);

    try {
      const { error } = await operation;
      if (error) throw error;
      toast.success(`Level ${action === "update" ? "Updated" : "Added"}!`);
      closePopUp();
      getLevels();
      setFormData({ name: "", description: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg w-full max-w-md mx-4">
      <ToastContainer autoClose={3000} />
      <div className="flex items-center justify-between inset-0 bg-gradient-to-r from-[#11184F] to-[#487ACB]  text-white px-6 py-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">Levels</h2>
        <button className="text-white hover:text-gray-200 transition-colors" onClick={closePopUp}>
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>
      <form className="p-6 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Level Name</label>
          <select
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#487ACB] focus:border-transparent"
          >
            {["a1", "a2", "b1", "b1+", "b2", "c1"].map((level) => (
              <option key={level} value={level}>{level.toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <input
            id="description"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#487ACB] focus:border-transparent"
            placeholder="Description"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 inset-0 bg-gradient-to-r from-[#11184F] to-[#487ACB]  text-white rounded-md hover:bg-[#487ACB] transition-colors focus:outline-none focus:ring-2 focus:ring-[#487ACB] focus:ring-offset-2"
          >
            {editLevelData ? "Edit Level" : "Add Level"}
          </button>
        </div>
      </form>
    </div>
  );
}
