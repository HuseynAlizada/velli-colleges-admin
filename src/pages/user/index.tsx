import { createBrowserRouter } from "react-router-dom";

// import PracticeExamGrade from "../pages/admin/PracticeExamGrade";
import SATPlacementTests from "./SATPlacementTests";
import PlacementTests from "./PlacementTests";
import PlacementTestQuestions from "./PlacementTestQuestions";
import StudentProfileData from "../admin/StudentProfileData";
import ImportSatExam from "../admin/ImportSatExam";
import ManageSatExam from "../admin/ManageSatExam";
import PracticeExamDetails from "../admin/PracticeExamDetails";
import ImportPlacementTest from "../admin/ImportPlacementTest";
import ManagePlacementTest from "../admin/ManagePlacementTest";
import PlacementTestDetails from "../admin/PlacementTestDetails";
import PlacementTestGrade from "../admin/PlacementTestGrade";
import AdminRegister from "../admin/AdminRegister";
import PracticeExamQuestions from "./PracticeExamQuestions";
import Home from "./Home";
import StudentLayout from "../../layout/StudentLayout";
import StudentNews from "./StudentNews";
import LockedExams from "./LockedExams";
import ApprovedExams from "./ApprovedExams";
import ExamQuestions from "./ExamQuestions";
import PracticeExam from "./PracticeExam";
import StudentGrade from "./StudentGrade";
import StudentProfile from "./StudentProfile";
import RequireAuth from "../../middleware";
import AdminDashboard from "../admin/AdminDashboard";
import Levels from "../admin/Levels";
import News from "../admin/News";
import AddStudent from "../admin/AddStudent";
import ImportExam from "../admin/ImportExam";
import ExamDetails from "../admin/ExamDetails";
import ExamRequests from "../admin/ExamRequests";
import ManageExam from "../admin/ManageExam";
import ImportPracticeExam from "../admin/ImportPracticeExam";
import ManagePracticeExam from "../admin/ManagePracticeExam";
import StudentsTargets from "../admin/StudentsTargets";
import UserLogin from "./UserLogin";
import AdminLogin from "../admin/AdminLogin";
import SatExamDetails from "../admin/SatExamDetails";

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
      { path: "placement-tests", element: <PlacementTests /> },
      { path: "sat-placement-tests", element: <SATPlacementTests /> },
      { path: "placement-tests/:id", element: <PlacementTestQuestions /> },
      { path: "sat-placement-tests/:id", element: <PlacementTestQuestions /> },
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
      { path: "student-profile/:id", element: <StudentProfileData /> },
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
      // { path: "exam-grade", element: <ExamGrade /> },
      //end  level exam

      //start sat exam
      { path: "import-sat-exam", element: <ImportSatExam /> },
      { path: "import-sat-exam/:id", element: <ImportSatExam /> },
      { path: "sat-exam-details/:id", element: <SatExamDetails /> },
    //   { path: "sat-exam-requests", element: <SatExamRequests /> },
      { path: "manage-sat-exam", element: <ManageSatExam /> },
      //end sat exam

      // start practice exam
      { path: "import-practice-exam", element: <ImportPracticeExam /> },
      { path: "import-practice-exam/:id", element: <ImportPracticeExam /> },
      { path: "manage-practice-exam", element: <ManagePracticeExam /> },
      { path: "practice-exam-details/:id", element: <PracticeExamDetails /> },
      // { path: "practice-exam-grade", element: <PracticeExamGrade /> },
      // end practice exam

      // start placement test
      { path: "import-placement-test", element: <ImportPlacementTest /> },
      { path: "import-placement-test/:id", element: <ImportPlacementTest /> },
      { path: "manage-placement-test", element: <ManagePlacementTest /> },
      { path: "placement-test-details/:id", element: <PlacementTestDetails /> },
      { path: "placement-test-grade", element: <PlacementTestGrade /> },
      // end placement test

      { path: "students-targets", element: <StudentsTargets /> },
    ],
  },
  { path: "login", element: <UserLogin /> },

  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin/register", element: <AdminRegister /> },
]);

export default router;
