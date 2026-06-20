import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase-client";

type ResetStatus = "checking" | "ready" | "invalid";

const MIN_PASSWORD_LENGTH = 6;

const getUrlParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));

    return { searchParams, hashParams };
};

const getResetUrlError = () => {
    const { searchParams, hashParams } = getUrlParams();

    return (
        searchParams.get("error_description") ||
        hashParams.get("error_description") ||
        searchParams.get("error") ||
        hashParams.get("error")
    );
};

const hasRecoveryParams = () => {
    const { searchParams, hashParams } = getUrlParams();

    return (
        searchParams.has("code") ||
        hashParams.get("type") === "recovery" ||
        hashParams.has("access_token") ||
        hashParams.has("refresh_token")
    );
};

const clearResetParams = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
};

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState<ResetStatus>("checking");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        let retryTimer: number | undefined;

        const markInvalid = (message = "Keçərsiz və ya vaxtı bitmiş reset linki.") => {
            if (!isMounted) return;
            setErrorMessage(message);
            setStatus("invalid");
        };

        const markReady = () => {
            if (!isMounted) return;
            clearResetParams();
            setStatus("ready");
        };

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === "PASSWORD_RECOVERY" || session) {
                    markReady();
                }
            }
        );

        const prepareResetSession = async () => {
            const urlError = getResetUrlError();

            if (urlError) {
                markInvalid(urlError);
                return;
            }

            const { searchParams } = getUrlParams();
            const code = searchParams.get("code");

            if (code) {
                const { error } = await supabase.auth.exchangeCodeForSession(code);

                if (error) {
                    markInvalid(error.message);
                    return;
                }
            }

            const { data, error } = await supabase.auth.getSession();

            if (error) {
                markInvalid(error.message);
                return;
            }

            if (data.session) {
                markReady();
                return;
            }

            if (!hasRecoveryParams()) {
                markInvalid();
                return;
            }

            retryTimer = window.setTimeout(async () => {
                const { data: retryData, error: retryError } =
                    await supabase.auth.getSession();

                if (retryError) {
                    markInvalid(retryError.message);
                    return;
                }

                if (retryData.session) {
                    markReady();
                    return;
                }

                markInvalid();
            }, 500);
        };

        prepareResetSession();

        return () => {
            isMounted = false;
            authListener.subscription.unsubscribe();

            if (retryTimer) {
                window.clearTimeout(retryTimer);
            }
        };
    }, []);

    const handleReset = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            alert(`Parol ən az ${MIN_PASSWORD_LENGTH} simvol olmalıdır!`);
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Parollar eyni deyil!");
            return;
        }

        setIsSubmitting(true);

        const { data: sessionData, error: sessionError } =
            await supabase.auth.getSession();

        if (sessionError || !sessionData.session) {
            setIsSubmitting(false);
            alert("Reset sessiyası tapılmadı. Linki yenidən açın.");
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            setIsSubmitting(false);
            alert("Xəta: " + error.message);
            return;
        }

        await supabase.auth.signOut();
        localStorage.removeItem("branch");
        alert("Parol uğurla dəyişdirildi!");
        navigate("/admin/login", { replace: true });
    };

    if (status === "checking") {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-300">
                Yüklənir...
            </div>
        );
    }

    if (status === "invalid") {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-300">
                <div className="bg-white p-8 rounded-xl w-[400px] max-w-[90vw]">
                    <h2 className="text-2xl font-bold mb-4">Reset linki keçərsizdir</h2>
                    <p className="text-gray-600 mb-6">{errorMessage}</p>
                    <button
                        onClick={() => navigate("/admin/login", { replace: true })}
                        className="w-full bg-[#D33D5A] text-white py-2 rounded"
                    >
                        Login səhifəsinə qayıt
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-300">
            <form onSubmit={handleReset} className="bg-white p-8 rounded-xl w-[400px] max-w-[90vw]">
                <h2 className="text-2xl font-bold mb-6">Yeni Parol Təyin Et</h2>
                <input
                    type="password"
                    placeholder="Yeni parol"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded p-2 mb-4"
                />
                <input
                    type="password"
                    placeholder="Yeni parolu təkrar daxil edin"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded p-2 mb-4"
                />
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white py-2 rounded"
                >
                    {isSubmitting ? "Yadda saxlanılır..." : "Təsdiqlə"}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
