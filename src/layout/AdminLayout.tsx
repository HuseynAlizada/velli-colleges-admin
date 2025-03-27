import { Outlet } from "react-router-dom"
import AdminSidebar from "../components/admin/AdminSidebar"


const AdminLayout = () => {


    return (
        <div className="flex ">
            <div className="2xl:w-[20%]  ">
                <AdminSidebar  />
            </div>

            <div className=" 2xl:w-[80%] w-[90%] mx-auto">
                <Outlet />
            </div>

        </div>
    )
}

export default AdminLayout