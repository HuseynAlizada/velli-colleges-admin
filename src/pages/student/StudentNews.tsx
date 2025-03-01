import { useEffect, useState } from "react"
import { supabase } from '../../utils/supabase-client'

const StudentNews = () => {

    const [news, setNews] = useState([])

    useEffect(() => {

        const fetchNews = async () => {
            const { data, error } = await supabase.from('news').select("*")
            if (error) {
                console.log('There have a problem on fetch');

            }
            setNews(data)
        }

        fetchNews()

    }, [])

    return (
        <div>
            {news.map(item => (
                <div>
                    <img src={item.image_url} style={{ width: '200px', height: "200px" }} />
                    <h1>{item.title}</h1>
                    <h3>{item.description}</h3>
                    <a href={item.link} />
                </div>
            ))}
        </div>
    )
}

export default StudentNews