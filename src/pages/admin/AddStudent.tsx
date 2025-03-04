
import type React from "react"

import { useEffect, useState } from "react"
import { PhoneInput } from "../../components/admin/PhoneInput"
import { PasswordInput } from "../../components/admin/PasswordInput"
import { supabase } from '../../utils/supabase-client'
import { Link, useParams } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import { useNavigate } from "react-router-dom"


const levels = [
  { id: "a1", name: "A1" },
  { id: "a2", name: "A2" },
  { id: "b1", name: "B1" },
  { id: "b1+", name: "B1+" },
  { id: "b2", name: "B2" },
  { id: "c1", name: "C1" },
]

export default function AddStudent() {
  const { id } = useParams()
  const [edit] = useState<string | null>(id ? id : null)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+994 ",
    parentPhone: "+994 ",
    level: "",
    password: "",
    parentName: "",
  })

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const { data, error } = await supabase.from("students")
          .select('*')
          .eq("id", edit)
          .single()

        if (error) {
          console.log('get single student error');
        }
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone.toString(),
          parentPhone: 'awdawdawdawd',
          level: data.level || "",
          password: data.password || "",
          parentName: data.parent_name || "",
        })
        console.log(typeof data.parent_phone);
      }
      catch (err) {
        console.log(err);
      }
    }
    fetchdata()
  }, [edit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const phoneRegex = /^\+994 \d{3} \d{2} \d{2}$/
    if (!phoneRegex.test(formData.phone) || !phoneRegex.test(formData.parentPhone)) {
      alert("Please enter valid phone numbers in the format: +994 562 53 06")
      return
    }

    const passwordRequirements = {
      uppercase: /[A-Z]/.test(formData.password),
      number: /[0-9]/.test(formData.password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
      minLength: formData.password.length >= 8,
    }

    if (!Object.values(passwordRequirements).every(Boolean)) {
      alert("Please ensure your password meets all requirements")
      return
    }

    const action = edit ? "update" : "insert";
    const operation = edit ?
      supabase.from('students').update([{
        name: formData.name,
        email: formData.email,
        level: formData.level,
        phone: formData.phone,
        parent_phone: formData.parentPhone,
        parent_name: formData.parentName,
        password: formData.password
      }]).eq("id", edit)
      :
      supabase.from('students').insert([{
        name: formData.name,
        email: formData.email,
        level: formData.level,
        phone: formData.phone,
        parent_phone: formData.parentPhone,
        parent_name: formData.parentName,
        password: formData.password
      }])

    try {
      const { error } = await operation
      if (error) throw error
      toast.success(`Level ${action === "update" ? "Updated" : "Added"}!`);
      navigate('/admin/dashboard')

      setFormData({
        name: "",
        email: "",
        phone: "+994 ",
        parentPhone: "+994 ",
        level: "",
        password: "",
        parentName: "",
      })
    }
    catch (err) {
      console.log(err);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhoneChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="w-full mx-auto p-6">
      <ToastContainer autoClose={3000} />
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add new student</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <PhoneInput
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange("phone")}
                placeholder="+994 562 53 06"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700">
                Parent Phone
              </label>
              <PhoneInput
                id="parentPhone"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handlePhoneChange("parentPhone")}
                placeholder="+994 562 53 06"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                Level
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                required
              >
                <option value="">Choose Level</option>
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <PasswordInput id="password" name="password" value={formData.password} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <label htmlFor="parentName" className="block text-sm font-medium text-gray-700">
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Link to='/admin/dashboard'
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Close
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors"
          >
            {edit ? "Save changes" : "Add Student"}
          </button>
        </div>
      </form>
    </div>
  )
}

