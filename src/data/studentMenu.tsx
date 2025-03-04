import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import GradeIcon from '@mui/icons-material/Grade';

const studentMenu = [
    {
        id: 1,
        icon: <DashboardIcon />,
        title: "Dashboard",

        link:''
    },
    {
        id: 2,
        icon: <LibraryBooksIcon />,
        title: "Exams",
    
    },
    {
        id: 3,
        icon: <LibraryBooksIcon />,
        title: "Practice Exam",
    
    },
   
    {
        id: 5,
        icon: <GradeIcon />,
        title: "Exam Grade",
        link:"exam-grade"

    },
   
    // {
    //     id: 4,
    //     icon: <SchoolIcon />,
    //     title: "Students",
    //     subMenu: [
    //         {
    //             id: 10,
    //             title: "Add Student",
    //             link:"add-student"
    //         }
    //     ]
    // },
    {
        id: 6,
        icon: <NewspaperIcon />,
        title: "News & Articles",
        link:"news"

    }
 
]

export default studentMenu