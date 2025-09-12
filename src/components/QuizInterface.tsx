import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { Question, QuizResults } from "@/types/quiz";

interface QuizInterfaceProps {
  questions: Question[];
  onComplete: (results: QuizResults) => void;
}

export const QuizInterface = ({ questions, onComplete }: QuizInterfaceProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnswered = selectedAnswers[currentQuestion.id] !== undefined;
  const selectedAnswer = selectedAnswers[currentQuestion.id];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }));
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Calculate results
      const score = Object.entries(selectedAnswers).reduce((acc, [questionId, answer]) => {
        const question = questions.find(q => q.id === Number(questionId));
        return acc + (question && answer === question.correctAnswer ? 1 : 0);
      }, 0);

      const results: QuizResults = {
        score,
        totalQuestions: questions.length,
        questions: questions.map(q => ({
          ...q,
          selectedAnswer: selectedAnswers[q.id]
        })),
        timeSpent: Math.round((Date.now() - startTime) / 1000)
      };

      onComplete(results);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowFeedback(false);
      setQuestionStartTime(Date.now());
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-card to-card/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-glow">
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Answer Options */}
          <div className="grid gap-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === currentQuestion.correctAnswer;
              
              let buttonClass = "w-full justify-start text-left h-auto p-4 transition-all duration-300 ";
              
              if (!showFeedback) {
                buttonClass += "border-primary/20 hover:border-primary/40 hover:bg-primary/5";
              } else {
                if (isCorrectAnswer) {
                  buttonClass += "bg-gradient-success border-success text-success-foreground shadow-success";
                } else if (isSelected && !isCorrectAnswer) {
                  buttonClass += "bg-gradient-error border-error text-error-foreground shadow-error";
                } else {
                  buttonClass += "border-muted text-muted-foreground opacity-60";
                }
              }

              return (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{option}</span>
                    {showFeedback && (
                      <div className="ml-2">
                        {isCorrectAnswer && <CheckCircle className="h-5 w-5" />}
                        {isSelected && !isCorrectAnswer && <XCircle className="h-5 w-5" />}
                      </div>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`p-4 rounded-lg border ${
              isCorrect 
                ? "bg-success/10 border-success/20 text-success-foreground" 
                : "bg-error/10 border-error/20 text-error-foreground"
            }`}>
              <div className="flex items-center gap-2 font-medium">
                {isCorrect ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Correct! Great job!
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5" />
                    Incorrect. The correct answer was: {currentQuestion.options[currentQuestion.correctAnswer]}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Next Button */}
          {showFeedback && (
            <Button 
              onClick={handleNextQuestion}
              className="w-full bg-gradient-primary hover:bg-gradient-primary/90 shadow-glow hover:shadow-primary/50 transition-all duration-300"
            >
              {isLastQuestion ? "View Results" : "Next Question"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};