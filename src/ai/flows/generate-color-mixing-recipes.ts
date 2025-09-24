'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating color mixing recipes.
 *
 * The flow takes a color palette as input and returns an array of mixing recipes for each color.
 *
 * @fileOverview This file defines a Genkit flow for generating color mixing recipes.
 * - createMixingRecipes - A function that handles the color mixing recipes generation process.
 * - MixingRecipesInput - The input type for the createMixingRecipes function.
 * - MixingRecipesOutput - The return type for the createMixingRecipes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ColorSchema = z.object({
  name: z.string().describe('The name of the color.'),
  hex: z.string().describe('The hex code of the color.'),
});

const MixingRecipesInputSchema = z.object({
  primary: z.array(ColorSchema).describe('Array of primary colors.'),
  secondary: z.array(ColorSchema).describe('Array of secondary colors.'),
  tertiary: z.array(ColorSchema).describe('Array of tertiary colors.'),
});
export type MixingRecipesInput = z.infer<typeof MixingRecipesInputSchema>;

const RecipeSchema = z.object({
  extractedColor: ColorSchema.describe('The color for which the recipe is generated.'),
  recipe: z
    .array(
      z.object({
        name: z.string().describe('The name of the base paint color.'),
        percent: z.number().describe('The percentage of the base paint color in the recipe.'),
      })
    )
    .describe('The mixing recipe for the color.'),
});

export type Recipe = z.infer<typeof RecipeSchema>;

const MixingRecipesOutputSchema = z.array(RecipeSchema);
export type MixingRecipesOutput = z.infer<typeof MixingRecipesOutputSchema>;

export async function createMixingRecipes(input: MixingRecipesInput): Promise<MixingRecipesOutput> {
  return createMixingRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createMixingRecipesPrompt',
  input: {schema: MixingRecipesInputSchema},
  output: {schema: MixingRecipesOutputSchema},
  prompt: `You are a master painter and colorist. Your task is to create plausible paint mixing recipes for a given list of colors.

For EACH color provided in the input JSON, do the following:

Create a recipe using 1 to 3 common base paint colors (e.g., 'Titanium White', 'Phthalo Blue', 'Alizarin Crimson').
Assign a percentage to each base color. The percentages for each recipe MUST sum to exactly 100%. For example, a valid recipe for 'Lavender' might be: 'Ultramarine Blue' 10%, 'Alizarin Crimson' 40%, 'Titanium White' 50%.
Use only artist-friendly names for all paints.

Return ONLY a valid JSON array matching this exact schema: [{ "extractedColor": { "name": "...", "hex": "..." }, "recipe": [{ "name": "...", "percent": ... }] }]

Here is the color palette:

{{~#each primary}}  \nPrimary: {{this.name}} ({{this.hex}})
{{~/each}}
{{~#each secondary}}  \nSecondary: {{this.name}} ({{this.hex}})
{{~/each}}
{{~#each tertiary}}   \nTertiary: {{this.name}} ({{this.hex}})
{{~/each}}`,
});

const createMixingRecipesFlow = ai.defineFlow(
  {
    name: 'createMixingRecipesFlow',
    inputSchema: MixingRecipesInputSchema,
    outputSchema: MixingRecipesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
