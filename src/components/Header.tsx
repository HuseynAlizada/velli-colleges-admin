import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase-client';
import { StudentData } from '../types';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const userId = Cookies.get('studentID')
    const [userData, setUserData] = useState<StudentData | null>(null)
    const [menu, setMenu] = useState<boolean>(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data, error } = await supabase.from('students')
                    .select('*')
                    .eq('id', userId)
                    .single()
                if (error) throw error
                console.log(data);
                setUserData(data)
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchUser()
    }, [userId])

    const logoutUser = () => {
        Cookies.remove("studentID")
        navigate('/')
    }

    return (
        <div className=' z-50 flex items-center justify-between px-4 py-[12px]  bg-gradient-to-r from-rose-500 to-pink-600 text-white fixed top-0 w-full relative'>
            <h1 className='text-xl font-semibold'>Student Dashboard</h1>
            <div className='relative'>
                <div className='flex items-center gap-4'>
                    <h3>Hello, <span>{userData && userData.name}</span></h3>
                    <div className='flex items-center ' onClick={() => setMenu(!menu)}>
                        <div className='w-8 h-8 rounded-full  flex items-center justify-center '>
                            <img src={userData?.image_url && userData.image_url} alt="" className='rounded-full' />
                        </div>
                        <KeyboardArrowDownIcon />
                    </div>

                </div>
                {menu && (
                <div className='absolute right-0 w-[150px] top-[100%]  bg-gradient-to-r from-rose-500 to-pink-600'>
                    <Link to='/student-profile' className=' py-3 px-4 w-full cursor-pointer '>My Profile</Link>
                    <div className=' py-3 px-4 w-full cursor-pointer ' onClick={logoutUser}>Logout</div>
                </div>
            )}
            </div>
           
        </div>
    )
}

export default Header