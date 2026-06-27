"use client"


import HomeBanner from "../../components/user/HomeBanner"
import HomeFeatures from "../../components/user/HomeFeatures"


const Home = () => {


    return (
        <div className="min-h-screen w-full bg-gray-50">
            {/* Hero Section */}
            <HomeBanner />
            {/* Features Section */}
            <HomeFeatures />

        </div>
    )
}

export default Home
