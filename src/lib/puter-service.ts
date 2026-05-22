export async function generatePostImage({ prompt }: { prompt: string }) {
  try {
    const response = await fetch('https://api.pixazo.ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PIXAZO_API_KEY}`,
      },
      body: JSON.stringify({ 
        prompt, 
        model: 'flux-schnell',
        num_inference_steps: 4,
      }),
    });

    if (!response.ok) throw new Error('Pixazo API error');
    
    const data = await response.json();
    return data.url || data.image_url;
  } catch (error) {
    console.error('Image generation failed:', error);
    return undefined;
  }
}
