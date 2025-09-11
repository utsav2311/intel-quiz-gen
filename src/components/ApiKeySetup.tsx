import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ApiKeySetupProps {
  onSubmit: (apiKey: string) => void;
}

export const ApiKeySetup = ({ onSubmit }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError("Please enter your Gemini API key");
      return;
    }

    if (!apiKey.startsWith("AIza")) {
      setError("Invalid API key format. Gemini API keys start with 'AIza'");
      return;
    }

    setError("");
    onSubmit(apiKey.trim());
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-glow">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-gradient-primary p-3 w-fit shadow-glow">
            <Key className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Setup API Key
          </CardTitle>
          <CardDescription>
            Enter your Google Gemini API key to generate AI-powered quiz questions
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Google Gemini API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="AIza..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-muted/50 border-primary/20 focus:border-primary focus:ring-primary/20"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="border-error/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:bg-gradient-primary/90 shadow-glow hover:shadow-primary/50 transition-all duration-300"
            >
              Continue
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an API key?{" "}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-glow underline"
              >
                Get one from Google AI Studio
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};