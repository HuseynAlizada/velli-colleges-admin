import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase-client";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [ready, setReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (!data.session) {
                alert("Keçərsiz link!");
                navigate("/admin/login");
            } else {
                setReady(true);
            }
        });
    }, []);

    const handleReset = async () => {
        if (newPassword.length < 6) {
            alert("Parol ən az 6 simvol olmalıdır!");
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            alert("Xəta: " + error.message);
            return;
        }

        alert("Parol uğurla dəyişdirildi!");
        navigate("/admin/login");
    };

    if (!ready) return <div className="flex items-center justify-center h-screen">Yüklənir...</div>;

    return (
        <div className="flex items-center justify-center h-screen bg-gray-300">
            <div className="bg-white p-8 rounded-xl w-[400px]">
                <h2 className="text-2xl font-bold mb-6">Yeni Parol Təyin Et</h2>
                <input
                    type="password"
                    placeholder="Yeni parol"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded p-2 mb-4"
                />
                <button
                    onClick={handleReset}
                    className="w-full bg-green-600 text-white py-2 rounded"
                >
                    Təsdiqlə
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;