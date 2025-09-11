import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, RefreshCw, Plus, Clock, Target, CheckCircle, XCircle } from "lucide-react";
import { QuizResults } from "@/pages/Index";

interface ScorecardProps {
  results: QuizResults;
  onRestart: () => void;
  onNewQuiz: () => void;
}

export const Scorecard = ({ results, onRestart, onNewQuiz }: ScorecardProps) => {
  const { score, totalQuestions, questions, timeSpent } = results;
  const percentage = Math.round((score / totalQuestions) * 100);
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  const getScoreColor = () => {
    if (percentage >= 80) return "success";
    if (percentage >= 60) return "primary";
    return "error";
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return "Outstanding! You're a quiz master!";
    if (percentage >= 80) return "Excellent work! You really know your stuff!";
    if (percentage >= 70) return "Great job! You have a solid understanding!";
    if (percentage >= 60) return "Good effort! Room for improvement though.";
    return "Keep studying! You'll do better next time!";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Score Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-glow text-center">
        <CardHeader>
          <div className={`mx-auto mb-4 rounded-full p-4 w-fit shadow-glow ${
            getScoreColor() === "success" ? "bg-gradient-success" :
            getScoreColor() === "primary" ? "bg-gradient-primary" :
            "bg-gradient-error"
          }`}>
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent">
            Quiz Complete!
          </CardTitle>
          <CardDescription className="text-lg">
            {getPerformanceMessage()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="space-y-4">
            <div className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {percentage}%
            </div>
            <div className="text-xl text-muted-foreground">
              {score} out of {totalQuestions} correct
            </div>
            <Progress value={percentage} className="h-3" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-muted/50 border border-primary/10">
              <Target className="h-5 w-5 text-primary" />
              <div className="text-center">
                <div className="font-bold text-lg">{score}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-muted/50 border border-primary/10">
              <XCircle className="h-5 w-5 text-error" />
              <div className="text-center">
                <div className="font-bold text-lg">{totalQuestions - score}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-muted/50 border border-primary/10">
              <Clock className="h-5 w-5 text-primary" />
              <div className="text-center">
                <div className="font-bold text-lg">
                  {minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`}
                </div>
                <div className="text-sm text-muted-foreground">Time Spent</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button 
              onClick={onRestart}
              variant="outline"
              className="flex-1 border-primary/20 hover:bg-primary/10 hover:border-primary/40"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Same Topic
            </Button>
            <Button 
              onClick={onNewQuiz}
              className="flex-1 bg-gradient-primary hover:bg-gradient-primary/90 shadow-glow hover:shadow-primary/50 transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Topic
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="text-xl">Question Review</CardTitle>
          <CardDescription>
            Review your answers and see where you can improve
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {questions.map((question, index) => {
            const isCorrect = question.selectedAnswer === question.correctAnswer;
            
            return (
              <div key={question.id} className="p-4 rounded-lg border border-primary/10 bg-muted/20 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Question {index + 1}
                      </span>
                      <Badge variant={isCorrect ? "default" : "destructive"} className={
                        isCorrect 
                          ? "bg-success text-success-foreground" 
                          : "bg-error text-error-foreground"
                      }>
                        {isCorrect ? "Correct" : "Incorrect"}
                      </Badge>
                    </div>
                    <p className="font-medium mb-3">{question.question}</p>
                    
                    <div className="space-y-2">
                      {question.selectedAnswer !== undefined && (
                        <div className={`flex items-center gap-2 text-sm ${
                          isCorrect ? "text-success" : "text-error"
                        }`}>
                          {isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                          Your answer: {question.options[question.selectedAnswer]}
                        </div>
                      )}
                      
                      {!isCorrect && (
                        <div className="flex items-center gap-2 text-sm text-success">
                          <CheckCircle className="h-4 w-4" />
                          Correct answer: {question.options[question.correctAnswer]}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};