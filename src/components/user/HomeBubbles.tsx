"use client"

import { motion } from "framer-motion"
import { BookOpen, GraduationCap, Users, Calendar } from "lucide-react"

interface StudentStatsProps {
  studentLevel?: string
  takenExams?: {
    exam_count: number
    practice_count: number
  }
  fullScoreCount?: number
}

export default function HomeBubbles({
  studentLevel = "B1",
  takenExams = { exam_count: 0, practice_count: 0 },
  fullScoreCount = 0,
}: StudentStatsProps) {
  const stats = [
    {
      icon: <BookOpen className="w-6 h-6 text-white" />,
      value: studentLevel?.toUpperCase() || "N/A",
      label: "Your Level",
      color: "from-[#11184F] to-[#487ACB]",
      shadowColor: "shadow-[#84A3F9]/40",
      delay: 0,
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-white" />,
      value: takenExams?.exam_count.toString() || "0",
      label: "Taken Exams",
      color: "from-[#11184F] to-[#487ACB]",
      shadowColor: "shadow-[#84A3F9]/40",
      delay: 0.1,
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      value: takenExams?.practice_count.toString() || "0",
      label: "Practice Exams",
      color: "from-[#84A3F9] to-[#487ACB]",
      shadowColor: "shadow-[#84A3F9]/40",
      delay: 0.2,
    },
    {
      icon: <Calendar className="w-6 h-6 text-white" />,
      value: fullScoreCount?.toString() || "0",
      label: "Full Score Count",
      color: "from-green-400 to-emerald-600",
      shadowColor: "shadow-green-200",
      delay: 0.3,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: stat.delay,
            duration: 0.5,
            type: "spring",
            stiffness: 100,
          }}
          className="relative"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} ${stat.shadowColor} shadow-lg p-5`}
          >
            {/* Bubble decorations */}
            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-white opacity-30"></div>
            <div className="absolute top-4 right-6 w-2 h-2 rounded-full bg-white opacity-20"></div>
            <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full bg-white opacity-10"></div>

            {/* Glass overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

            {/* Content */}
            <div className="relative z-10 flex items-center gap-4">
              {/* Icon bubble */}
              <motion.div
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                animate={{ y: [0, -5, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  duration: 2 + stat.delay,
                  ease: "easeInOut",
                }}
              >
                {stat.icon}
              </motion.div>

              {/* Text */}
              <div>
                <motion.p
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: stat.delay + 0.2, duration: 0.3 }}
                >
                  {stat.value}
                </motion.p>
                <motion.p
                  className="text-sm text-white/80"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: stat.delay + 0.3, duration: 0.3 }}
                >
                  {stat.label}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

