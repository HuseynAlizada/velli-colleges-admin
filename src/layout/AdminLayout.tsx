import { Link, Outlet } from "react-router-dom"
import AdminSidebar from "../components/admin/AdminSidebar"


const AdminLayout = () => {


    return (
        <div className="flex ">
            <div className="xl:w-[20%]  ">
                <AdminSidebar  />
            </div>

            <div className=" xl:w-[80%] w-[90%] mx-auto">
                <Outlet />
            </div>
            <Link to='/admin/login' className="bg-red-500 h-[40px] leading-[40px] rounded-bl-2xl fixed top-0 right-0  px-6 text-white">Logout</Link>

        </div>
    )
}

export default AdminLayout