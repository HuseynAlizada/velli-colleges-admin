import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase-client";

const AdminRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  const branches = [
    { id: "hazi-aslanov", name: "Hazi Aslanov" },
    { id: "inqilab", name: "Inqilab" },
  ];

  // Mail linkindən gələndə session yoxla, emaili avtomatik doldur
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) {
        setEmail(data.session.user.email);
      }
      setReady(true);
    });
  }, []);

  const handleRegister = async () => {
    if (!password || !branch) {
      alert("Bütün sahələri doldurun!");
      return;
    }
    if (password.length < 6) {
      alert("Parol ən az 6 simvol olmalıdır!");
      return;
    }

    try {
      // 1. Parolu təyin et
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });
      if (updateError) throw updateError;

      // 2. admin_data-ya email və branch əlavə et
      const { error: dbError } = await supabase.from("admin_data").insert({
        email,
        branch,
        approved: false,
      });
      if (dbError) throw dbError;

      alert("Qeydiyyat uğurlu! Admin təsdiqindən sonra daxil ola bilərsiniz.");
      navigate("/admin/login");
    } catch (err: any) {
      alert("Xəta: " + err.message);
    }
  };

  if (!ready) return <div className="flex items-center justify-center h-screen">Yüklənir...</div>;

  return (
    <div className="bg-gray-300 w-full h-screen flex items-center justify-center">
      <div className="bg-white flex flex-col px-4 pt-6 pb-8 lg:w-[40%] sm:w-[60%] w-[90%] rounded-2xl">
        <div className="flex items-center ml-6">
          <img src="/images/main-logo.png" className="w-auto h-[100px]" alt="Logo" />
        </div>
        <div className="flex flex-col w-[80%] mx-auto">
          <h1 className="text-[32px] mb-10 text-center font-bold my-4">
            Register a new admin account
          </h1>
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            disabled
            className="h-10 mb-3 border-2 border-gray-200 bg-gray-100 rounded-sm mt-2 pl-2 cursor-not-allowed"
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 border-2 border-gray-300 rounded-sm mt-2 pl-2"
            placeholder="Yeni parol daxil edin"
          />
          <label className="block mt-4 mb-2 text-sm font-medium text-gray-700">
            Branch
          </label>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
            required
          >
            <option value="">Choose Branch</option>
            {branches.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
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
