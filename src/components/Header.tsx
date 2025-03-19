"use client"

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { supabase } from "../utils/supabase-client"
import type { StudentData } from "../types"
import { Link, useNavigate } from "react-router-dom"

const Header = () => {
  const userId = Cookies.get("studentID")
  const [userData, setUserData] = useState<StudentData | null>(null)
  const [menu, setMenu] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.from("students").select("*").eq("id", userId).single()
        if (error) throw error
        setUserData(data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchUser()
  }, [userId])

  const logoutUser = () => {
    Cookies.remove("studentID")
    navigate("/")
  }

  return (
    <div
      className="z-50 flex items-center justify-between px-4 py-[12px] bg-white text-blue-400 fixed top-0 w-full 
                        shadow-[0_4px_20px_rgba(59,130,246,0.3)] border-b border-blue-100"
    >
      <h1 className="text-xl  font-semibold">Student Dashboard</h1>
      {/* <h3 className='md:text-xl text-md font-semibold md:block hidden'>Build your future</h3> */}
      <div className="relative">
        <div className="flex items-center gap-4 ">
          <h3 className="text-[18px]">
            Hello, <span className="font-medium">{userData && userData.name}</span>
          </h3>
          <div
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setMenu(!menu)}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-200 shadow-sm">
              <img
                src={userData?.image_url || "/placeholder.svg"}
                alt=""
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            <KeyboardArrowDownIcon className="text-blue-500" />
          </div>
        </div>

        {menu && (
          <div className="absolute right-0 w-[150px] top-[calc(100%+8px)] bg-white rounded-lg shadow-[0_5px_15px_rgba(59,130,246,0.25)] border border-blue-100 overflow-hidden">
            <Link
              to="/student-profile"
              className="block py-3 px-4 w-full cursor-pointer text-blue-600 hover:bg-blue-50 transition-colors"
            >
              My Profile
            </Link>
            <div
              className="py-3 px-4 w-full cursor-pointer text-blue-600 hover:bg-blue-50 transition-colors border-t border-blue-100"
              onClick={logoutUser}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header

