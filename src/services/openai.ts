import { Question } from "@/pages/Index";

export class OpenAIService {
  private apiKey: string;
  private baseURL = "https://api.openai.com/v1/chat/completions";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateQuizQuestions(topic: string, count: number): Promise<Question[]> {
    const prompt = `Create a quiz about "${topic}" with exactly ${count} multiple-choice questions. 
    
    Each question should have:
    - A clear, well-written question
    - Exactly 4 answer options (A, B, C, D)
    - One correct answer
    - The questions should vary in difficulty from basic to intermediate
    - Questions should be factual and have definitive correct answers
    
    Format your response as a JSON array where each question follows this exact structure:
    {
      "question": "Your question here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
    
    The correctAnswer should be the index (0-3) of the correct option in the options array.
    
    Return ONLY the JSON array, no additional text or formatting.`;

    try {
      const response = await fetch(this.baseURL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a quiz generator that creates educational multiple-choice questions. Always respond with valid JSON only."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle specific error cases with user-friendly messages
        if (response.status === 429) {
          throw new Error("API quota exceeded. Please check your OpenAI billing and upgrade your plan if needed.");
        }
        
        if (response.status === 401) {
          throw new Error("Invalid API key. Please check your OpenAI API key and try again.");
        }
        
        if (response.status === 403) {
          throw new Error("Access denied. Please verify your API key has the required permissions.");
        }
        
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("No content received from OpenAI API");
      }

      // Parse the JSON response
      let questionsData;
      try {
        // Remove any potential markdown formatting
        const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
        questionsData = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", content);
        throw new Error("Invalid JSON response from OpenAI API");
      }

      if (!Array.isArray(questionsData)) {
        throw new Error("Expected an array of questions from OpenAI API");
      }

      // Transform to our Question format with IDs
      const questions: Question[] = questionsData.map((q: any, index: number) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      }));

      // Validate the questions
      for (const question of questions) {
        if (!question.question || !Array.isArray(question.options) || 
            question.options.length !== 4 || 
            typeof question.correctAnswer !== 'number' ||
            question.correctAnswer < 0 || question.correctAnswer > 3) {
          throw new Error("Invalid question format received from OpenAI API");
        }
      }

      return questions;

    } catch (error) {
      console.error("Error generating quiz questions:", error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error("Failed to generate quiz questions. Please check your API key and try again.");
    }
  }
}

export const generateQuizQuestions = async (topic: string, count: number, apiKey: string): Promise<Question[]> => {
  const openAI = new OpenAIService(apiKey);
  return openAI.generateQuizQuestions(topic, count);
};