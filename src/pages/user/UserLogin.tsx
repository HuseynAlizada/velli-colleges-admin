import type React from "react";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../../i18n";
import { useTranslation } from "react-i18next";
import england from "/images/england-flag.png";
import azerbaijan from "/images/azerbaijan.png";
import russian from "/images/russia.png";
import { motion } from "framer-motion";
import { supabase } from "../../utils/supabase-client";
import { useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";

interface Student {
    id: string; // Adjust to number if your schema uses numeric IDs
    email: string;
    password: string;
}

export default function UserLogin() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<Student[]>([]);

    const languages = [
        { code: "en", flag: england, name: "En" },
        { code: "az", flag: azerbaijan, name: "Az" },
        { code: "ru", flag: russian, name: "Ru" },
    ];

    const [selectedLang, setSelectedLang] = useState(i18n.language);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const changeLanguageItem = (code: string) => {
        i18n.changeLanguage(code);
        setSelectedLang(code);
        setIsOpen(false);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data, error } = await supabase.from("students").select("*");
                if (error) throw error;
                setUsers(data as Student[] || []);
            } catch (err) {
                console.error("Error fetching users:", err);
                alert(t("unexpectedError"));
            }
        };
        fetchUsers();
    }, [t]);

    useEffect(() => {
        const studentID = Cookies.get("studentID");
        if (studentID) {
            navigate("/");
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

            Cookies.set("studentID", user.id, { expires: 1, secure: true, sameSite: "Strict" });
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Unexpected error:", err);
            alert(t("unexpectedError"));
        } finally {
            setLoading(false);
        }
    };

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
        <div className="min-h-screen bg-[#f4f7ff] p-3 text-[#11184F] md:p-5">
            <div className="grid min-h-[calc(100vh-24px)] overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-[0_28px_80px_rgba(17,24,79,0.12)] md:min-h-[calc(100vh-40px)] lg:grid-cols-[1.08fr_0.92fr]">
                <div className="relative hidden overflow-hidden lg:block">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('/images/login-image.jpg')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#11184F]/88 via-[#11184F]/38 to-[#487ACB]/20" />
                    <div className="absolute left-8 top-8 flex h-20 w-56 items-center justify-center rounded-3xl bg-white/92 px-5 shadow-[0_18px_50px_rgba(17,24,79,0.20)] backdrop-blur">
                        <img src="/images/velli-logo.png" className="h-full w-full object-contain" alt="Velli Logo" />
                    </div>
                    <div className="absolute bottom-8 left-8 right-8 rounded-[28px] border border-white/24 bg-white/16 p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                        <p className="text-sm font-medium text-white/72">Velli School</p>
                        <h2 className="mt-2 max-w-md text-4xl font-semibold leading-tight">Learning space</h2>
                    </div>
                </div>

                <div className="relative flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:min-h-0">
                    <div className="absolute right-5 top-5 z-20" ref={dropdownRef}>
                        <button
                            type="button"
                            className="flex h-11 items-center gap-2 rounded-2xl border border-[#84A3F9]/35 bg-white px-3 text-sm font-semibold text-[#11184F] shadow-[0_12px_32px_rgba(72,122,203,0.14)] transition hover:bg-[#84A3F9]/10"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <img
                                src={languages.find((lang) => lang.code === selectedLang)?.flag}
                                alt=""
                                className="h-5 w-5 rounded-full object-cover"
                            />
                            {selectedLang.toUpperCase()}
                        </button>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.18 }}
                                className="absolute right-0 mt-2 w-28 overflow-hidden rounded-2xl border border-[#84A3F9]/30 bg-white shadow-[0_18px_42px_rgba(17,24,79,0.14)]"
                            >
                                {languages.map(({ code, flag, name }) => (
                                    <button
                                        key={code}
                                        type="button"
                                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[#11184F] transition hover:bg-[#84A3F9]/12"
                                        onClick={() => changeLanguageItem(code)}
                                    >
                                        <img src={flag} alt={name} className="h-5 w-5 rounded-full object-cover" />
                                        {name}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    <div className="w-full max-w-[430px]">
                        <div className="mb-8 flex justify-center lg:hidden">
                            <img src="/images/velli-logo.png" className="h-24 w-auto object-contain" alt="Velli Logo" />
                        </div>

                        <div className="rounded-[30px] border border-[#84A3F9]/25 bg-white/86 p-6 shadow-[0_28px_70px_rgba(17,24,79,0.10)] backdrop-blur sm:p-8">
                            <div className="mb-8">
                                <p className="mb-3 inline-flex rounded-full bg-[#84A3F9]/14 px-3 py-1 text-xs font-semibold text-[#487ACB]">
                                    Student portal
                                </p>
                                <h1 className="text-3xl font-bold tracking-normal text-[#11184F]">{t("title")}</h1>
                                <p className="mt-2 text-sm leading-6 text-gray-500">{t("description")}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-semibold text-[#11184F]">{t("email")}</label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#487ACB]" />
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder={t("emailText")}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-[52px] w-full rounded-2xl border border-[#84A3F9]/35 bg-[#f8faff] py-3 pl-12 pr-4 text-[#11184F] outline-none transition focus:border-[#487ACB] focus:bg-white focus:ring-4 focus:ring-[#84A3F9]/20"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-semibold text-[#11184F]">{t("password")}</label>
                                    <div className="relative">
                                        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#487ACB]" />
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-[52px] w-full rounded-2xl border border-[#84A3F9]/35 bg-[#f8faff] py-3 pl-12 pr-12 text-[#11184F] outline-none transition focus:border-[#487ACB] focus:bg-white focus:ring-4 focus:ring-[#84A3F9]/20"
                                            required
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#11184F]"
                                            disabled={loading}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <VisibilityOffIcon className="h-5 w-5" /> : <VisibilityIcon className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#11184F] px-5 py-3 font-semibold text-white shadow-[0_18px_42px_rgba(17,24,79,0.24)] transition hover:bg-[#487ACB] disabled:bg-gray-400"
                                    disabled={loading || users.length === 0}
                                >
                                    {loading ? t("loggingIn") : t("login")}
                                    <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
