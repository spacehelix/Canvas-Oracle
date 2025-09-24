'use server';

/**
 * @fileOverview A flow that generates an art critique based on the image and selected topics.
 *
 * This file is also a Next.js API route handler.
 *
 * - POST: Handles the art critique generation process.
 * - GenerateArtCritiqueInput - The input type for the generateArtCritique function.
 * - GenerateArtCritiqueOutput - The return type for the generateArtCritique function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {NextRequest, NextResponse} from 'next/server';

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
  critique: z.string().describe('The generated art critique in Markdown format.'),
});
export type GenerateArtCritiqueOutput = z.infer<typeof GenerateArtCritiqueOutputSchema>;

// This function is kept for type safety and potential direct server-side calls.
export async function generateArtCritique(
  input: GenerateArtCritiqueInput
): Promise<GenerateArtCritiqueOutput> {
  return generateArtCritiqueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateArtCritiquePrompt',
  input: {schema: GenerateArtCritiqueInputSchema},
  output: {schema: GenerateArtCritiqueOutputSchema},
  prompt: `You are 'CritiqueBot 5000', a highly advanced AI art critic. Your purpose is to provide a structured, concise, and impactful analysis of an artwork based on user-selected metrics.

You MUST adhere to the following strict output format for EACH metric provided. Use Markdown.

### {Metric Name}: {Score}/10
**Key Insight:** A single, bolded sentence that summarizes the most critical observation for this metric.
**Justification:** A brief, 2-3 sentence explanation that supports your score and key insight. Use the expert logic provided below to inform your justification. Do not be conversational or use filler words. Be direct and objective.

---

**EXPERT LOGIC FOR ANALYSIS:**

**When analyzing Color Theory, you must consider:**
- The specific color harmony (complementary, analogous, etc.).
- The dominant color temperature and its effect on mood.
- The use of saturation and contrast to create a focal point.

**When analyzing Composition, you must consider:**
- The primary focal point and how the eye is drawn to it.
- The balance of the piece (symmetrical, asymmetrical) and its effect on stability or tension.
- The use of leading lines, shapes, and negative space to create flow and depth.

**When analyzing Execution, you must consider:**
- The quality and nature of the brushwork or linework (e.g., expressive, controlled).
- The rendering of light and shadow to create form and texture.
- The apparent mastery and control over the chosen artistic medium.

**When analyzing Originality, you must consider:**
- The uniqueness of the subject matter and concept.
- The stylistic influences and how they are combined.
- The presence of a distinct artistic voice or point of view.

---

Now, analyze the provided image. The user has selected the following metrics for critique: **{{#each topics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}**.

Artwork: {{media url=image}}

Begin your critique now.
`,
});

const generateArtCritiqueFlow = ai.defineFlow(
  {
    name: 'generateArtCritiqueFlow',
    inputSchema: GenerateArtCritiqueInputSchema,
    outputSchema: GenerateArtCritiqueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {critique: output!.critique};
  }
);


export async function POST(req: NextRequest): Promise<NextResponse> {
  const input = await req.json();

  try {
    const validatedInput = GenerateArtCritiqueInputSchema.parse(input);
    const result = await generateArtCritiqueFlow(validatedInput);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
