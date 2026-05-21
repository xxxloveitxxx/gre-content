'use client';

import { puter } from '@heyputer/puter.js';

export async function generatePostImage({ prompt }: { prompt: string }): Promise<string> {
  try {
    const imageElement = await puter.ai.txt2img(prompt, { model: 'flux-schnell' });

    // puter.ai.txt2img returns an HTMLImageElement
    if (imageElement instanceof HTMLImageElement) {
      return imageElement.src;
    }

    // Fallback or if it returns something else
    return (imageElement as any).src || '';
  } catch (error) {
    console.error('Puter image generation error:', error);
    throw error;
  }
}
