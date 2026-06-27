import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import GradeIcon from "@mui/icons-material/Grade";

const StudentSidebar = () => {
    const location = useLocation();
    const [examsOpen, setExamsOpen] = useState(false);
    const [mobileMenu, setMobileMenu] = useState<boolean>(false);

    useEffect(() => {
        setExamsOpen(location.pathname === "/approved-exams" || location.pathname === "/locked-exams");
    }, [location.pathname]);

    const closeMobileMenu = () => setMobileMenu(false);

    const navClass = ({ isActive }: { isActive: boolean }) =>
        `group flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
            isActive
                ? "bg-[#11184F] text-white shadow-[0_12px_28px_rgba(17,24,79,0.22)]"
                : "text-[#11184F]/75 hover:bg-[#84A3F9]/14 hover:text-[#11184F]"
        }`;

    const iconClass =
        "flex h-9 w-9 items-center justify-center rounded-xl bg-[#84A3F9]/16 text-[#487ACB] [&>svg]:h-5 [&>svg]:w-5";

    const isExamRoute = location.pathname === "/approved-exams" || location.pathname === "/locked-exams";

    return (
        <>
            <button
                onClick={() => setMobileMenu(!mobileMenu)}
                aria-label={mobileMenu ? "Close menu" : "Open menu"}
                className={`md:hidden fixed left-4 top-4 z-50 rounded-2xl p-3 shadow-[0_16px_34px_rgba(17,24,79,0.24)] transition focus:outline-none focus:ring-2 focus:ring-[#84A3F9] ${
                    mobileMenu ? "bg-white text-[#11184F]" : "bg-[#11184F] text-white"
                }`}
            >
                {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>

            <aside
                className={`fixed left-0 top-0 z-40 flex h-full w-[256px] flex-col overflow-hidden border-r border-[#84A3F9]/30 bg-white/92 shadow-[18px_0_48px_rgba(17,24,79,0.10)] backdrop-blur-xl transition-transform duration-300 ${
                    mobileMenu ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                }`}
            >
                <div className="px-5 pb-5 pt-5">
                    <Link
                        to="/"
                        className="flex items-center justify-center rounded-3xl border border-[#84A3F9]/30 bg-gradient-to-br from-[#84A3F9]/18 to-white px-4 py-4 shadow-[0_18px_38px_rgba(72,122,203,0.10)]"
                        onClick={closeMobileMenu}
                    >
                        <img
                            src="/images/velli-logo.png"
                            alt="Velli Logo"
                            className="h-20 w-auto object-contain"
                            onError={(e) => (e.currentTarget.src = "/fallback-logo.png")}
                        />
                    </Link>
                </div>

                <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 pb-5">
                    <NavLink to="/" onClick={closeMobileMenu} className={navClass}>
                        <span className={iconClass}>
                            <DashboardIcon />
                        </span>
                        <span>Dashboard</span>
                    </NavLink>

                    <div className="space-y-1">
                        <button
                            type="button"
                            className={`group flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                isExamRoute
                                    ? "bg-[#11184F] text-white shadow-[0_12px_28px_rgba(17,24,79,0.22)]"
                                    : "text-[#11184F]/75 hover:bg-[#84A3F9]/14 hover:text-[#11184F]"
                            }`}
                            onClick={() => setExamsOpen(!examsOpen)}
                            aria-expanded={examsOpen}
                        >
                            <span className={iconClass}>
                                <LibraryBooksIcon />
                            </span>
                            <span className="flex-1 text-left">Exams</span>
                            <ChevronDown
                                size={18}
                                className={`transition-transform duration-200 ${examsOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {examsOpen && (
                            <div className="ml-6 space-y-1 border-l border-[#84A3F9]/35 pl-4">
                                <NavLink
                                    to="/approved-exams"
                                    onClick={closeMobileMenu}
                                    className={({ isActive }) =>
                                        `block rounded-xl px-3 py-2 text-sm transition-colors ${
                                            isActive
                                                ? "bg-[#84A3F9]/18 font-semibold text-[#11184F]"
                                                : "text-[#11184F]/62 hover:bg-[#84A3F9]/12 hover:text-[#11184F]"
                                        }`
                                    }
                                >
                                    Approved Exams
                                </NavLink>
                                <NavLink
                                    to="/locked-exams"
                                    onClick={closeMobileMenu}
                                    className={({ isActive }) =>
                                        `block rounded-xl px-3 py-2 text-sm transition-colors ${
                                            isActive
                                                ? "bg-[#84A3F9]/18 font-semibold text-[#11184F]"
                                                : "text-[#11184F]/62 hover:bg-[#84A3F9]/12 hover:text-[#11184F]"
                                        }`
                                    }
                                >
                                    Locked Exams
                                </NavLink>
                            </div>
                        )}
                    </div>

                    <NavLink to="/practice-exam" onClick={closeMobileMenu} className={navClass}>
                        <span className={iconClass}>
                            <LibraryBooksIcon />
                        </span>
                        <span>Practice Exams</span>
                    </NavLink>

                    <NavLink to="/placement-tests" onClick={closeMobileMenu} className={navClass}>
                        <span className={iconClass}>
                            <LibraryBooksIcon />
                        </span>
                        <span>Placement Test</span>
                    </NavLink>

                    <NavLink to="/exam-grade" onClick={closeMobileMenu} className={navClass}>
                        <span className={iconClass}>
                            <GradeIcon />
                        </span>
                        <span>Student Grade</span>
                    </NavLink>
                </nav>

                <div className="border-t border-[#84A3F9]/25 bg-[#84A3F9]/8 px-5 py-4">
                    <div className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[#11184F] shadow-[0_12px_28px_rgba(72,122,203,0.10)]">
                        Velli School
                    </div>
                </div>
            </aside>

            {mobileMenu && (
                <div
                    className="fixed inset-0 z-30 bg-[#11184F]/25 backdrop-blur-sm md:hidden"
                    onClick={closeMobileMenu}
                    aria-hidden="true"
                />
            )}
        </>
    );
};

export default StudentSidebar;
