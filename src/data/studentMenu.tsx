import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import GradeIcon from '@mui/icons-material/Grade';
import { LevelColors } from '../types';

const studentMenu = [
    {
        id: 1,
        icon: <DashboardIcon />,
        title: "Dashboard",
        link: '/'
    },
    {
        id: 2,
        icon: <LibraryBooksIcon />,
        title: "Exams",

        subMenu: [
            {
                id: 7,
                title: "Approved Exam",
                link: "approved-exams"
            },
            {
                id: 8,
                title: "Locked Exam",
                link: "locked-exams"
            },
        ]
    },
    {
        id: 3,
        icon: <LibraryBooksIcon />,
        title: "Practice Exam",
        link: "practice-exam"
    },
    {
        id: 5,
        icon: <GradeIcon />,
        title: "Exam Grade",
        link: "exam-grade"

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
        link: "news"

    }

]

export default studentMenu








export const levelColors: LevelColors = {
    A1: {
        bg: "from-green-200 to-green-100/50",
        border: "border-green-200",
        text: "text-green-700",
        icon: "text-green-600",
        badge: "bg-green-100 text-green-700",
        highlight: "text-green-700",
        button: "bg-green-500 hover:bg-green-600 focus:ring-green-500",
    },
    A2: {
        bg: "from-yellow-200 to-emerald-100/50",
        border: "border-emerald-200",
        text: "text-emerald-700",
        icon: "text-emerald-600",
        badge: "bg-emerald-100 text-emerald-700",
        highlight: "text-emerald-700",
        button: "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500",

    },
    B1: {
        bg: "from-red-200 to-blue-100/50",
        border: "border-blue-200",
        text: "text-blue-700",
        icon: "text-blue-600",
        badge: "bg-blue-100 text-blue-700",
        highlight: "text-blue-700",
        button: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500",

    },
    B2: {
        bg: "from-indigo-200 to-indigo-100/50",
        border: "border-indigo-200",
        text: "text-indigo-700",
        icon: "text-indigo-600",
        badge: "bg-indigo-100 text-indigo-700",
        highlight: "text-indigo-700",
        button: "bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500",

    },
    C1: {
        bg: "from-purple-200 to-purple-100/50",
        border: "border-purple-200",
        text: "text-purple-700",
        icon: "text-purple-600",
        badge: "bg-purple-100 text-purple-700",
        highlight: "text-purple-700",
        button: "bg-purple-500 hover:bg-purple-600 focus:ring-purple-500",

    },
    C2: {
        bg: "from-orange-200 to-violet-100/50",
        border: "border-violet-200",
        text: "text-violet-700",
        icon: "text-violet-600",
        badge: "bg-violet-100 text-violet-700",
        button: "bg-orange-500 hover:bg-orange-600 focus:ring-orange-500",
    },
}
