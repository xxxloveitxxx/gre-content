export async function generatePostImage({ prompt }: { prompt: string }) {
  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Image generation failed:', error);
    return undefined;
  }
}
