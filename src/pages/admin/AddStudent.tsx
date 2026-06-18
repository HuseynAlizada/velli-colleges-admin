import type React from "react";
import { useEffect, useState } from "react";
import { PhoneInput } from "../../components/admin/PhoneInput";
import { PasswordInput } from "../../components/admin/PasswordInput";
import { supabase } from "../../utils/supabase-client";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const levels = [
  { id: "a1", name: "A1" },
  { id: "a2", name: "A2" },
  { id: "b1", name: "B1" },
  { id: "b1+", name: "B1+" },
  { id: "b2", name: "B2" },
  { id: "c1", name: "C1" },


  // { id: "placement-test", name: "Placement Test" },
  // {id:"kids", name:"Kids" },
];

const placementTest = [{ id: true, name: "Placement Test" }];
const kidsTest = [{ id: "kids-test", name: "Kids" }];
const ieltsTofel = [
  { id: "ielts", name: "IELTS" },
  
  { id: "tofel", name: "TOFEL" },
];

const satLevels = [
  { id: "sat-placement-test-medium", name: "SAT Placement Test Medium" },
  { id: "sat-placement-test-hard", name: "SAT Placement Test Hard" },
];

const branches = [
  { id: "hazi-aslanov", name: "Hazi Aslanov" },
  { id: "inqilab", name: "Inqilab" },
  { id: "naxchivan", name: "Naxchivan" },
];

