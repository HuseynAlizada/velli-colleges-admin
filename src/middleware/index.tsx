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
            const { data } = await supabase.auth.getSession();
            const user = data.session?.user;
            const email = user?.email;

            if (!email) {
                if (isMounted) {
                    setIsAuthorized(false);
                    setLoading(false);
                }
                return;
            }

            const metadataBranch = user.user_metadata?.branch;
            const branchFromMetadata =
                typeof metadataBranch === "string" ? metadataBranch : "";

            const { data: adminInfo } = await supabase
                .from("admin_data")
                .select("branch")
                .eq("email", email)
                .maybeSingle();

            localStorage.setItem(
                "branch",
                JSON.stringify(adminInfo?.branch || branchFromMetadata || "Inqilab")
            );

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
