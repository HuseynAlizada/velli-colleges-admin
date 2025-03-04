
// Levels type start
export interface levels {
    id: number,
    created_at: string,
    name: string,
    description: string
}

export interface levelModal {
    closePopUp: () => void,
    getLevels: () => void,
    editLevelData: levels | null
}


// Levels type end









// News type start

export interface news {
    created_at: string,
    description: string,
    id:number,
    image_url:string,
    link:string,
    title:string
}



export interface Podcast {
    id: number
    title: string
    description: string
    duration: string
    author: string
    image: string
}


export interface NewsItem {
    id: number
    title: string
    author: string
    date: string
    image: string
}

// News type end






// Exams type start

export interface Exam{
    id:number,
    title:string,
    file_url:string,
    pass_score:number,
    total_score:number,
    duration:number,
    level:string
}


// Exams type end