export default function AddStudent() {
  const { id } = useParams();
  const [edit] = useState<string | null>(id ? id : null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+994 ",
    parentPhone: "+994 ",
    level: "",
    password: "",
    parentName: "",
    image: null as File | null,
    imageUrl: "",
    studentSchool: "",
    studentPurpose: "",
    branch: "",
    sat_level: "",
    placement_test: false,
    stock: false,
  });

  const addStudentExamCounts = async (studentId: string) => {
    try {
      const { error } = await supabase.from("taken-exams").insert({
        student_id: studentId,
        exam_count: 0,
        practice_count: 0,
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error("Error adding exam counts:", err);
      toast.error("Failed to add exam counts for the student");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!edit) return;
      try {
        const { data, error } = await supabase
          .from("students")
          .select("*")
          .eq("id", edit)
          .single();

        if (error) {
          throw error;
        }

        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone.toString(),
          parentPhone: data.parent_phone || "",
          level: data.level || "",
          password: data.password || "",
          parentName: data.parent_name || "",
          image: null,
          imageUrl: data.image_url || "",
          studentSchool: data.student_school || "",
          studentPurpose: data.student_purpose || "",
          branch: data.branch || "",
          sat_level: data.sat_level || "",
          placement_test: data.placement_test || false,
          stock: data.stock || false,
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [edit]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const phoneRegex = /^\+994 \d{3} \d{3} \d{2} \d{2}$/;
    if (
      !phoneRegex.test(formData.phone) ||
      !phoneRegex.test(formData.parentPhone)
    ) {
      toast.error(
        "Please enter valid phone numbers in the format: +994 050 562 53 06"
      );
      setSubmitting(false);
      return;
    }

    const passwordRequirements = {
      uppercase: /[A-Z]/.test(formData.password),
      number: /[0-9]/.test(formData.password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
      minLength: formData.password.length >= 8,
    };

    if (!Object.values(passwordRequirements).every(Boolean)) {
      toast.error("Please ensure your password meets all requirements");
      setSubmitting(false);
      return;
    }

    if (!formData.studentSchool || !formData.studentPurpose) {
      toast.error(
        "Please fill in all required fields (Student School and Purpose)"
      );
      setSubmitting(false);
      return;
    }

    try {
      let imageUrl = formData.imageUrl;

      if (formData.image) {
        const fileName = `student-images/${Date.now()}-${formData.image.name}`;
        const { error: uploadError } = await supabase.storage
          .from("student-images")
          .upload(fileName, formData.image);

        if (uploadError) {
          throw new Error("Failed to upload image");
        }

        imageUrl = supabase.storage
          .from("student-images")
          .getPublicUrl(fileName).data.publicUrl;
      }

      const action = edit ? "update" : "insert";
      const operation = edit
        ? supabase
            .from("students")
            .update({
              name: formData.name,
              email: formData.email,
              level: formData.level,
              phone: formData.phone,
              parent_phone: formData.parentPhone,
              parent_name: formData.parentName,
              password: formData.password,
              image_url: imageUrl,
              student_school: formData.studentSchool,
              student_purpose: formData.studentPurpose,
              branch: formData.branch,
              placement_test: formData.placement_test,
              sat_level: formData.sat_level,
              stock: formData.stock,
            })
            .eq("id", edit)
        : supabase
            .from("students")
            .insert({
              name: formData.name,
              email: formData.email,
              level: formData.level,
              phone: formData.phone,
              parent_phone: formData.parentPhone,
              parent_name: formData.parentName,
              password: formData.password,
              image_url: imageUrl,
              student_school: formData.studentSchool,
              student_purpose: formData.studentPurpose,
              placement_test: formData.placement_test,
              branch: formData.branch,
              sat_level: formData.sat_level,
              stock: formData.stock,
            })
            .select();

      const { data, error } = await operation;

      if (error) throw error;

      if (!edit && data && data.length > 0) {
        const studentId = data[0].id;
        await addStudentExamCounts(studentId);
      }

      toast.success(`Student ${action === "update" ? "Updated" : "Added"}!`);
      if (formData.stock) navigate("/admin/stock-dashboard");
      else {
        navigate("/admin/dashboard");
      }

      setFormData({
        name: "",
        email: "",
        phone: "+994 ",
        parentPhone: "+994 ",
        level: "",
        password: "",
        parentName: "",
        image: null,
        imageUrl: "",
        studentSchool: "",
        studentPurpose: "",
        branch: "",
        sat_level: "",
        placement_test: false,
        stock: false,
      });
    } catch (err) {
      console.error("Error saving student data:", err);
      toast.error("Failed to save student data");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(
      (prev) =>
        ({
          ...prev,
          [name]: name === "placement_test" ? value === "true" : value,
        } as any)
    );
  };

  const handlePhoneChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  return (
    <div className="w-full mx-auto p-6">
      <ToastContainer autoClose={3000} />
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        {edit ? "Edit Student" : "Add New Student"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Enter Name"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Enter Email"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="studentPurpose"
                className="block text-sm font-medium text-gray-700"
              >
                Student Purpose
              </label>
              <input
                type="text"
                id="studentPurpose"
                name="studentPurpose"
                value={formData.studentPurpose}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Enter student purpose"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <PhoneInput
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange("phone")}
                placeholder="+994 050 562 53 06"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="parentPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Parent Phone
              </label>
              <PhoneInput
                id="parentPhone"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handlePhoneChange("parentPhone")}
                placeholder="+994 050 562 53 06"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="studentSchool"
                className="block text-sm font-medium text-gray-700"
              >
                Student School
              </label>
              <input
                type="text"
                id="studentSchool"
                name="studentSchool"
                value={formData.studentSchool}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Enter student school"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="parentName"
                className="block text-sm font-medium text-gray-700"
              >
                Parent Name
              </label>
              <input
                type="text"
                id="parentName"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="Enter parent name"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Student Image
              </label>
              {formData.imageUrl && !formData.image && (
                <div className="mb-2">
                  <img
                    src={formData.imageUrl}
                    alt="Current student image"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <p className="text-sm text-gray-500">Current Image</p>
                </div>
              )}
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700"
              >
                General English
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Choose Level</option>
                {levels.map((level) => (
                  <option key={level.id} value={level.name}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700"
              >
               SAT Level Test
              </label>
              <select
                id="sat_level"
                name="sat_level"
                value={formData.sat_level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Choose Level</option>
                {satLevels.map((level) => (
                  <option key={level.id} value={level.name}>
                    {level.name}
                  </option>
                ))}
              
              </select>
            </div>
              <div className="space-y-2">
                  <label
                    htmlFor="placement_test"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Placement test
                  </label>
                  <select
                    id="placement_test"
                    name="placement_test"
                    value={String(formData.placement_test)}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="false">Choose Level</option>
                    {placementTest.map((level) => (
                      <option key={level.name} value={String(level.id)}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>

            <div className="space-y-2">
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700"
              >
               IELTS TOEFL Program
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Choose Level</option>
                {ieltsTofel.map((level) => (
                  <option key={level.id} value={level.name}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700"
              >
                Kids Program
              </label>
              <select
                id="level"
                name="level"
                // value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Choose Level</option>
                {kidsTest.map((level) => (
                  <option key={level.id} value={level.name}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="level"
              className="block text-sm font-medium text-gray-700"
            >
              Branch
            </label>
            <select
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              required
            >
              <option value="">Choose Level</option>
              {branches.map((level) => (
                <option key={level.id} value={level.name}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Link
            to="/admin/dashboard"
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Close
          </Link>
          <button
            disabled={submitting}
            type="submit"
            className={`px-4 py-2 text-white rounded-md transition-colors ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-rose-500 hover:bg-rose-600"
            }`}
          >
            {submitting
              ? "Submitting..."
              : edit
              ? "Save Changes"
              : "Add Student"}
          </button>
        </div>
      </form>
    </div>
  );
}
