import Header from "../components/Header"
import Footer from "../components/Footer"
import { Outlet } from "react-router-dom"
import StudentSidebar from "../components/StudentSidebar"
import Cookies from "js-cookie"; // ✅ Import correctly
import UserLogin from "../pages/student/UserLogin";


const StudentLayout = () => {

    // const userToken = Cookies.get('userToken')
    const userToken = 'data'


    if(!userToken){
        return <UserLogin/>
    }

    return (
        <div>
            <Header />
            <div className="h-screen p-4 mt-10 mx-auto gap-10">
                <div className="w-[10%] ">
                    <StudentSidebar />
                </div>
                <div className="flex  w-[80%] ml-auto border-2">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default StudentLayout