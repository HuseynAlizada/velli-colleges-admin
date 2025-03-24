import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { supabase } from "../../utils/supabase-client";
import { adminData } from "../../types";

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userData, setUserData] = useState<adminData[] | null>(null)
    const navigate = useNavigate();


    useEffect(() => {

        (async () => {
            try {

                const { data, error } = await supabase
                    .from("admin_data")
                    .select("*")
                if (error) throw new Error
                console.log(data[0].email, 'data')

                setUserData(data)

            }
            catch (err) {
                console.log(err)
            }
        })()

    }, [])


    const handleLogin = () => {
        if (userData && username === userData[0].email && password === userData[0].password) {
            const token = btoa(`${username}:${password}`); // Encode as a mock JWT
            Cookies.set("token", token, { expires: 1 / 24 }); // Set cookie for 1 day
            navigate("/admin/dashboard"); // Redirect to admin page

        } else {
            alert("Invalid credentials!");
        }
    };

    return (
        <div className="bg-gray-300 w-full h-screen flex items-center justify-center">

            <div className="bg-white flex flex-col px-4 pt-6 pb-8  min-w-[500px] rounded-2xl">
                <div className="flex items-center ml-6 ">
                    <img src="/images/main-logo.png" className="w-auto h-[100px]" alt="" />

                </div>
                <div className="flex flex-col  w-[80%] mx-auto">
                    <h1 className="text-[32px] mb-10 text-center font-bold my-4 whitespace-nowrap">Sign in to your account
                    </h1>
                    <label htmlFor="">Email Address</label>
                    <input
                        type="email"
                        value={username}
                        required
                        onChange={(e) => setUsername(e.target.value)}
                        className="h-10 mb-3 border-2 border-gray-300 rounded-sm mt-2 pl-2"
                    />
                    <label htmlFor="">Password</label>

                    <input
                        type="text"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-10 border-2 border-gray-300 rounded-sm mt-2 pl-2"
                    />
                    <button onClick={handleLogin} className="w-full h-[40px] bg-[#D33D5A] mt-5 text-white rounded-sm">Login</button>
                    <Link to='/admin/register' className="w-full h-[40px] bg-blue-400 mt-5 text-white rounded-sm text-center leading-[40px]" >Register</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
