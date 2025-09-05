"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Award,
  Calendar,
  ArrowRight,
  Lock,
} from "lucide-react";
import {  useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { supabase } from "../../utils/supabase-client";

interface PracticeExamCardProps {
  id?: number;
  title?: string;
  level?: string;
  duration?: number;
  pass_score?: number;
  created_at?: string;
  exam_file?: string;
  password?: string; // add this if stored in db
  onStartExam?: (examId: number) => void;
}

const PracticeExamCard = ({
  exam,
  index,
}: {
  exam: PracticeExamCardProps;
  index: number;
}) => {
  const { title, level, duration, pass_score, created_at, id } = exam;
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");
  const [correctPassword, setCorrectPassword] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from("admin_data").select("*");
        if (error) throw new Error();

                setCorrectPassword(data[0].password)
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // Format date
  const formattedDate = new Date(
    created_at ? format(new Date(created_at), "MMM d, yyyy") : "Unknown date"
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });


  const handleStartClick = () => {
    setIsModalOpen(true);
    setInputPassword("");
    setError("");
  };

  const handleSubmitPassword = () => {
    if (inputPassword === correctPassword) {
      navigate(`${id}`);
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const colors = getLevelColors(level || "A2");

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} shadow-sm hover:shadow-md transition-all duration-300`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Level Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div
            className={`px-3 py-1 rounded-full ${colors.accent} text-white text-sm font-medium`}
          >
            {level}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {title} - Unit {index + 1}
            </h3>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <ExamDetail
                icon={<Clock className={`w-4 h-4 ${colors.icon}`} />}
                label="Duration"
                value={`${duration} hour`}
                accent={colors.accent}
              />
              <ExamDetail
                icon={<Award className={`w-4 h-4 ${colors.icon}`} />}
                label="Pass Score"
                value={`${pass_score}%`}
                accent={colors.accent}
              />
            </div>

            {/* Difficulty */}
            <DifficultyBar level={level || "A2"} colors={colors} />

            {/* Date */}
            <div className="flex items-center gap-2 mb-6 text-gray-500 text-sm">
              <Calendar className="w-4 h-4" />
              <span>Created on {formattedDate}</span>
            </div>

            {/* Start Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartClick}
              className={`mt-auto w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 ${colors.button} transition-all duration-300`}
            >
              <BookOpen className="w-5 h-5" />
              Start Practice Exam
              <motion.div
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock /> Password Needed
            </h2>
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring focus:border-blue-500"
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPassword}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Reusable subcomponents for clarity
const ExamDetail = ({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center ${accent} bg-opacity-20`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

const DifficultyBar = ({ level, colors }: { level: string; colors: any }) => {
  const getLevelDifficulty = (level: string): string => {
    const difficulties = {
      A1: "Beginner",
      A2: "Elementary",
      B1: "Intermediate",
      B2: "Upper Intermediate",
      C1: "Advanced",
      C2: "Proficient",
    };
    return difficulties[level as keyof typeof difficulties] || "Unknown";
  };

  const getLevelPercentage = (level: string): number => {
    const percentages = {
      A1: 16.7,
      A2: 33.4,
      B1: 50,
      B2: 66.7,
      C1: 83.4,
      C2: 100,
    };
    return percentages[level as keyof typeof percentages] || 33.4;
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs text-gray-500">Difficulty Level</p>
        <p className="text-xs font-medium text-gray-700">
          {getLevelDifficulty(level)}
        </p>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors.accent}`}
          style={{ width: `${getLevelPercentage(level)}%` }}
        />
      </div>
    </div>
  );
};

const getLevelColors = (level: string) => {
  const colorSchemes = {
    A1: {
      bg: "from-green-50 to-emerald-100",
      border: "border-green-200",
      accent: "bg-green-200",
      text: "text-green-700",
      button: "bg-green-500 hover:bg-green-600",
      icon: "text-green-500",
    },
    A2: {
      bg: "from-blue-50 to-sky-100",
      border: "border-blue-200",
      accent: "bg-blue-200",
      text: "text-blue-700",
      button: "bg-blue-500 hover:bg-blue-600",
      icon: "text-blue-500",
    },
    B1: {
      bg: "from-indigo-50 to-violet-100",
      border: "border-indigo-200",
      accent: "bg-indigo-200",
      text: "text-indigo-700",
      button: "bg-indigo-500 hover:bg-indigo-600",
      icon: "text-indigo-500",
    },
    B2: {
      bg: "from-purple-50 to-fuchsia-100",
      border: "border-purple-200",
      accent: "bg-purple-200",
      text: "text-purple-700",
      button: "bg-purple-500 hover:bg-purple-600",
      icon: "text-purple-500",
    },
    C1: {
      bg: "from-amber-50 to-yellow-100",
      border: "border-amber-200",
      accent: "bg-amber-200",
      text: "text-amber-700",
      button: "bg-amber-500 hover:bg-amber-600",
      icon: "text-amber-500",
    },
    C2: {
      bg: "from-rose-50 to-pink-100",
      border: "border-rose-200",
      accent: "bg-rose-200",
      text: "text-rose-700",
      button: "bg-rose-500 hover:bg-rose-600",
      icon: "text-rose-500",
    },
  };
  return colorSchemes[level as keyof typeof colorSchemes] || colorSchemes["A2"];
};

export default PracticeExamCard;
