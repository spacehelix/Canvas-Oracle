'use server';

/**
 * @fileOverview Extracts the color palette from an image.
 *
 * - extractColorPalette - A function that handles the extraction of the color palette from an image.
 * - ExtractColorPaletteInput - The input type for the extractColorPalette function.
 * - ExtractColorPaletteOutput - The return type for the extractColorPalette function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractColorPaletteInputSchema = z.object({
  image: z
    .string()
    .describe(
      "A base64 encoded image to extract the color palette from. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractColorPaletteInput = z.infer<typeof ExtractColorPaletteInputSchema>;

const ColorSchema = z.object({
  name: z.string().describe('The artist-friendly name of the color.'),
  hex: z.string().describe('The hex code of the color.'),
});
export type Color = z.infer<typeof ColorSchema>;

const ExtractColorPaletteOutputSchema = z.object({
  primary: z.array(ColorSchema).describe('An array of primary colors.'),
  secondary: z.array(ColorSchema).describe('An array of secondary colors.'),
  tertiary: z.array(ColorSchema).describe('An array of tertiary colors.'),
});
export type ExtractColorPaletteOutput = z.infer<typeof ExtractColorPaletteOutputSchema>;

export async function extractColorPalette(input: ExtractColorPaletteInput): Promise<ExtractColorPaletteOutput> {
  return extractColorPaletteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractColorPalettePrompt',
  input: {schema: ExtractColorPaletteInputSchema},
  output: {schema: ExtractColorPaletteOutputSchema},
  prompt: `You are an expert color theorist with a deep knowledge of traditional art pigments. Analyze the provided image and identify the 10 most prominent colors. Categorize these colors into primary, secondary, and tertiary groups based on their role in the artwork. For each color, you MUST provide:\n- A common, artist-friendly name (e.g., 'Cadmium Red', 'Ultramarine Blue', 'Yellow Ochre').\n- The color's hex code.\n\nReturn ONLY a valid JSON object matching this exact schema: { \"primary\": [{ \"name\": \"...\", \"hex\": \"...\" }], \"secondary\": [...], \"tertiary\": [...] }\n\nImage: {{media url=image}}`,
  system: 'You are an expert color palette extractor. Analyze the image and extract the color palette.',
});

const extractColorPaletteFlow = ai.defineFlow(
  {
    name: 'extractColorPaletteFlow',
    inputSchema: ExtractColorPaletteInputSchema,
    outputSchema: ExtractColorPaletteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
