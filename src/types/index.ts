
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

