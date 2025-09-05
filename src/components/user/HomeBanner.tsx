import {
  ArrowRight,
  BookOpen,
  Calendar,
  GraduationCap,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../utils/supabase-client";
import Cookies from "js-cookie";
import { ExamResult, TakenExams } from "../../types";

const HomeBanner = () => {
  const userId = Cookies.get("studentID");
  const [studentLevel, setStudentLevel] = useState<string | null>("");
  const [takenExams, setTakenExams] = useState<TakenExams | null>(null);
  const [, setResults] = useState<ExamResult[] | null>(null);
  const [resultScore, setResultScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from("students")
          .select("*")
          .eq("id", userId)
          .single();
        if (error) throw error;
        setStudentLevel(data.level);
        // setUserData(data)
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [userId]);


useEffect(() => {
  const fetchData = async () => {
    try {
      const studentId = localStorage.getItem("studentId");
      if (!studentId || !studentLevel) {
        console.warn("Missing studentId or studentLevel");
        return;
      }

      const { data, error } = await supabase
        .from("student_results")
        .select("*")
        .eq("student_id", studentId);

      if (error) throw error;

      // ✅ Filter by studentLevel
      const filteredData = data.filter(
        (result: ExamResult) => result.student_level === studentLevel
      );


      // ✅ Ensure uniqueness
      const uniqueData = filteredData.reduce(
        (acc: ExamResult[], current: ExamResult) => {
          if (!acc.some((item) => item.id === current.id)) {
            acc.push(current);
          }
          return acc;
        },
        []
      );

      setResults(uniqueData);

      if (uniqueData.length > 0) {
        setResultScore(
          Math.round(
            uniqueData.reduce(
              (total: number, item: ExamResult) => total + item.student_score,
              0
            ) / uniqueData.length
          )
        );
      }
    } catch (err) {
      console.error("Error fetching exam results:", err);
    }
  };

  fetchData();
}, [studentLevel]); // 👈 rerun when studentLevel is fetched


  useEffect(() => {
    const fetchExamsData = async () => {
      try {
        const { data, error } = await supabase
          .from("taken-exams")
          .select("*")
          .eq("student_id", userId)
          .single();

        if (error) throw Error;
        
        setTakenExams(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchExamsData();
  }, []);

  const stats = [
    {
      icon: BookOpen,
      bgColor: "bg-gradient-to-r from-indigo-400 to-purple-500",
      iconColor: "text-white",
      value: studentLevel?.toUpperCase(),
      label: "Your Level",
    },
    {
      icon: GraduationCap,
      bgColor: "bg-gradient-to-r from-rose-400 to-red-500",
      iconColor: "text-white",
      value: takenExams?.exam_count,
      label: "Taken Exams",
    },
    {
      icon: Users,
      bgColor: "bg-gradient-to-r from-amber-400 to-yellow-500",
      iconColor: "text-white",
      value: takenExams?.practice_count,
      label: "Taken Practice Exams",
    },
    {
      icon: Calendar,
      bgColor: "bg-gradient-to-r from-green-400 to-teal-500",
      iconColor: "text-white",
      value: resultScore,
      label: "GPA",
    },
  ];
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-100 opacity-70"></div>
        <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-rose-100 opacity-70"></div>
        <div className="absolute -bottom-20 right-1/3 w-80 h-80 rounded-full bg-amber-100 opacity-60"></div>
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            {/* <div className="inline-flex items-center px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 font-medium text-sm">
                            <span className="animate-pulse mr-2">●</span> Student Portal v2.0
                        </div> */}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              You Are Part
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">
                Of Our Family
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-xl">
              Access all your courses, assignments, and resources in one place.
              Designed to enhance your learning experience.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/news"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-200 group"
              >
                Go to News
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/locked-exams"
                className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Explore Exams
              </Link>
            </div>
          </div>

          {/* Right Column - Illustration */}
          <div className="relative ">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 pt-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center p-6 rounded-full shadow-xl bg-white hover:scale-105 transition-transform duration-300"
                >
                  <div
                    className={`w-16 h-16 rounded-full ${stat.bgColor} flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                  </div>
                  <p className="mt-4 text-3xl font-extrabold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-md text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          className="w-full h-auto"
        >
          <path
            fill="#F9FAFB"
            fillOpacity="1"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HomeBanner;
