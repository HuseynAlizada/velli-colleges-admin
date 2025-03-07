import { ArrowRight, BookOpen, Calendar, GraduationCap, Users } from "lucide-react"
import { Link } from "react-router-dom"


const HomeBanner = () => {
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
                            Access all your courses, assignments, and resources in one place. Designed to enhance your learning
                            experience.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-200 group"
                            >
                                Go to Dashboard
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                to="/courses"
                                className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                                Explore Courses
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">100+</p>
                                    <p className="text-sm text-gray-600">Courses</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-rose-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">50+</p>
                                    <p className="text-sm text-gray-600">Instructors</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">1000+</p>
                                    <p className="text-sm text-gray-600">Students</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">95%</p>
                                    <p className="text-sm text-gray-600">Success Rate</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Illustration */}
                    <div className="relative hidden lg:block">
                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-100 rounded-full"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-100 rounded-full"></div>

                        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                            <div className="h-12 bg-gray-100 flex items-center px-4 space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                <div className="ml-2 text-sm text-gray-500">Student Dashboard</div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-indigo-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-indigo-600 mb-1">Current Courses</h3>
                                        <p className="text-2xl font-bold">4</p>
                                    </div>
                                    <div className="bg-rose-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-rose-600 mb-1">Assignments</h3>
                                        <p className="text-2xl font-bold">12</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="h-8 bg-gray-100 rounded-md w-full"></div>
                                    <div className="h-8 bg-gray-100 rounded-md w-3/4"></div>
                                    <div className="h-8 bg-gray-100 rounded-md w-5/6"></div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                    <div className="w-24 h-8 bg-indigo-100 rounded-md"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wave Divider */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
                    <path
                        fill="#F9FAFB"
                        fillOpacity="1"
                        d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
                    ></path>
                </svg>
            </div>
        </section>
    )
}

export default HomeBanner