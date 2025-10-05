
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for the mobile menu toggle
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import GradeIcon from '@mui/icons-material/Grade';


const StudentSidebar = () => {
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [mobileMenu, setMobileMenu] = useState<boolean>(false);

    const handleMenuClick = (id: number) => {
        setActiveMenu(activeMenu === id ? null : id); // Toggle submenu if clicked again
        setMobileMenu(false); // Close mobile menu on item click
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenu(!mobileMenu)}
                aria-label={mobileMenu ? "Close menu" : "Open menu"}
                className={`md:hidden fixed top-16 left-2 z-50 bg-blue-400 text-white p-2 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${mobileMenu && 'bg-white'}`}
            >
                {mobileMenu ? <X size={24} className="text-blue-400" /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-[240px] bg-gradient-to-r bg-white py-10 z-40 transition-transform duration-300 ${mobileMenu ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
                {/* Logo */}
                <Link to="/" className="w-full flex justify-start" onClick={() => setMobileMenu(false)}>
                    <div className="w-[70%] mt-[30px]">
                        <img
                            src="/images/main-logo.png"
                            alt="Logo"
                            className="w-full"
                            onError={(e) => (e.currentTarget.src = "/fallback-logo.png")} // Fallback image
                        />
                    </div>
                </Link>

                {/* Menu Items */}
                <nav className="text-blue-600 mt-4 px-4 flex flex-col gap-3">
                    {/* Menu Item 1: Dashboard */}
                    <Link to="/" onClick={() => handleMenuClick(1)}>
                        <div
                            className={`gap-2 cursor-pointer flex items-center py-4 menu-animation hover:bg-blue-600 hover:text-white rounded-md px-2 ${1 === activeMenu ? "bg-blue-600 text-white" : ""
                                }`}
                        >
                            <DashboardIcon />
                            <span>Dashboard</span>
                        </div>
                    </Link>

                    {/* Menu Item 2: Profile */}


                    {/* Menu Item 3: Courses (with submenu) */}
                    <div>
                        <div
                            className={`flex items-center gap-2 cursor-pointer py-4 menu-animation hover:bg-blue-600 hover:text-white rounded-md px-2 ${3 === activeMenu ? "bg-blue-600 text-white" : ""
                                }`}
                            onClick={() => setActiveMenu(3 === activeMenu ? null : 3)}
                        >
                            <LibraryBooksIcon />
                            <span>Exams</span>
                        </div>
                        {3 === activeMenu && (
                            <div className="flex flex-col gap-2 pl-8 mt-2">
                                <Link to="/approved-exams" onClick={() => setMobileMenu(false)}>
                                    <div className="py-2 hover:text-indigo-200">Approved Exams</div>
                                </Link>
                                <Link to="/locked-exams" onClick={() => setMobileMenu(false)}>
                                    <div className="py-2 hover:text-indigo-200">Locked Exams</div>
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link to="/practice-exam" onClick={() => handleMenuClick(2)}>
                        <div
                            className={`gap-2 cursor-pointer flex items-center py-4 menu-animation hover:bg-blue-600 hover:text-white rounded-md px-2 ${2 === activeMenu ? "bg-blue-600 text-white" : ""
                                }`}
                        >
                            <LibraryBooksIcon />
                            <span>Practice Exams</span>
                        </div>
                    </Link>

                    <Link to="/placement-tests" onClick={() => handleMenuClick(7)}>
                        <div
                            className={`gap-2 cursor-pointer flex items-center py-4 menu-animation hover:bg-blue-600 hover:text-white rounded-md px-2 ${7 === activeMenu ? "bg-blue-600 text-white" : ""
                                }`}
                        >
                            <LibraryBooksIcon />
                            <span>Placement Test</span>
                        </div>
                    </Link>

                     <Link to="/sat-placement-tests" onClick={() => handleMenuClick(12)}>
                        <div
                            className={`gap-2 cursor-pointer flex items-center py-4 menu-animation hover:bg-blue-600 hover:text-white rounded-md px-2 ${12 === activeMenu ? "bg-blue-600 text-white" : ""
                                }`}
                        >
                            <LibraryBooksIcon />
                            <span>SAT Placement Test</span>
                        </div>
                    </Link>

                    <Link to="/exam-grade" onClick={() => handleMenuClick(5)}>
                        <div
                            className={`gap-2 cursor-pointer flex items-center py-4 menu-animation hover:bg-blue-600 hover:text-white rounded-md px-2 ${5 === activeMenu ? "bg-blue-600 text-white" : ""
                                }`}
                        >
                            <GradeIcon />
                            <span>Student Grade</span>
                        </div>
                    </Link>

                    {/* Menu Item 5: Settings */}
                    <Link to="/news" onClick={() => handleMenuClick(6)}>
                        <div
                            className={`gap-2 cursor-pointer flex items-center py-4 menu-animation hover:bg-blue-600 hover:text-white rounded-md px-2 ${6 === activeMenu ? "bg-blue-600 text-white" : ""
                                }`}
                        >
                            <NewspaperIcon />
                            <span>News & Articles</span>
                        </div>
                    </Link>
                </nav>
            </div>

            {/* Background Overlay on Mobile */}
            {mobileMenu && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
                    onClick={() => setMobileMenu(false)}
                    aria-hidden="true"
                />
            )}
        </>
    );
};

export default StudentSidebar;