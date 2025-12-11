// Interface for the generated question format
export interface GeneratedQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
}

/**
 * Service to handle AI interactions for question generation
 */
export const aiService = {
    /**
     * Generate questions from text content using Deepseek-R1 via compatible API
     * @param text The source text content to generate questions from
     * @param apiKey The API key for the service
     * @returns Array of generated questions
     */
    generateQuestionsFromText: async (text: string, apiKey: string): Promise<GeneratedQuestion[]> => {
        try {
            const prompt = `
        You are a helpful assistant that generates multiple-choice questions from text.
        Based on the following text, generate 5-10 multiple-choice questions.
        
        The output must be in a strictly CSV-like format with the following columns:
        Question, OptionA, OptionB, OptionC, OptionD, OptionE, Base 0 Index of Correct Answer (0-4)
        
        Do not include a header row.
        Do not include any other text, explanations, or markdown formatting. Just the CSV lines.
        Ensure options are distinct.
        
        Text content:
        ${text.substring(0, 5000)} // Truncate to avoid token limits if necessary
      `;

            // Using OpenRouter API endpoint for DeepSeek R1T2 Chimera
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'ATS Question Generator'
                },
                body: JSON.stringify({
                    model: 'tngtech/deepseek-r1t2-chimera:free',
                    messages: [
                        { role: 'user', content: prompt }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`AI API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content || '';

            return parseCsvToQuestions(content);
        } catch (error) {
            console.error('Error generating questions:', error);
            throw error;
        }
    }
};

/**
 * Helper to parse the CSV-like output from AI
 */
function parseCsvToQuestions(csvContent: string): GeneratedQuestion[] {
    const lines = csvContent.trim().split('\n');
    const questions: GeneratedQuestion[] = [];

    for (const line of lines) {
        if (!line.trim()) continue;

        // Simple CSV parser that handles quoted strings if the AI produces them
        // This regex looks for comma-separated values, respecting quotes
        const parts: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                parts.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        parts.push(current.trim());

        // We expect at least Question + 2 Options + Answer
        if (parts.length >= 4) {
            const questionText = parts[0];
            // Options are from index 1 to length-2 (last one is answer)
            // But we constrained it to 5 options in prompt. Let's be flexible.

            const answerPart = parts[parts.length - 1];
            const answerIndex = parseInt(answerPart);

            // Extract options (middle parts)
            const options = parts.slice(1, parts.length - 1).filter(opt => opt);

            // Ensure we have valid data
            if (questionText && options.length >= 2 && !isNaN(answerIndex)) {
                questions.push({
                    question: questionText,
                    options: options,
                    correctAnswer: Math.min(Math.max(0, answerIndex), options.length - 1)
                });
            }
        }
    }

    return questions;
}
