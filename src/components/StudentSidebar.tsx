import { useState } from 'react';
import { Link } from 'react-router-dom';
import studentMenu from '../data/studentMenu';

const StudentSidebar = () => {
    const [activeMenu, setActiveMenu] = useState<number | null>(null)
    return (
        <div className="h-screen fixed top-0 left-0 w-[230px] bg-[#D33D5A] py-10">
            <div className=' mx-auto w-full mt-10  flex items-center justify-center gap-2 text-white'>
                <div className='w-10 h-10 '>
                    <img src="/images/logo.png" alt="" />
                </div>
                <h3 className='whiteSpace-nowrap'>Family School</h3>
            </div>
            <div className=' text-white mt-12 px-4 flex flex-col gap-3 '>
                {studentMenu.map(item => (
                    item.link ? (
                        <Link to={`/${item.link}`}>
                            <div key={item.id} className={`list`} onClick={() => setActiveMenu(item.id)}>
                                <div className={` gap-2  cursor-pointer flex items-center  menu-animation py-4 ${item.id === activeMenu ? 'active' : ''}`}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </div>

                                <div className={`flex flex-col gap-2 pl-10 submenu ${(item?.subMenu && item.id === activeMenu) ? 'active' : ''}`}>
                                    {item.subMenu && item?.subMenu.map(subItem => (
                                        <div key={subItem.id} className='py-2'>{subItem.title}</div>
                                    ))}
                                </div>  
                            </div>
                        </Link>
                    ) : (<div key={item.id} className={`list`} onClick={() => setActiveMenu(item.id)}>
                        <div className={`flex items-center gap-2 cursor-pointer menu-animation py-4 ${item.id === activeMenu ? 'active' : ''}`}>
                            {item.icon}
                            <span>{item.title}</span>
                        </div>

                        <div className={`flex flex-col gap-2 pl-10 submenu ${(item?.subMenu && item.id === activeMenu) ? 'active' : ''}`}>
                            {item.subMenu && item?.subMenu.map(subItem => (
                              <Link to={`/${subItem.link}`}>  <div key={subItem.id} className='py-2'>{subItem.title}</div></Link>
                            ))}
                        </div>
                    </div>)
                ))}
            </div>
        </div>
    )
}

export default StudentSidebar