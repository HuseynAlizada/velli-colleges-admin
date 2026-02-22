import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { supabase } from "../utils/supabase-client";

const RequireAuth = () => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Yüklənir...</div>;

    if (!session) return <Navigate to="/admin/login" replace />;

    return <AdminLayout />;
};

export default RequireAuth;