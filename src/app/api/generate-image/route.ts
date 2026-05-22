export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const response = await fetch('https://gateway.pixazo.ai/flux-1-schnell/v1/getData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Ocp-Apim-Subscription-Key': process.env.PIXAZO_API_KEY!,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Pixazo API error: ${error}`);
    }
    
    const data = await response.json();
    return Response.json({ url: data.url || data.image_url || data.data });
  } catch (error) {
    console.error('Image generation failed:', error);
    return Response.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
