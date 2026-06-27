import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import adminMenu from "../../data/adminMenu";
import { ChevronDown, Menu, X } from "lucide-react";

const AdminSidebar = () => {
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [mobileMenu, setMobileMenu] = useState<boolean>(false);

    useEffect(() => {
        const currentParent = adminMenu.find((item) =>
            item.subMenu?.some((subItem) => location.pathname === `/admin/${subItem.link}`)
        );
        if (currentParent) setActiveMenu(currentParent.id);
    }, [location.pathname]);

    useEffect(() => {
        const handleResize = () => {
            setMobileMenu(window.innerWidth >= 1024);
        };

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const closeMobileMenu = () => {
        if (window.innerWidth < 1024) setMobileMenu(false);
    };

    const menuItemClass = (isActive: boolean) =>
        `group flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
            isActive
                ? "bg-[#11184F] text-white shadow-[0_12px_28px_rgba(17,24,79,0.22)]"
                : "text-[#11184F]/75 hover:bg-[#84A3F9]/14 hover:text-[#11184F]"
        }`;

    return (
        <div className="w-full">
            {!mobileMenu && (
                <button
                    onClick={() => setMobileMenu(true)}
                    aria-label="Open admin menu"
                    className="lg:hidden fixed top-4 left-4 z-50 rounded-2xl bg-[#11184F] p-3 text-white shadow-[0_16px_34px_rgba(17,24,79,0.24)] transition hover:bg-[#487ACB] focus:outline-none focus:ring-2 focus:ring-[#84A3F9]"
                >
                    <Menu size={22} />
                </button>
            )}

            {mobileMenu && (
                <div
                    className="fixed inset-0 z-30 bg-[#11184F]/25 backdrop-blur-sm lg:hidden"
                    onClick={closeMobileMenu}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-40 flex h-full w-[292px] flex-col overflow-hidden border-r border-[#84A3F9]/30 bg-white/92 shadow-[18px_0_48px_rgba(17,24,79,0.10)] backdrop-blur-xl transition-transform duration-300 ${
                    mobileMenu ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
            >
                <div className="px-5 pb-4 pt-5">
                    <Link
                        to="/admin/dashboard"
                        onClick={closeMobileMenu}
                        className="flex items-center justify-center rounded-3xl border border-[#84A3F9]/30 bg-gradient-to-br from-[#84A3F9]/18 to-white px-4 py-4 shadow-[0_18px_38px_rgba(72,122,203,0.10)]"
                    >
                        <img src="/images/velli-logo.png" alt="Velli Logo" className="h-20 w-auto object-contain" />
                    </Link>
                </div>

                <button
                    className="absolute right-4 top-4 rounded-full p-2 text-[#11184F] transition hover:bg-[#84A3F9]/16 lg:hidden"
                    onClick={closeMobileMenu}
                    aria-label="Close admin menu"
                >
                    <X size={22} />
                </button>

                <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 pb-5">
                    {adminMenu.map((item) => {
                        const isParentActive = item.subMenu?.some(
                            (subItem) => location.pathname === `/admin/${subItem.link}`
                        );
                        const isOpen = item.id === activeMenu || isParentActive;

                        if (item.link) {
                            return (
                                <NavLink
                                    to={`/admin/${item.link}`}
                                    key={item.id}
                                    onClick={closeMobileMenu}
                                    className={({ isActive }) => menuItemClass(isActive)}
                                >
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#84A3F9]/16 text-[#487ACB] transition group-[.active]:bg-white/15 group-[.active]:text-white [&>svg]:h-5 [&>svg]:w-5">
                                        {item.icon}
                                    </span>
                                    <span className="truncate">{item.title}</span>
                                </NavLink>
                            );
                        }

                        return (
                            <div key={item.id} className="space-y-1">
                                <button
                                    type="button"
                                    onClick={() => setActiveMenu(isOpen ? null : item.id)}
                                    className={`${menuItemClass(Boolean(isParentActive))} w-full`}
                                    aria-expanded={Boolean(isOpen)}
                                >
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#84A3F9]/16 text-[#487ACB] [&>svg]:h-5 [&>svg]:w-5">
                                        {item.icon}
                                    </span>
                                    <span className="flex-1 truncate text-left">{item.title}</span>
                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {item.subMenu && isOpen && (
                                    <div className="ml-6 space-y-1 border-l border-[#84A3F9]/35 pl-4">
                                        {item.subMenu.map((subItem) => (
                                            <NavLink
                                                to={`/admin/${subItem.link}`}
                                                key={subItem.id}
                                                onClick={closeMobileMenu}
                                                className={({ isActive }) =>
                                                    `block rounded-xl px-3 py-2 text-sm transition-colors ${
                                                        isActive
                                                            ? "bg-[#84A3F9]/18 font-semibold text-[#11184F]"
                                                            : "text-[#11184F]/62 hover:bg-[#84A3F9]/12 hover:text-[#11184F]"
                                                    }`
                                                }
                                            >
                                                {subItem.title}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="border-t border-[#84A3F9]/25 bg-[#84A3F9]/8 px-5 py-4">
                    <div className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[#11184F] shadow-[0_12px_28px_rgba(72,122,203,0.10)]">
                        Velli School
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default AdminSidebar;
