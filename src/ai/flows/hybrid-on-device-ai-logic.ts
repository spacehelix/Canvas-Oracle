'use server';
/**
 * @fileOverview Genkit flow that implements hybrid on-device AI logic, falling back to cloud functions.
 *
 * This file exports:
 * - `hybridOnDeviceAILogic`: The main function to handle AI requests with fallback.
 * - `HybridOnDeviceAILogicInput`: The input type for the hybridOnDeviceAILogic function.
 * - `HybridOnDeviceAILogicOutput`: The output type for the hybridOnDeviceAILogic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HybridOnDeviceAILogicInputSchema = z.object({
  requestType: z.string().describe('The type of AI request (e.g., critique, color extraction, recipe generation).'),
  payload: z.any().describe('The payload for the AI request, which can vary based on the request type.'),
});
export type HybridOnDeviceAILogicInput = z.infer<typeof HybridOnDeviceAILogicInputSchema>;

const HybridOnDeviceAILogicOutputSchema = z.object({
  result: z.any().describe('The result of the AI request, which can vary based on the request type.'),
  source: z.enum(['on-device', 'cloud']).describe('Indicates whether the result came from on-device AI or the cloud fallback.'),
});
export type HybridOnDeviceAILogicOutput = z.infer<typeof HybridOnDeviceAILogicOutputSchema>;

export async function hybridOnDeviceAILogic(input: HybridOnDeviceAILogicInput): Promise<HybridOnDeviceAILogicOutput> {
  return hybridOnDeviceAILogicFlow(input);
}

const hybridOnDeviceAILogicFlow = ai.defineFlow(
  {
    name: 'hybridOnDeviceAILogicFlow',
    inputSchema: HybridOnDeviceAILogicInputSchema,
    outputSchema: HybridOnDeviceAILogicOutputSchema,
  },
  async input => {
    // This is a placeholder; the actual logic will be implemented in the frontend.
    // This flow primarily exists to define the input and output schemas and to be a placeholder
    // for potential future server-side logic or monitoring.

    console.log("This flow should not be called directly.  The hybrid logic lives in the frontend.");

    return {
      result: 'This is a placeholder result. The actual logic is in the frontend.',
      source: 'cloud',
    };
  }
);
