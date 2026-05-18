/**
 * @fileOverview A Genkit flow for generating professional real estate images for social posts.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The description of the image to generate.'),
});

export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export async function generatePostImage(input: GenerateImageInput): Promise<string> {
  return generatePostImageFlow(input);
}

const generatePostImageFlow = ai.defineFlow(
  {
    name: 'generatePostImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Professional high-quality real estate photography. ${input.prompt}. Architecture, interior design, crisp, cinematic lighting, 4k.`,
    });

    if (!media) {
      throw new Error('Image generation failed');
    }

    return media.url;
  }
);
