import { useState } from "react";
import { ApiKeySetup } from "@/components/ApiKeySetup";
import { TopicInput } from "@/components/TopicInput";
import { QuizInterface } from "@/components/QuizInterface";
import { Scorecard } from "@/components/Scorecard";
import { generateQuizQuestions } from "@/services/openai";
import { Brain, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const Index = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<"setup" | "topic" | "quiz" | "results">("setup");
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    setCurrentStep("topic");
  };

  const handleTopicSubmit = async (topic: string, questionCount: number) => {
    setIsGenerating(true);
    try {
      const questions = await generateQuizQuestions(topic, questionCount, apiKey);
      setQuizQuestions(questions);
      setCurrentStep("quiz");
      toast({
        title: "Quiz Generated!",
        description: `Created ${questions.length} questions about ${topic}`,
      });
    } catch (error) {
      console.error("Failed to generate quiz:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate quiz questions",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuizComplete = (results: QuizResults) => {
    setQuizResults(results);
    setCurrentStep("results");
  };

  const handleRestart = () => {
    setCurrentStep("topic");
    setQuizQuestions([]);
    setQuizResults(null);
  };

  const handleNewQuiz = () => {
    setCurrentStep("setup");
    setApiKey("");
    setQuizQuestions([]);
    setQuizResults(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-gradient-primary/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-primary p-2 shadow-glow">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  AI Quiz Generator
                </h1>
                <p className="text-muted-foreground">Test your knowledge with AI-powered quizzes</p>
              </div>
            </div>
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentStep === "setup" && (
          <ApiKeySetup onSubmit={handleApiKeySubmit} />
        )}
        
        {currentStep === "topic" && (
          <TopicInput onSubmit={handleTopicSubmit} isGenerating={isGenerating} />
        )}
        
        {currentStep === "quiz" && quizQuestions.length > 0 && (
          <QuizInterface questions={quizQuestions} onComplete={handleQuizComplete} />
        )}
        
        {currentStep === "results" && quizResults && (
          <Scorecard results={quizResults} onRestart={handleRestart} onNewQuiz={handleNewQuiz} />
        )}
      </main>
    </div>
  );
};

export default Index;