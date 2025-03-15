import type React from "react";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LoginSlider from "../../components/user/LoginSlider";
import "../../i18n";
import { useTranslation } from "react-i18next";
import england from "/images/england-flag.png";
import azerbaijan from "/images/azerbaijan.png";
import russian from "/images/russia.png";
import { motion } from "framer-motion";
import { supabase } from "../../utils/supabase-client";
import { Link, useNavigate } from "react-router-dom";

export default function UserLogin() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const languages = [
    { code: "en", flag: england, name: "En" },
    { code: "az", flag: azerbaijan, name: "Az" },
    { code: "ru", flag: russian, name: "Ru" },
  ];

  const [selectedLang, setSelectedLang] = useState(i18n.language);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeLanguageItem = (code: string) => {
    i18n.changeLanguage(code);
    setSelectedLang(code);
    setIsOpen(false);
  };

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from("students").select("*");
        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        alert(t("unexpectedError"));
      }
    };
    fetchUsers();
  }, [t]);

  // Check for existing cookie and redirect
  useEffect(() => {
    const studentID = Cookies.get("studentID");
    if (studentID) {
      console.log("Existing studentID found:", studentID);
      navigate("/news");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = users.find((u) => u.email === email && u.password === password);
      if (!user) {
        console.error("Login error: No matching user found");
        alert(t("loginFailed"));
        setLoading(false);
        return;
      }

      console.log("Logged in:", { email, userId: user.id });
      Cookies.set("studentID", user.id, { expires: 1, secure: true, sameSite: "Strict" });
      console.log("Cookie set, navigating to /news");
      navigate("/news", { replace: true }); // Replace prevents back navigation to login
    } catch (err) {
      console.error("Unexpected error:", err);
      alert(t("unexpectedError"));
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-rose-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl overflow-hidden w-full max-w-5xl flex shadow-xl h-[600px]">
        {/* Left Image Section */}
        <div className="w-1/2 relative hidden md:block p-10">
          <div className="w-full h-full rounded-2xl">
            <LoginSlider />
          </div>
        </div>

        {/* Right Content Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="flex justify-between items-center mb-4">
            {/* Company Logo */}
            <div className="w-[220px] h-[100px] -ml-7">
              <img src="/images/main-logo.png" className="w-full h-full" alt="Logo" />
            </div>

            {/* Language Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-md shadow-md"
                onClick={() => setIsOpen(!isOpen)}
              >
                <img
                  src={languages.find((lang) => lang.code === selectedLang)?.flag}
                  alt=""
                  className="w-5 h-5"
                />
                {selectedLang.toUpperCase()}
              </button>

              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-2 bg-white border border-gray-200 shadow-md rounded-md w-full"
                >
                  {languages.map(({ code, flag, name }, index) => (
                    <button
                      key={code}
                      className={`flex items-center gap-2 p-2 hover:bg-gray-200 w-full ${index === 2 && "rounded-b-md"} ${index === 0 && "rounded-t-md"}`}
                      onClick={() => changeLanguageItem(code)}
                    >
                      <img src={flag} alt={name} className="w-5 h-5" />
                      {name}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{t("title")}</h1>
              <p className="text-gray-600">{t("description")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="">{t("email")}</label>
                  <input
                    id="email"
                    type="email"
                    placeholder={t("emailText")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 mt-2 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="password" className="">{t("password")}</label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 mt-3.5 -translate-y-1/2 text-gray-500"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOffIcon className="w-5 h-5" /> : <VisibilityIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link to="/forgot-password" className="text-blue-600 hover:underline text-sm">
                  {t("forgotPassword")}
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-500 transition-colors disabled:bg-gray-400"
                disabled={loading || users.length === 0}
              >
                {loading ? t("loggingIn") : t("login")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}