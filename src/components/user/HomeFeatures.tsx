import { useEffect, useState } from "react"
import { Book, ClipboardList, Megaphone, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import InstagramIcon from '@mui/icons-material/Instagram';

const HomeFeatures = () => {


    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 },
        )

        const element = document.getElementById("features-section")
        if (element) {
            observer.observe(element)
        }

        return () => {
            if (element) {
                observer.unobserve(element)
            }
        }
    }, [])
    return (
        <section id="features-section" className="relative py-2 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-64 h-64 bg-rose-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4">
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {/* Online Courses */}
                    <div
                        className={`transform transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                            }`}
                    >
                        <div className="group relative bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                            <div className="absolute top-0 right-0 -mt-4 mr-4 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>

                            <div className="relative">
                                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Book className="w-7 h-7 text-blue-600 group-hover:rotate-[-10deg] transition-transform duration-300" />
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Online Exams</h3>
                                <p className="text-gray-600 mb-6">
                                    Access all your exams online with interactive content and resources.
                                </p>

                                <Link
                                    to="/locked-exams"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group/link"
                                >
                                    Explore Level exams
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Assignments */}
                    <div
                        className={`transform transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                            }`}
                    >
                        <div className="group relative bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                            <div className="absolute top-0 right-0 -mt-4 mr-4 w-20 h-20 bg-rose-500/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>

                            <div className="relative">
                                <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <ClipboardList className="w-7 h-7 text-rose-600 group-hover:rotate-[-10deg] transition-transform duration-300" />
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Assignments</h3>
                                <p className="text-gray-600 mb-6">
                                    Submit assignments online and receive feedback from your instructors.
                                </p>

                                <Link
                                    to="/practice-exam"
                                    className="inline-flex items-center text-rose-600 hover:text-rose-700 font-medium group/link"
                                >
                                    View Practice Exams
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Announcements */}
                    <div
                        className={`transform transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                            }`}
                    >
                        <div className="group relative bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                            <div className="absolute top-0 right-0 -mt-4 mr-4 w-20 h-20 bg-yellow-500/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>

                            <div className="relative">
                                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Megaphone className="w-7 h-7 text-yellow-600 group-hover:rotate-[-10deg] transition-transform duration-300" />
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 mb-3">News</h3>
                                <p className="text-gray-600 mb-6">Stay updated with the latest news from your institution.</p>

                                <Link
                                    to="/news"
                                    className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium group/link"
                                >
                                    View news
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div
                    className={`relative rounded-3xl overflow-hidden transition-all duration-1000 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                        }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-600"></div>
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>

                    <div className="relative px-8 py-16 md:py-16 text-center">
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 [text-wrap:balance]">
                            Visit our website to stay updated with the latest news.
                        </h2>
                        <p className="text-white/90 md:text-lg text-md mb-8 max-w-2xl mx-auto">
                            Join thousands of students who are already using our platform to achieve their academic goals.
                        </p>
                        <div className="flex items-center gap-3 justify-center">
                            <a
                                href="https://familyschool.az/"
                                target="_blank"
                                className="inline-flex items-center gap-2 bg-white text-rose-600 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors group"
                            >
                                Visit Website
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </a>
                            <a
                                target="_blank"
                                href="https://www.instagram.com/familyschool.az/"
                                className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-full font-medium hover:bg-rose-700 transition-colors"
                            >
                                <InstagramIcon />
                            </a>
                        </div>
                        <div className="flex flex-col  justify-center items-center gap-2 mt-3 text-white">

                            <div>
                                Number: +994 (55) 430 12 13
                            </div>
                            {/* <div>
                                Location: Hesen Eliyev 212A. Kovaa Plaza 3-cü mərtəbə, Bakı
                            </div> */}
                             <div>
                                Location: Hesen Eliyev 212A 
                            </div>
                        </div>
                    </div>



                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-rose-400/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl"></div>
                </div>
            </div>
        </section>
    )
}

export default HomeFeatures