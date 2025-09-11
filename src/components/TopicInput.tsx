import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Loader2, Sparkles } from "lucide-react";

interface TopicInputProps {
  onSubmit: (topic: string, questionCount: number, difficulty: string) => void;
  isGenerating: boolean;
}

export const TopicInput = ({ onSubmit, isGenerating }: TopicInputProps) => {
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<string>("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      return;
    }

    onSubmit(topic.trim(), questionCount, difficulty);
  };

  const popularTopics = [
    "JavaScript Programming",
    "World History",
    "Science & Physics",
    "Geography",
    "Literature",
    "Mathematics",
    "Biology",
    "Computer Science"
  ];

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-lg border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-glow">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-gradient-primary p-3 w-fit shadow-glow">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Choose Your Topic
          </CardTitle>
          <CardDescription>
            What would you like to be quizzed on today?
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Quiz Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., JavaScript, World War II, Solar System..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-muted/50 border-primary/20 focus:border-primary focus:ring-primary/20"
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Number of Questions</Label>
              <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(Number(value))}>
                <SelectTrigger className="bg-muted/50 border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                  <SelectItem value="15">15 Questions</SelectItem>
                  <SelectItem value="20">20 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="bg-muted/50 border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:bg-gradient-primary/90 shadow-glow hover:shadow-primary/50 transition-all duration-300"
              disabled={!topic.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Quiz
                </>
              )}
            </Button>
          </form>

          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Popular Topics:</p>
            <div className="flex flex-wrap gap-2">
              {popularTopics.map((popularTopic) => (
                <Button
                  key={popularTopic}
                  variant="outline"
                  size="sm"
                  onClick={() => setTopic(popularTopic)}
                  className="border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-colors"
                  disabled={isGenerating}
                >
                  {popularTopic}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};