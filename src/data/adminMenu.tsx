import DashboardIcon from '@mui/icons-material/Dashboard';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SchoolIcon from '@mui/icons-material/School';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import GradeIcon from '@mui/icons-material/Grade';
import { AdminMenu } from '../types';
import { LockIcon } from 'lucide-react';
import AdsClickIcon from '@mui/icons-material/AdsClick';

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
        id: 11,
        icon: <AdsClickIcon />,
        title: "Students Targets",
        link: "students-targets"
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
        id: 12,
        icon: <LibraryBooksIcon />,
        title: "Practice Exam",
        subMenu: [
            {
                id: 7,
                title: "Manage Practice Exam",
                link: "manage-practice-exam"
            },
            {
                id: 8,
                title: "Import Exam File",
                link: "import-practice-exam"
            }
        ]
    },
    {
        id: 15,
        icon: <LibraryBooksIcon />,
        title: "Placement Test",
        subMenu: [
            {
                id: 16,
                title: "Manage Placement Test",
                link: "manage-placement-test"
            },
            {
                id: 17,
                title: "Import Placement Test",
                link: "import-placement-test"
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
        id: 13,
        icon: <GradeIcon />,
        title: "Practice Exam Grade",
        link: "practice-exam-grade"

    },
    {
        id: 14,
        icon: <GradeIcon />,
        title: "Placement Test Grade",
        link: "placement-test-grade"

    },
    {
        id: 7,
        icon: <LockIcon />,
        title: "Exam Requests",
        link: "exam-requests"
    }
]

export default adminMenu