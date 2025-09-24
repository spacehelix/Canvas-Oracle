'use server';

/**
 * @fileOverview A flow that generates an art critique based on the image and selected topics.
 *
 * - generateArtCritique - A function that handles the art critique generation process.
 * - GenerateArtCritiqueInput - The input type for the generateArtCritique function.
 * - GenerateArtCritiqueOutput - The return type for the generateArtCritique function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateArtCritiqueInputSchema = z.object({
  image: z
    .string()
    .describe(
      "A photo of the artwork, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  topics: z
    .array(z.enum(['Color Theory', 'Composition', 'Originality', 'Execution']))
    .describe('The topics to focus on in the art critique.'),
});
export type GenerateArtCritiqueInput = z.infer<typeof GenerateArtCritiqueInputSchema>;

const GenerateArtCritiqueOutputSchema = z.object({
  critique: z.string().describe('The generated art critique.'),
});
export type GenerateArtCritiqueOutput = z.infer<typeof GenerateArtCritiqueOutputSchema>;

export async function generateArtCritique(
  input: GenerateArtCritiqueInput
): Promise<GenerateArtCritiqueOutput> {
  return generateArtCritiqueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateArtCritiquePrompt',
  input: {schema: GenerateArtCritiqueInputSchema},
  output: {schema: GenerateArtCritiqueOutputSchema},
  prompt: `You are a world-renowned art critic. Analyze the provided artwork and provide a critique focusing on the following topics:

Topics: {{#each topics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Artwork: {{media url=image}}

Critique:`,
});

const generateArtCritiqueFlow = ai.defineFlow(
  {
    name: 'generateArtCritiqueFlow',
    inputSchema: GenerateArtCritiqueInputSchema,
    outputSchema: GenerateArtCritiqueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
