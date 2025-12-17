import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { supabase } from "../../utils/supabase-client";
import { adminData } from "../../types";

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userData, setUserData] = useState<adminData[] | null>(null);
    const [showResetModal, setShowResetModal] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [resetEmail, setResetEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const { data, error } = await supabase
                    .from("admin_data")
                    .select("*");
                if (error) throw new Error;
                setUserData(data);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    const handleLogin = () => {
            const user = userData?.find((u) => u.email === username && u.password === password && u.approved === true);
        if (user) {
            const token = btoa(`${username}:${password}`);
            localStorage.setItem("branch", JSON.stringify(user.branch));
            Cookies.set("token", token, { expires: 1 / 24 });
            navigate("/admin/dashboard");
        } else {
            alert("Invalid credentials!");
        }
    };

    const handleResetPassword = async () => {
        try {
            if (!resetEmail || !newPassword) {
                alert("Please fill in all fields");
                return;
            }

            const {  error } = await supabase
                .from("admin_data")
                .update({ password: newPassword })
                .eq("email", resetEmail);

            if (error) throw error;

            alert("Password updated successfully!");
            window.location.reload();

            setShowResetModal(false);
            setNewPassword("");
            setResetEmail("");
        } catch (err) {
            console.log(err);
            alert("Error resetting password.");
        }
    };

    return (
        <div className="bg-gray-300 w-full h-screen flex items-center justify-center">
            <div className="bg-white flex flex-col px-4 pt-6 pb-8 min-w-[500px] rounded-2xl relative">
                <div className="flex items-center ml-6">
                    <img src="/images/main-logo.png" className="w-auto h-[100px]" alt="" />
                </div>
                <div className="flex flex-col w-[80%] mx-auto">
                    <h1 className="text-[32px] mb-10 text-center font-bold my-4 whitespace-nowrap">
                        Sign in to your account
                    </h1>
                    <label>Email Address</label>
                    <input
                        type="email"
                        value={username}
                        required
                        onChange={(e) => setUsername(e.target.value)}
                        className="h-10 mb-3 border-2 border-gray-300 rounded-sm mt-2 pl-2"
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-10 border-2 border-gray-300 rounded-sm mt-2 pl-2"
                    />
                    <button
                        onClick={handleLogin}
                        className="w-full h-[40px] bg-[#D33D5A] mt-5 text-white rounded-sm"
                    >
                        Login
                    </button>
                    <Link
                        to="/admin/register"
                        className="w-full h-[40px] bg-blue-400 mt-5 text-white rounded-sm text-center leading-[40px]"
                    >
                        Register
                    </Link>
                    <button
                        onClick={() => setShowResetModal(true)}
                        className="w-full h-[40px] bg-yellow-500 mt-5 text-white rounded-sm"
                    >
                        Reset Password
                    </button>
                </div>

                {/* Reset Password Modal */}
                {showResetModal && (
                    <div className="absolute top-0 left-0 w-full h-full  bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-xl w-[400px]">
                            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
                            <label>Email</label>
                            <input
                                type="email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="w-full border-2 border-gray-300 rounded-sm mt-2 mb-3 pl-2 h-10"
                            />
                            <label>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border-2 border-gray-300 rounded-sm mt-2 mb-3 pl-2 h-10"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowResetModal(false)}
                                    className="px-4 py-2 bg-gray-400 rounded text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleResetPassword}
                                    className="px-4 py-2 bg-green-600 rounded text-white"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLogin;
