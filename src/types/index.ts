import { CSSProperties, JSX } from "react"

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
    id: number,
    image_url: string,
    link: string,
    title: string
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
export interface Exam {
    created_at?: string | undefined,
    id: number,
    title?: string,
    file_url: string,
    pass_score: number,
    total_score: number,
    duration: number,
    level?: string,
    exam_file?:string
}


export type ExamStyles = {
    container: CSSProperties;
    header: CSSProperties;
    subHeader: CSSProperties;
    examContainer: CSSProperties;
    questionBlock: CSSProperties;
    questionText: CSSProperties;
    optionsContainer: CSSProperties;
    option: CSSProperties;
    correctAnswer: CSSProperties;
    loading: CSSProperties;
    error: CSSProperties;
    noData: CSSProperties;
};

// Exams type end





// Admin Menu Start
export interface AdminMenu {
    id: number,
    icon: JSX.Element
    title: string,
    link?: string,
    subMenu?: {
        id: number,
        title: string,
        link: string,
        icon?: JSX.Element
    }[]
}
// Admin Menu End



// Student Start
export interface StudentData {
    created_at: string,
    email: string
    id: number
    level: string
    name: string
    parent_name: string
    parent_phone: string
    password: string
    phone: string,
    image_url?: string,
    student_school?: string,
    student_purpose?: string
}
// Student End







// Colors types start
export type LevelColor = {
    bg: string;
    border: string;
    text: string;
    icon: string;
    badge: string;
    highlight?: string;
    button: string;
};


export type LevelColors = {
    [key: string]: LevelColor;
};


// Colors types end


// Start RequestedExams

export interface RequestedExams extends Exam {
    locked: boolean,
    student_id: number
}

// End RequestedExams



// START ADD EXAM COUNT

export type ExamCount = {
    student_id: number,
}

export type TakenExams = {
    student_id: number,
    exam_count: number,
    practice_count: number
}

// END ADD EXAM COUNT



// RESULTS START


export type examResults = {
    id: number,
    created_at: number,
    student_id: number,
    student_name: string,
    exam_name: string,
    student_level: string,
    student_score: number,
    reading_score?: number,
    listening_score?: number,
    grammar_score?: number    ,
    vocabulary_score?: number,
    total_score?:number,
    listening?:number,
    grammar?:number,
    vocabulary?:number,
    reading?:number,
    score?:number,
    name?:string

}


// RESULTS END



// Start Student Grade

export type studentGrade = {
    id: number,
    created_at: number,
    student_id: number,
    student_name: number,
    exam_name: string,
    student_level: string,
    student_score: string
}


// End Student Grade
