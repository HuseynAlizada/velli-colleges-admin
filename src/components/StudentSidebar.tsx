import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for the mobile menu toggle
import studentMenu from "../data/studentMenu";

// Define TypeScript interface for menu items (optional, if using TypeScript)
interface MenuItem {
  id: number;
  title: string;
  link?: string;
  icon: React.ReactNode;
  subMenu?: { id: number; title: string; link: string }[]; // Submenu items
}

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
        className="md:hidden fixed top-4 left-4 z-50 bg-indigo-600 text-white p-2 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        {mobileMenu ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[240px] bg-gradient-to-r from-indigo-500 to-indigo-600 py-10 z-40 transition-transform duration-300 ${mobileMenu ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <Link to="/" className="w-full flex justify-center" onClick={() => setMobileMenu(false)}>
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
        <nav className="text-white mt-4 px-4 flex flex-col gap-3">
          {studentMenu.map((item: MenuItem) =>
            item.link ? (
                <Link to={`/${item.link}`} key={item.id} onClick={() => handleMenuClick(item.id)}>
                <div
                  className={`gap-2 cursor-pointer flex items-center py-4 menu-animation hover:bg-indigo-700 rounded-md px-2 ${item.id === activeMenu ? "bg-indigo-700" : ""}`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </div>
              </Link>
              
            ) : (
              <div key={item.id}>
                <div
                  className={`flex items-center gap-2 cursor-pointer py-4 menu-animation hover:bg-indigo-700 rounded-md px-2 ${item.id === activeMenu ? "bg-indigo-700" : ""}`}
                  onClick={() => setActiveMenu(item.id === activeMenu ? null : item.id)}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                {item.subMenu && item.id === activeMenu && (
                  <div className="flex flex-col gap-2 pl-8 mt-2">
                    {item.subMenu.map((subItem) => (
                      <Link
                      to={`/${subItem.link}`} // Ensure this is the correct path
                      key={subItem.id}
                      onClick={() => setMobileMenu(false)}
                    >
                      <div className="py-2 hover:text-indigo-200">{subItem.title}</div>
                    </Link>
                    
                    ))}
                  </div>
                )}
              </div>
            )
          )}
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
