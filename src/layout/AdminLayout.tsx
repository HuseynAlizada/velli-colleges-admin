import { Outlet } from "react-router-dom"
import AdminSidebar from "../components/admin/AdminSidebar"

const AdminLayout = () => {

    return (
        <div className="flex">
            <div className="w-[15%] ">
                <AdminSidebar />
            </div>

            <div className="flex w-[80%] mx-auto relative">
               <Outlet/>
            </div>

        </div>
    )
}

export default AdminLayout