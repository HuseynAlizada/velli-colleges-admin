import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonIcon from '@mui/icons-material/Person';

const Header = () => {
    return (
        <div className=' z-50 flex items-center justify-between px-4 py-[12px] bg-[#D33D5A] text-white fixed top-0 w-full'>
            <h1 className='text-xl font-semibold'>Student Dashboard</h1>
            <div>
                <div className='flex items-center gap-4'>
                    <h3>Hello, <span>Huseyn</span></h3>
                    <div className='flex items-center '>
                        <div className='w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center '>
                            <PersonIcon />
                        </div>
                        <KeyboardArrowDownIcon />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header