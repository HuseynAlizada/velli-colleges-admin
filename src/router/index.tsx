import { createBrowserRouter } from "react-router-dom";
import ManageExam from "../pages/admin/ManageExam";
import ImportExam from "../pages/admin/ImportExam";
import AddStudent from "../pages/admin/AddStudent";
import News from "../pages/admin/News";
import Levels from "../pages/admin/Levels";
import AdminLogin from "../pages/admin/AdminLogin";
import RequireAuth from "../middleware";
import StudentLayout from "../layout/StudentLayout";
import Home from "../pages/user/Home";
import AdminDashboard from "../pages/admin/AdminDashboard";
import StudentNews from "../pages/user/StudentNews";
import ExamDetails from "../pages/admin/ExamDetails";
import ExamQuestions from "../pages/user/ExamQuestions";
import StudentProfile from "../pages/user/StudentProfile";
import UserLogin from "../pages/user/UserLogin";
import LockedExams from "../pages/user/LockedExams";
import ExamRequests from "../pages/admin/ExamRequests";
import ApprovedExams from "../pages/user/ApprovedExams";
import PracticeExam from "../pages/user/PracticeExam";
import ExamGrade from "../pages/admin/ExamGrade";
import StudentGrade from "../pages/user/StudentGrade";
import StudentsTargets from "../pages/admin/StudentsTargets";
import ImportPracticeExam from "../pages/admin/ImportPracticeExam";
import ManagePracticeExam from "../pages/admin/ManagePracticeExam";
import PracticeExamQuestions from "../pages/user/PracticeExamQuestions";
import PracticeExamDetails from "../pages/admin/PracticeExamDetails";

const router = createBrowserRouter([
    {
        path: "/",
        element: <StudentLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "news", element: <StudentNews /> },
            { path: "locked-exams", element: <LockedExams /> },
            { path: "approved-exams", element: <ApprovedExams /> },
            { path: "approved-exams/:id", element: <ExamQuestions /> },
            { path: "practice-exam/:id", element: <PracticeExamQuestions /> },
            { path: "practice-exam", element: <PracticeExam /> },
            { path: "news", element: <StudentNews /> },
            { path: "exam-grade", element: <StudentGrade /> },
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
            //start level exam
            { path: "import-exam", element: <ImportExam /> },
            { path: "import-exam/:id", element: <ImportExam /> },
            { path: "exam-details/:id", element: <ExamDetails /> },
            { path: "exam-requests", element: <ExamRequests /> },
            { path: "manage-exam", element: <ManageExam /> },
            { path: "exam-grade", element: <ExamGrade /> },
            //end  level exam

            // start practice exam 
            { path: "import-practice-exam", element: <ImportPracticeExam /> },
            { path: "import-practice-exam/:id", element: <ImportPracticeExam /> },
            { path: "manage-practice-exam", element: <ManagePracticeExam /> },
            { path: "practice-exam-details/:id", element: <PracticeExamDetails /> },

            // end practice exam

            { path: "students-targets", element: <StudentsTargets /> },
        ],
    },
    { path: 'login', element: <UserLogin /> },

    { path: "/admin/login", element: <AdminLogin /> },


]);

export default router;
