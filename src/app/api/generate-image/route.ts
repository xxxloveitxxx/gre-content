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
      throw new Error(`Pixazo API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Pixazo response:', data); // Debug log
    
    // Pixazo returns image in different formats, try all
    const imageUrl = data.url || data.image_url || data.data?.[0]?.url || data.data;
    
    if (!imageUrl) {
      console.error('No image URL found in response:', data);
      return Response.json({ error: 'No image in response' }, { status: 500 });
    }
    
    return Response.json({ url: imageUrl });
  } catch (error) {
    console.error('Image generation error:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
