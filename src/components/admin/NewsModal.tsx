import type React from "react";
import { useState, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { supabase } from "../../utils/supabase-client"; // Import Supabase client
import { toast, ToastContainer } from "react-toastify";

export default function NewsModal({ closePopUp,fetchNews }: { closePopUp: () => void ,fetchNews:()=>void}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
    link: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = null;

    if (formData.image) {
      const { data, error: uploadError } = await supabase.storage
        .from("news-images")
        .upload(`news-${Date.now()}-${formData.image.name}`, formData.image);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        alert("Image upload failed!");
        setLoading(false);
        return;
      }

      imageUrl = supabase.storage.from("news-images").getPublicUrl(data.path).data.publicUrl;
      toast.success(`News"Added!`);
      fetchNews()

    }
    

    const { error: dbError } = await supabase.from("news").insert([
      {
        title: formData.title,
        description: formData.description,
        image_url: imageUrl, // ✅ Now this is a string, not an object
        link: formData.link || null,
      },
    ]);

    if (dbError) {
      console.error("Error inserting into DB:", dbError);
      setLoading(false);
      return;
    }

    // Reset form after successful upload
    setFormData({
      title: "",
      description: "",
      image: null,
      link: "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setLoading(false);
    closePopUp();
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  return (
    <div className="bg-white rounded-lg w-full max-w-md mx-4">
      <ToastContainer autoClose={3000} />

      {/* Header */}
      <div className="flex items-center justify-between inset-0 bg-gradient-to-r from-rose-500 to-pink-600  text-white px-6 py-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">Articles & News</h2>
        <button onClick={closePopUp} className="text-white hover:text-gray-200 transition-colors">
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="Enter Title"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent min-h-[100px]"
            placeholder="Enter Description"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            id="image"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="link" className="block text-sm font-medium text-gray-700">
            Link
          </label>
          <input
            type="url"
            id="link"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="Enter Link (optional)"
          />
        </div>

        <div className="flex justify-start">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 inset-0 bg-gradient-to-r from-rose-500 to-pink-600  text-white rounded-md hover:bg-rose-600 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
