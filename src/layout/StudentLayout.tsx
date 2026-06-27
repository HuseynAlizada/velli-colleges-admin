import { useEffect } from "react";
import Cookies from "js-cookie";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import StudentSidebar from "../components/StudentSidebar";

const StudentLayout = () => {
    const userToken = Cookies.get("studentID");
    const navigate = useNavigate();

    useEffect(() => {
        if (!userToken) {
            navigate("/login");
        }
    }, [userToken, navigate]);

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(132,163,249,0.18),transparent_34%),linear-gradient(180deg,#f7f9ff_0%,#ffffff_52%,#f6f8ff_100%)] text-[#11184F]">
            <StudentSidebar />
            <Header />

            <main className="min-h-screen px-3 pb-8 pt-20 md:pl-[272px] md:pr-6 md:pt-24">
                <div className="mx-auto w-full max-w-[1500px]">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default StudentLayout;

