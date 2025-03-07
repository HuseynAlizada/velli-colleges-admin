import Header from "../components/Header"
import { Outlet, useNavigate } from "react-router-dom"
import StudentSidebar from "../components/StudentSidebar"
// import UserLogin from "../pages/student/UserLogin";
import { useEffect } from "react";
import Cookies from 'js-cookie'




const StudentLayout = () => {
    const userToken = Cookies.get('studentID')
    const navigate = useNavigate()
    useEffect(() => {
        if (!userToken) {
            navigate('/login')
        }
    }, [userToken, navigate])
    // if (!userToken) {
    //     return <UserLogin />
    // }
    return (
        <div>
            <Header />
            <div className="flex items-start justify-between p-4  gap-10">
                <div className="w-[10%]  ">
                    <StudentSidebar />
                </div>
                <div className="flex w-[calc(100%-240px)] ">
                    <Outlet />
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    )
}

export default StudentLayout




