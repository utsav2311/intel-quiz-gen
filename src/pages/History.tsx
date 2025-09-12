import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowLeft, Trophy, Clock, Target, History as HistoryIcon, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface QuizHistoryItem {
  id: string;
  topic: string;
  score: number;
  total_questions: number;
  completed_at: string;
  questions_data: any;
}

const History = () => {
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchQuizHistory();
    }
  }, [user]);

  const fetchQuizHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_history')
        .select('*')
        .order('completed_at', { ascending: false });

      if (error) throw error;

      setQuizHistory(data || []);
    } catch (error) {
      console.error('Error fetching quiz history:', error);
      toast({
        title: 'Failed to load history',
        description: 'There was an error loading your quiz history.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-success text-success-foreground';
    if (percentage >= 60) return 'bg-primary text-primary-foreground';
    return 'bg-error text-error-foreground';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 bg-gradient-primary/10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-16 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                You need to sign in to view your quiz history.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/auth">
                <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
                  Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-gradient-primary/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <div className="rounded-xl bg-gradient-primary p-2 shadow-glow">
                <HistoryIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Quiz History
                </h1>
                <p className="text-muted-foreground">Track your learning progress</p>
              </div>
            </div>
            <Link to="/quiz">
              <Button className="bg-gradient-primary hover:bg-gradient-primary/90 shadow-glow">
                <Plus className="mr-2 h-4 w-4" />
                New Quiz
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : quizHistory.length === 0 ? (
          <Card className="border-primary/20 text-center py-12">
            <CardContent>
              <div className="rounded-full bg-gradient-primary p-4 w-fit mx-auto mb-4">
                <Brain className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="mb-2">No Quiz History Yet</CardTitle>
              <CardDescription className="mb-6">
                Start taking quizzes to see your progress and track your learning journey.
              </CardDescription>
              <Link to="/quiz">
                <Button className="bg-gradient-primary hover:bg-gradient-primary/90 shadow-glow">
                  <Plus className="mr-2 h-4 w-4" />
                  Take Your First Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {quizHistory.map((quiz) => {
              const percentage = Math.round((quiz.score / quiz.total_questions) * 100);
              
              return (
                <Card key={quiz.id} className="border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-glow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="capitalize">{quiz.topic}</CardTitle>
                        <CardDescription>
                          {formatDate(quiz.completed_at)}
                        </CardDescription>
                      </div>
                      <Badge className={getScoreColor(percentage)}>
                        {percentage}%
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-primary/10">
                        <Trophy className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-bold">{quiz.score}/{quiz.total_questions}</div>
                          <div className="text-sm text-muted-foreground">Score</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-primary/10">
                        <Target className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-bold">{percentage}%</div>
                          <div className="text-sm text-muted-foreground">Accuracy</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-bold">{quiz.total_questions} Qs</div>
                          <div className="text-sm text-muted-foreground">Questions</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;