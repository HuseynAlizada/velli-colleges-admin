import { Outlet, useNavigate } from "react-router-dom"
import AdminSidebar from "../components/admin/AdminSidebar"

const AdminLayout = () => {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem("adminUser")
        navigate("/admin/login", { replace: true })
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(132,163,249,0.18),transparent_34%),linear-gradient(180deg,#f7f9ff_0%,#ffffff_52%,#f6f8ff_100%)] text-[#11184F]">
            <AdminSidebar />

            <main className="min-h-screen px-4 pb-8 pt-20 lg:ml-[292px] lg:px-8 lg:pt-8">
                <div className="mx-auto w-full max-w-[1540px] rounded-[28px] border border-white/70 bg-white/62 p-3 shadow-[0_24px_60px_rgba(17,24,79,0.08)] backdrop-blur-sm md:p-5">
                    <Outlet />
                </div>
            </main>

            <button
                onClick={logout}
                className="fixed right-4 top-4 z-50 h-11 rounded-2xl bg-[#11184F] px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(17,24,79,0.22)] transition hover:bg-[#487ACB] focus:outline-none focus:ring-2 focus:ring-[#84A3F9]"
            >
                Logout
            </button>
        </div>
    )
}

export default AdminLayout
