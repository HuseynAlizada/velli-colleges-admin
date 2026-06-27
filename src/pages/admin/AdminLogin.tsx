import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase-client";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const email = username.trim();

    const { data, error } = await supabase
      .from("admin_users")
      .select("id,email,password,approved")
      .eq("email", email)
      .eq("password", password)
      .maybeSingle();

    if (error || !data) {
      console.log("Login error:", error);
      alert("Invalid credentials!");
      return;
    }

    if (data.approved === false) {
      alert("Admin user is not approved!");
      return;
    }

    localStorage.setItem(
      "adminUser",
      JSON.stringify({ id: data.id, email: data.email })
    );
    navigate("/admin/dashboard");
  };

  return (
    <div className="bg-gradient-to-br from-[#11184F] via-[#487ACB] to-[#84A3F9] w-full h-screen flex items-center justify-center">
      <div className="bg-white flex flex-col px-4 pt-6 pb-8 min-w-[500px] rounded-2xl relative shadow-2xl">
        <div className="flex items-center ml-6">
          <img
            src="/images/velli-logo.png"
            className="w-auto h-[100px]"
            alt="Velli Logo"
          />
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
            className="h-10 mb-3 border-2 border-gray-300 rounded-sm mt-2 pl-2 focus:outline-none focus:ring-2 focus:ring-[#487ACB] focus:border-transparent"
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 border-2 border-gray-300 rounded-sm mt-2 pl-2 focus:outline-none focus:ring-2 focus:ring-[#487ACB] focus:border-transparent"
          />
          <button
            onClick={handleLogin}
            className="w-full h-[40px] bg-[#11184F] hover:bg-[#487ACB] mt-5 text-white rounded-sm transition-colors"
          >
            Login
          </button>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
