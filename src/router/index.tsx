import { createBrowserRouter } from "react-router-dom";
import ManageExam from "../pages/admin/ManageExam";
import ImportExam from "../pages/admin/ImportExam";
import AddStudent from "../pages/admin/AddStudent";
import News from "../pages/admin/News";
import Levels from "../pages/admin/Levels";
import AdminLogin from "../pages/admin/AdminLogin";
import RequireAuth from "../middleware";
import StudentLayout from "../layout/StudentLayout";
import Home from "../pages/student/Home";
import AdminDashboard from "../pages/admin/AdminDashboard";
import StudentNews from "../pages/student/StudentNews";
import ExamDetails from "../pages/admin/ExamDetails";
import ExamList from "../pages/student/ExamList";
import ExamQuestions from "../pages/admin/ExamQuestions";
import StudentProfile from "../pages/student/StudentProfile";
import UserLogin from "../pages/student/UserLogin";

const router = createBrowserRouter([
    {
        path: "/",
        element: <StudentLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "news", element: <StudentNews /> },
            { path: "exams", element: <ExamList /> },
            { path: "exams/:id", element: <ExamQuestions /> },
            { path: "practice-exam", element: <StudentNews /> },
            { path: "news", element: <StudentNews /> },
            { path: "exam-grade", element: <StudentNews /> },
            { path: "student-profile", element: <StudentProfile /> },
        ],
    },
    {
        path: "/admin",
        element: <RequireAuth />,
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: "dashboard", element: <AdminDashboard /> },
            { path: "levels", element: <Levels /> },
            { path: "news", element: <News /> },
            { path: "add-student", element: <AddStudent /> },
            { path: "edit-student/:id", element: <AddStudent /> },
            { path: "import-exam", element: <ImportExam /> },
            { path: "import-exam/:id", element: <ImportExam /> },
            { path: "exam-details/:id", element: <ExamDetails /> },
            { path: "manage-exam", element: <ManageExam /> },
        ],
    },
    { path: 'login', element: <UserLogin /> },

    { path: "/admin/login", element: <AdminLogin /> },


]);

export default router;
