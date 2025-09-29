export interface StudyCard {
  title: string;
  description: string;
  imageSrc?: string;
}

export interface Question {
  question: string;
  type: 'multiple' | 'boolean';
  options?: string[];
  correctAnswer: number | boolean;
}

export interface SupportMaterial {
  title: string;
  type: 'link' | 'document' | 'video' | 'text';
  url?: string;
  content?: string;
}

export interface Subject {
  name: string;
  content: string;
  icon?: string;
  date?: string;
  studyCards: StudyCard[];
  questions: Question[];
  supportMaterials: SupportMaterial[];
}

export interface Assessment {
  title: string;
  course: string;
  school: string;
  schoolLogo?: string;
  examDate?: string;
  anotherInfo?: string;
  AnotherInfo?: string; // Para compatibilidade com JSON existente
  enabled: boolean;
  order: number;
  subjects: Subject[] | any[][]; // Para compatibilidade com estrutura atual
}

export interface ContentData {
  assessments: Assessment[];
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: {
    question: Question;
    userAnswer: number | boolean;
    isCorrect: boolean;
  }[];
}
