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
        localStorage.setItem("studentId", data.id)
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
      className="fixed left-3 right-3 top-3 z-30 flex min-h-14 items-center justify-between rounded-3xl border border-[#84A3F9]/30 bg-white/88 px-4 py-2 text-[#11184F] shadow-[0_18px_48px_rgba(17,24,79,0.10)] backdrop-blur-xl md:left-[272px] md:right-6 md:px-5"
    >
      <h1 className="text-[16px] font-semibold md:text-xl">Student Dashboard</h1>
      {/* <h3 className='md:text-xl text-md font-semibold md:block hidden'>Build your future</h3> */}
      <div className="relative">
        <div className="flex items-center md:gap-4 gap-1">
          <h3 className="hidden text-[14px] md:block md:text-[16px]">
            Hello, <span className="font-medium">{userData && userData.name}</span>
          </h3>
          <div
            className="flex cursor-pointer items-center rounded-2xl border border-[#84A3F9]/24 bg-[#84A3F9]/10 px-2 py-1 transition hover:bg-[#84A3F9]/16"
            onClick={() => setMenu(!menu)}
          >
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-white shadow-sm">
              <img
                src={userData?.image_url || "/images/student_avatar.jpeg"}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <KeyboardArrowDownIcon className="text-[#487ACB]" />
          </div>
        </div>

        {menu && (
          <div className="absolute right-0 top-[calc(100%+10px)] w-[170px] overflow-hidden rounded-2xl border border-[#84A3F9]/35 bg-white shadow-[0_18px_42px_rgba(17,24,79,0.12)]">
            <Link
              to="/student-profile"
              className="block w-full cursor-pointer px-4 py-3 text-[#11184F] transition-colors hover:bg-[#84A3F9]/12"
            >
              My Profile
            </Link>
            <div
              className="w-full cursor-pointer border-t border-[#84A3F9]/30 px-4 py-3 text-[#11184F] transition-colors hover:bg-[#84A3F9]/12"
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
