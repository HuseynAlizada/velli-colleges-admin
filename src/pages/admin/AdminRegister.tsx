import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase-client";

const AdminRegister = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        // Basic validation
        if (!email || !password) {
            alert("Please fill in both email and password!");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            alert("Please enter a valid email address!");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters long!");
            return;
        }

        // Simulate registration by storing credentials in a cookie
        // const token = btoa(`${email}:${password}`); // Encode as a mock JWT
        // Cookies.set("registeredAdmin", token, { expires: 7 }); // Set cookie for 7 days
        alert("Registration successful! Please log in.");
        navigate("/admin/login"); // Redirect to login page

        try {
            const { error } = await supabase.from("admin_data")
                .insert({
                    email,
                    password
                })
            if (error) throw error
            alert("Registration successful! Please log in.");
            navigate("/admin/login"); // Redirect to login page
        }
        catch (err) {
            console.log(err);

        }

    };

    return (
        <div className="bg-gray-300 w-full h-screen flex items-center justify-center">
            <div className="bg-white flex flex-col px-4 pt-6 pb-8 lg:w-[40%] sm:w-[60%] w-[90%] rounded-2xl ">
                <div className="flex items-center ml-6">
                    <img src="/images/main-logo.png" className="w-auto h-[100px]" alt="Logo" />
                </div>
                <div className="flex flex-col w-[80%] mx-auto">
                    <h1 className="text-[32px] mb-10 text-center font-bold my-4 ">
                        Register a new admin account
                    </h1>
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-10 mb-3 border-2 border-gray-300 rounded-sm mt-2 pl-2"
                        placeholder="Enter your email"
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password" // Changed to password type for security
                        id="password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-10 border-2 border-gray-300 rounded-sm mt-2 pl-2"
                        placeholder="Enter your password"
                    />
                    <button
                        onClick={handleRegister}
                        className="w-full h-[40px] bg-[#D33D5A] mt-5 text-white rounded-sm"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminRegister;