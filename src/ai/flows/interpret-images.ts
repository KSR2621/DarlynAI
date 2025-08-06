'use server';

/**
 * @fileOverview An AI agent that interprets images and answers questions about them.
 *
 * - interpretImages - A function that handles the image interpretation process.
 * - InterpretImagesInput - The input type for the interpretImages function.
 * - InterpretImagesOutput - The return type for the interpretImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretImagesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to interpret, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().describe('The question about the image.'),
});
export type InterpretImagesInput = z.infer<typeof InterpretImagesInputSchema>;

const InterpretImagesOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the image.'),
});
export type InterpretImagesOutput = z.infer<typeof InterpretImagesOutputSchema>;

export async function interpretImages(input: InterpretImagesInput): Promise<InterpretImagesOutput> {
  return interpretImagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretImagesPrompt',
  input: {schema: InterpretImagesInputSchema},
  output: {schema: InterpretImagesOutputSchema},
  prompt: `You are an AI that can interpret images and answer questions about them.

  You will be given a photo and a question about the photo. You will answer the question to the best of your ability.

  Photo: {{media url=photoDataUri}}
  Question: {{{question}}}`,
});

const interpretImagesFlow = ai.defineFlow(
  {
    name: 'interpretImagesFlow',
    inputSchema: InterpretImagesInputSchema,
    outputSchema: InterpretImagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
