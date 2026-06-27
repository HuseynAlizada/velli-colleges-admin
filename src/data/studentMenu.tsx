import DashboardIcon from "@mui/icons-material/Dashboard";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import GradeIcon from "@mui/icons-material/Grade";
import { LevelColors } from "../types";

const studentMenu = [
  {
    id: 1,
    icon: <DashboardIcon />,
    title: "Dashboard",
    link: "/",
  },
  {
    id: 2,
    icon: <LibraryBooksIcon />,
    title: "Exams",

    subMenu: [
      {
        id: 7,
        title: "Approved Exam",
        link: "approved-exams",
      },
      {
        id: 8,
        title: "Locked Exam",
        link: "locked-exams",
      },
    ],
  },
  {
    id: 3,
    icon: <LibraryBooksIcon />,
    title: "Practice Exam",
    link: "practice-exam",
  },
  {
    id: 5,
    icon: <GradeIcon />,
    title: "Exam Grade",
    link: "exam-grade",
  },
];

export default studentMenu;

const brandLevelColors = {
  bg: "from-[#84A3F9]/30 to-white",
  border: "border-[#84A3F9]/50",
  text: "text-[#11184F]",
  icon: "text-[#487ACB]",
  badge: "bg-[#84A3F9]/20 text-[#11184F]",
  highlight: "text-[#487ACB]",
  button: "bg-[#11184F] hover:bg-[#487ACB] focus:ring-[#84A3F9]",
};

export const levelColors: LevelColors = {
  A1: brandLevelColors,
  A2: brandLevelColors,
  B1: brandLevelColors,
  "B1+": brandLevelColors,
  B2: brandLevelColors,
  C1: brandLevelColors,
  C2: brandLevelColors,
  math: brandLevelColors,
  verbal: brandLevelColors,
};
