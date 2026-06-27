import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { supabase } from "../utils/supabase-client";

const RequireAuth = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            const storedAdmin = localStorage.getItem("adminUser");
            const admin = storedAdmin ? JSON.parse(storedAdmin) : null;
            const email = typeof admin?.email === "string" ? admin.email : "";

            if (!email) {
                if (isMounted) {
                    setIsAuthorized(false);
                    setLoading(false);
                }
                return;
            }

            const { data: adminInfo } = await supabase
                .from("admin_users")
                .select("approved")
                .eq("email", email)
                .maybeSingle();

            if (!adminInfo || adminInfo.approved === false) {
                localStorage.removeItem("adminUser");
                if (isMounted) {
                    setIsAuthorized(false);
                    setLoading(false);
                }
                return;
            }

            if (isMounted) {
                setIsAuthorized(true);
                setLoading(false);
            }
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) return <div>Yüklənir...</div>;

    if (!isAuthorized) return <Navigate to="/admin/login" replace />;

    return <AdminLayout />;
};

export default RequireAuth;
