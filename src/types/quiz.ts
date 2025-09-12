export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer?: number;
}

export interface QuizResults {
  score: number;
  totalQuestions: number;
  questions: Question[];
  timeSpent: number;
}