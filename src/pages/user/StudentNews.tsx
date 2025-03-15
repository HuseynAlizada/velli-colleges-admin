"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../utils/supabase-client"
import type { News } from "../../types"
import { Search, Calendar, ExternalLink, Loader2 } from "lucide-react"

const StudentNews = () => {
  const [news, setNews] = useState<News[] | null>(null)
  const [search, setSearch] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase.from("news").select("*")
        if (error) throw error
        setNews(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Failed to fetch news")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredNews = news?.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <main className="bg-gray-50 py-16 px-4 md:px-8 w-full">
      <div className="max-w-7xl mx-auto space-y-12">
        <section>
          {/* Header with Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 relative after:content-[''] after:absolute after:w-16 after:h-1 after:bg-rose-500 after:-bottom-2 after:left-0">
              NEWS & ARTICLES
            </h2>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-rose-500 animate-spin mb-4" />
              <p className="text-gray-600">Loading latest news...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* News Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNews && filteredNews.length > 0 ? (
                filteredNews.map((item) => (
                  <article
                    key={item.id}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative h-52 w-full overflow-hidden">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(item.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                      <p className="text-gray-600 line-clamp-3 mb-4 text-sm">{item.description}</p>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-rose-500 text-rose-500 rounded-full text-sm font-medium hover:bg-rose-500 hover:text-white transition-colors"
                      >
                        Learn more
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </article>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
                  <p className="text-gray-500 max-w-md">
                    We couldn't find any news articles matching your search. Try using different keywords or browse all
                    articles.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && news?.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No news articles yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                There are no news articles available at the moment. Please check back later.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default StudentNews

