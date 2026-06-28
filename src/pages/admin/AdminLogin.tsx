import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase-client";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(132,163,249,0.24),transparent_34%),linear-gradient(180deg,#f7f9ff_0%,#ffffff_56%,#eef3ff_100%)] p-3 text-[#11184F] md:p-5">
      <div className="grid min-h-[calc(100vh-24px)] overflow-hidden rounded-[34px] border border-white bg-white/78 shadow-[0_28px_80px_rgba(17,24,79,0.12)] backdrop-blur md:min-h-[calc(100vh-40px)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex items-center justify-center px-5 py-10 sm:px-8">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleLogin();
            }}
            className="w-full max-w-[430px] rounded-[30px] border border-[#84A3F9]/24 bg-white p-6 shadow-[0_24px_64px_rgba(17,24,79,0.10)] sm:p-8"
          >
            <div className="mb-8 flex justify-center rounded-[26px] border border-[#84A3F9]/24 bg-[#f8faff] px-5 py-5">
              <img
                src="/images/velli-logo.png"
                className="h-24 w-auto object-contain"
                alt="Velli Logo"
              />
            </div>

            <div className="mb-8">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#84A3F9]/35 bg-[#84A3F9]/12 px-3 py-1 text-xs font-semibold text-[#487ACB]">
                <ShieldCheck className="h-4 w-4" />
                Admin panel
              </p>
              <h1 className="text-3xl font-bold tracking-normal text-[#11184F]">
                Welcome back
              </h1>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="admin-email" className="text-sm font-semibold text-[#11184F]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#487ACB]" />
                  <input
                    id="admin-email"
                    type="email"
                    value={username}
                    required
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-[52px] w-full rounded-2xl border border-[#84A3F9]/35 bg-[#f8faff] py-3 pl-12 pr-4 text-[#11184F] outline-none transition focus:border-[#487ACB] focus:bg-white focus:ring-4 focus:ring-[#84A3F9]/18"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="admin-password" className="text-sm font-semibold text-[#11184F]">
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#487ACB]" />
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-[52px] w-full rounded-2xl border border-[#84A3F9]/35 bg-[#f8faff] py-3 pl-12 pr-12 text-[#11184F] outline-none transition focus:border-[#487ACB] focus:bg-white focus:ring-4 focus:ring-[#84A3F9]/18"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#11184F]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#11184F] font-bold text-white shadow-[0_18px_42px_rgba(17,24,79,0.22)] transition hover:bg-[#487ACB]"
              >
                Login
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        </div>

        <div className="relative hidden overflow-hidden lg:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/login-image.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#11184F]/72 via-[#487ACB]/20 to-[#84A3F9]/10" />
          <div className="relative flex h-full flex-col justify-between p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/92 text-[#11184F] shadow-[0_16px_34px_rgba(17,24,79,0.18)] backdrop-blur">
                <ShieldCheck className="h-8 w-8" />
            </div>

            <div className="rounded-[30px] border border-white/24 bg-white/16 p-7 text-white shadow-[0_28px_70px_rgba(0,0,0,0.20)] backdrop-blur-xl">
              <p className="text-sm font-semibold text-white/78">Velli School</p>
              <h2 className="mt-2 max-w-md text-4xl font-semibold leading-tight">
                Management workspace
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
