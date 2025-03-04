import { useEffect, useState } from "react"
import { supabase } from "../../utils/supabase-client"
import { news } from "../../types"

const StudentNews = () => {
    const [news, setNews] = useState<news[] | null>(null)
    const [search, setSearch] = useState<string | null>(null)

    useEffect(() => {

        const fetchData = async () => {
            try {
                const { data, error } = await supabase.from('news').select("*")
                if (error) throw error
                setNews(data)
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchData()
    }, [])
    const filteredNews = news?.filter((item) =>
        item.title.toLowerCase().includes(search?.toLowerCase() || "")
    );
    return (
        <main className=" bg-gray-50 py-8 px-4 md:px-6">
            <div className="max-w-7xl mx-auto space-y-12">
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900"> NEWS & ARTICLES
                            <input type="text" placeholder="Search..." onChange={(e) => setSearch(e.target.value)} className="ml-3 text-md font-normal pl-4 border-2 border-gray-300 rounded-xl outline-0" />
                        </h2>
                        {/* <Link to="/news" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                            View All
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6 12L10 8L6 4"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </Link> */}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredNews && filteredNews.map((item) => (
                            <article
                                key={item.id}
                                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="relative h-48 w-full">
                                    <img src={item.image_url || "/placeholder.svg"} alt={item.title} className="object-cover w-full h-full" />
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                        <span>Date</span>
                                        <span>—</span>
                                        <span>{item.created_at.split("T")[0]}</span>
                                    </div>
                                    <h3>{item.title}</h3>
                                    <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">{item.description}</h3>
                                    <a href={item.link} className="border-1 border-[#D33D5A] text-[#D33D5A] px-4 py-1 mt-3 inline-block rounded-2xl">Learn more</a>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">PODCASTS</h2>
                        <Link to="#" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                            View All
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6 12L10 8L6 4"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {podcasts.map((podcast) => (
                            <article
                                key={podcast.id}
                                className="group flex gap-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="relative h-24 w-24 flex-shrink-0">
                                    <img
                                        src={podcast.image || "/placeholder.svg"}
                                        alt={podcast.title}
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">{podcast.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{podcast.description}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                                        <span>{podcast.duration}</span>
                                        <span>—</span>
                                        <span>{podcast.author}</span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section> */}
            </div>
        </main>
    )
}

export default StudentNews