import { Outlet } from "react-router-dom"
import AdminSidebar from "../components/admin/AdminSidebar"


const AdminLayout = () => {


    return (
        <div className="flex ">
            <div className="xl:w-[20%]  ">
                <AdminSidebar  />
            </div>

            <div className=" xl:w-[80%] w-full">
                <Outlet />
            </div>

        </div>
    )
}

export default AdminLayout