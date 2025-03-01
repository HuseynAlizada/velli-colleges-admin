import { Navigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import Cookies from "js-cookie"; // ✅ Import correctly

const RequireAuth = () => {
    const token = Cookies.get("token"); // Get token dynamically

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    return <AdminLayout/>; // Render the child routes if authenticated
};

export default RequireAuth;
