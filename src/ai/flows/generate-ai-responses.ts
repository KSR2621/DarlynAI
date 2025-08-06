'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating AI responses to user questions.
 *
 * The flow takes a text-based question as input and returns a formatted AI response.
 * It uses the Gemini model to generate the response and supports markdown formatting.
 *
 * @exported
 *   - `generateAIResponse`: The main function to generate AI responses.
 *   - `GenerateAIResponseInput`: The input type for the generateAIResponse function.
 *   - `GenerateAIResponseOutput`: The output type for the generateAIResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the flow.
const GenerateAIResponseInputSchema = z.object({
  question: z.string().describe('The text-based question from the user.'),
});
export type GenerateAIResponseInput = z.infer<typeof GenerateAIResponseInputSchema>;

// Define the output schema for the flow.
const GenerateAIResponseOutputSchema = z.object({
  response: z.string().describe('The formatted AI response to the question.'),
});
export type GenerateAIResponseOutput = z.infer<typeof GenerateAIResponseOutputSchema>;

/**
 * Generates an AI response to a user's question.
 * @param input The input object containing the user's question.
 * @returns A promise that resolves to the formatted AI response.
 */
export async function generateAIResponse(input: GenerateAIResponseInput): Promise<GenerateAIResponseOutput> {
  return generateAIResponseFlow(input);
}

// Define the prompt for the AI model.
const generateAIResponsePrompt = ai.definePrompt({
  name: 'generateAIResponsePrompt',
  input: {schema: GenerateAIResponseInputSchema},
  output: {schema: GenerateAIResponseOutputSchema},
  prompt: `You are a helpful chatbot that provides informative and well-formatted responses to user questions.

  Please answer the following question:
  {{question}}

  Your response should be formatted with markdown where appropriate, including:
  - Bold text
  - Bullet points
  - Hyperlinks
  - Code blocks (with copy button)
  `,
});

// Define the Genkit flow.
const generateAIResponseFlow = ai.defineFlow(
  {
    name: 'generateAIResponseFlow',
    inputSchema: GenerateAIResponseInputSchema,
    outputSchema: GenerateAIResponseOutputSchema,
  },
  async input => {
    const {output} = await generateAIResponsePrompt(input);
    return output!;
  }
);
