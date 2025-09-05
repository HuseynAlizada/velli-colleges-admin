import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import adminMenu from "../../data/adminMenu";
import { Menu, X } from "lucide-react";

const AdminSidebar = () => {
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [mobileMenu, setMobileMenu] = useState<boolean>(false);

    // Auto-close mobile menu on large screens
    useEffect(() => {
        const handleResize = () => {
           if (window.innerWidth > 1000) {
        setMobileMenu(true); // show sidebar
      } else {
        setMobileMenu(false); // collapse into mobile menu
      }
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="w-full">
            {/* Mobile Menu Button */}
            {
                !mobileMenu && (
                    <button
                        onClick={() => setMobileMenu(true)}
                        className="2xl:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg"
                    >
                        <Menu size={24} />
                    </button>
                )
            }


            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full overflow-y-auto overflow-x-hidden w-[310px] bg-white py-2 z-40 transition-transform duration-300 
    ${mobileMenu ? "translate-x-0" : "-translate-x-full"} 2xl:translate-x-0 2xl:block shadow-lg`}
            >
                {/* Logo */}
                <div className="flex">
                    <img src="/images/main-logo.png" alt="Logo" className="w-[70%]" />
                </div>

                {/* Close Button for Mobile */}
                <button
                    className="absolute top-4 right-4 text-blue-600 2xl:hidden"
                    onClick={() => setMobileMenu(false)}
                >
                    <X size={24} />
                </button>

                {/* Menu Items */}
                <div className="flex flex-col text-blue-500 mt-[0px] px-4">
                    {adminMenu.map((item) => (
                        item.link ? (
                            <Link to={`/admin/${item.link}`} key={item.id} onClick={() => setMobileMenu(false)}>
                                <div className="list" onClick={() => setActiveMenu(item.id)}>
                                    <div
                                        className={`flex items-center gap-2 text-md cursor-pointer py-3 menu-animation 
              ${item.id === activeMenu ? "active" : ""}`}
                                    >
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div key={item.id} className="list" onClick={() => setActiveMenu(item.id)}>
                                <div
                                    className={`flex items-center gap-2 text-md cursor-pointer py-4 menu-animation 
            ${item.id === activeMenu ? "active" : ""}`}
                                >
                                    {item.icon}
                                    <span>{item.title}</span>
                                </div>
                                {item.subMenu && item.id === activeMenu && (
                                    <div className="flex flex-col gap-2 pl-10 submenu active">
                                        {item.subMenu.map((subItem) => (
                                            <Link to={`/admin/${subItem.link}`} key={subItem.id} onClick={() => setMobileMenu(false)}>
                                                <div className="py-2">{subItem.title}</div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    ))}
                </div>
            </div>

            {/* Background Overlay on Mobile
            {mobileMenu && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30 2xl:hidden"
                    onClick={() => setMobileMenu(false)}
                />  
            )} */}
        </div>
    );
};

export default AdminSidebar;
