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
            <Link to='/admin/login' className="bg-red-500 h-[35px] leading-[35px] fixed top-5 right-3   rounded-md px-4 text-white">Logout</Link>

        </div>
    )
}

export default AdminLayout