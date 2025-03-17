import DashboardIcon from '@mui/icons-material/Dashboard';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SchoolIcon from '@mui/icons-material/School';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import GradeIcon from '@mui/icons-material/Grade';
import LoginIcon from '@mui/icons-material/Login';
import { AdminMenu } from '../types';
import { LockIcon } from 'lucide-react';

const adminMenu: AdminMenu[] = [
    {
        id: 1,
        icon: <DashboardIcon />,
        title: "Dashboard",
        link: 'dashboard'
    },
    {
        id: 2,
        icon: <UpgradeIcon />,
        title: "Levels",
        link: "levels"
    },
    {
        id: 3,
        icon: <LibraryBooksIcon />,
        title: "Exams",
        subMenu: [
            {
                id: 7,
                title: "Manage Exam",
                link: "manage-exam"
            },
            {
                id: 8,
                title: "Import Exam File",
                link: "import-exam"

            }
        ]
    },
    {
        id: 4,
        icon: <SchoolIcon />,
        title: "Students",
        subMenu: [
            {
                id: 10,
                title: "Add Student",
                link: "add-student"
            }
        ]
    },
    {
        id: 5,
        icon: <NewspaperIcon />,
        title: "News & Articles",
        link: "news"

    },
    {
        id: 6,
        icon: <GradeIcon />,
        title: "Exam Grade",
        link: "exam-grade"

    },
    {
        id: 7,
        icon: <LockIcon />,
        title: "Exam Requests",
        link: "exam-requests"
    }
]

export default adminMenu