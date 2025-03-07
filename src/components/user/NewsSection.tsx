import { useEffect, useState } from 'react'
import { supabase } from "../../utils/supabase-client"
import { news } from "../../types"
import { ArrowRight, Calendar, Loader2 } from "lucide-react"

import { Link } from "react-router-dom"

const NewsSection = () => {

    const [news, setNews] = useState<news[] | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)



    useEffect(() => {
        const getNews = async () => {
            try {
                setIsLoading(true)
                const { data, error } = await supabase.from("news").select("*")
                if (error) throw error
                setNews(data.slice(0, 4))
            }
            catch (err: any) {
                console.error(err)
                setError(err.message || "Failed to fetch news")
            }
            finally {
                setIsLoading(false)
            }
        }

        getNews()
    }, []) // Removed news dependency to prevent infinite loop

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 relative">
                        <span className="relative z-10">Latest News & Articles</span>
                        <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-rose-500"></span>
                    </h2>
                    <Link
                        to="/news"
                        className="flex items-center gap-2 text-rose-500 hover:text-rose-600 transition-colors font-medium"
                    >
                        View All
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {!isLoading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {news && news.map((item) => (
                            <article
                                key={item.id}
                                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="relative h-52 overflow-hidden">
                                    <img
                                        src={item.image_url || "/placeholder.svg"}
                                        alt={item.title}
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                        <Calendar className="w-4 h-4" />
                                        <time dateTime={item.created_at}>
                                            {new Date(item.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </time>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-rose-500 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                                        {item.description}
                                    </p>
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-rose-500 font-medium hover:text-rose-600 transition-colors group/link"
                                    >
                                        Learn more
                                        <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default NewsSection