"use client"


import HomeBanner from "../../components/user/HomeBanner"
import HomeFeatures from "../../components/user/HomeFeatures"
import NewsSection from "../../components/user/NewsSection"


const Home = () => {
 

    return (
        <div className="min-h-screen w-full bg-gray-50">
            {/* Hero Section */}
            <HomeBanner />
            {/* News Section */}
            <NewsSection />
            {/* Features Section */}
            <HomeFeatures />

        </div>
    )
}

export default Home
