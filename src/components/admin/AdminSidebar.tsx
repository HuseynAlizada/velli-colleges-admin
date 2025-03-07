import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminMenu from '../../data/adminMenu';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';

const AdminSidebar = () => {
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [mobileMenu, setMobileMenu] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) {
                setMobileMenu(false);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <div onClick={() => setMobileMenu(true)} className={`${mobileMenu ? 'hidden' : "block bg-[#D33D5A] text-white p-4"} xl:hidden`}>
                <MenuIcon />
            </div>
            <div
                className={`
        ${mobileMenu
                        ? 'fixed top-0 left-0 w-[300px] z-[999]'
                        : 'hidden'} 
        xl:block h-screen md:w-[250px] inset-0 bg-gradient-to-r from-rose-500 to-pink-600   py-10 xl:fixed 
    `}
            >
                <div className='mx-auto w-auto flex items-center justify-start lg:gap-2 gap-1 text-white absolute left-5'>
                    <div className='lg:w-16 lg:h-16 w-12 h-12 border-2'>
                        <img src="/images/logo.png" alt="Logo" />
                    </div>
                    <h3 className='whitespace-nowrap text-sm lg:text-xl'>Family School</h3>
                </div>
                <div
                    className={`
            ${mobileMenu ? 'block' : 'hidden'} 
            text-3xl absolute text-white right-3 top-1
        `}
                    onClick={() => setMobileMenu(false)}
                >
                    <CloseIcon />
                </div>

                <div className='flex flex-col gap-3 text-white mt-[90px] px-4'>
                    {adminMenu.map((item) => (
                        item.link ? (
                            <Link to={`/admin/${item.link}`} key={item.id}>
                                <div key={item.id} className="list" onClick={() => setActiveMenu(item.id)}>
                                    <div className={`flex  items-center gap-2 lg:text-md text-sm cursor-pointer menu-animation py-4 ${item.id === activeMenu ? 'active' : ''}`}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </div>
                                    {item.subMenu && item.id === activeMenu && (
                                        <div className="flex flex-col gap-2 pl-10 submenu active">
                                            {item.subMenu.map(subItem => (
                                                <div key={subItem.id} className="py-2">{subItem.title}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ) : (
                            <div key={item.id} className="list" onClick={() => setActiveMenu(item.id)}>
                                <div className={`flex items-center gap-2 lg:text-md text-sm cursor-pointer menu-animation py-4 ${item.id === activeMenu ? 'active' : ''}`}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </div>
                                {item.subMenu && item.id === activeMenu && (
                                    <div className="flex flex-col gap-2 pl-10 submenu active lg:text-md text-sm">
                                        {item.subMenu.map(subItem => (
                                            <Link to={`/admin/${subItem.link}`} key={subItem.id}>
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
        </>
    );
};

export default AdminSidebar;
