import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Camera, Loader2, Check, School, User, Mail, Phone, Users } from "lucide-react";
import Cookies from "js-cookie";
import { supabase } from "../../utils/supabase-client";
import { useNavigate } from "react-router-dom";

const levels = ["A1", "A2", "B1", "B1+", "B2", "C1"];

export default function StudentProfile() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        parentPhone: "",
        level: "B1",
        parentName: "",
        studentSchool: "",
        avatar: "",
        password: "",
        student_purpose: "",
    });
    const [avatar, setAvatar] = useState<string | null>(formData.avatar || null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const userId = Cookies.get("studentID");

    useEffect(() => {
        const getUserData = async () => {
            try {
                const { data, error } = await supabase
                    .from("students")
                    .select("*")
                    .eq("id", userId)
                    .single();
                if (error) throw error;
                setFormData({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    parentPhone: data.parent_phone,
                    level: data.level.toUpperCase(),
                    parentName: data.parent_name,
                    studentSchool: data.student_school,
                    student_purpose: data.student_purpose,
                    avatar: data.image_url,
                    password: data.password,
                });

                setAvatar(data.image_url);
            } catch (err) {
                console.log(err);
            }
        };

        getUserData();
    }, [userId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setIsDirty(true);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string); // Update local avatar preview
                setIsDirty(true);
            };
            reader.readAsDataURL(file);

            // Upload the image to Supabase storage
            try {
                const fileExt = file.name.split(".").pop();
                const fileName = `${userId}-${Date.now()}.${fileExt}`; // Unique file name
                const filePath = `avatars/${fileName}`; // Folder in Supabase storage

                const { error } = await supabase.storage
                    .from("student-images") // Replace with your Supabase storage bucket name
                    .upload(filePath, file, {
                        cacheControl: "3600",
                        upsert: true,
                    });

                if (error) throw error;

                // Get the public URL of the uploaded image
                const { data: publicUrlData } = supabase.storage
                    .from("student-images")
                    .getPublicUrl(filePath);

                const imageUrl = publicUrlData.publicUrl;

                // Update formData with the new image URL
                setFormData((prev) => ({
                    ...prev,
                    avatar: imageUrl,
                }));
                // console.log("Image uploaded successfully:", imageUrl);
            } catch (err) {
                console.error("Error uploading image:", err);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from("students")
                .update({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    parent_phone: formData.parentPhone,
                    level: formData.level,
                    parent_name: formData.parentName,
                    student_school: formData.studentSchool,
                    student_purpose: formData.student_purpose,
                    image_url: formData.avatar, // Update the image URL in the database
                    password: formData.password,
                })
                .eq("id", Number(userId));

            if (error) throw error;
            console.log("Profile updated successfully");
            setIsLoading(false);
            setIsDirty(false); // Reset dirty state after successful save
        } catch (err) {
            console.error("Error updating profile:", err);
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl mt-5 w-full mx-auto p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center gap-2">
                <User className="w-6 h-6 text-indigo-600" />
                Student Profile Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center space-y-4">
                        <motion.div
                            className="relative group cursor-pointer"
                            onClick={handleAvatarClick}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-indigo-50 to-white border-4 border-white shadow-xl">
                                {avatar ? (
                                    <img
                                        src={avatar || "/placeholder.svg"}
                                        alt="Profile"
                                        width={160}
                                        height={160}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
                                        <Camera className="w-8 h-8 text-indigo-400" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 rounded-full bg-indigo-600/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Upload className="w-8 h-8 text-white" />
                            </div>
                        </motion.div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <p className="text-sm text-gray-600">Upload Profile Photo</p>
                    </div>

                    {/* Main Form Fields */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            {/* Left Column */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Parent Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="parentPhone"
                                        value={formData.parentPhone}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Enter parent's phone number"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Right Column */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Level</label>
                                <select
                                    name="level"
                                    value={formData.level}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                >
                                    {levels.map((level) => (
                                        <option key={level} value={level} disabled>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Parent Name</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="parentName"
                                        value={formData.parentName}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Enter parent's name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">School</label>
                                <div className="relative">
                                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="studentSchool"
                                        value={formData.studentSchool}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Enter your school name"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/")}
                        className="px-6 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-2"
                    >
                        Cancel
                    </motion.button>

                    <motion.button
                        type="submit"
                        disabled={!isDirty || isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-6 py-2 rounded-lg text-white flex items-center gap-2 cursor-pointer
              ${isDirty && !isLoading ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"} transition-colors`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <div>
                                <Check className="w-4 h-4" />
                                Save changes
                            </div>
                        )}
                    </motion.button>
                </div>
            </form>
        </div>
    );
}