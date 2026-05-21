import Groq from "groq-sdk";

const groqModels = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "mixtral-8x7b-32768",
  "llama3-70b-8192",
  "llama3-8b-8192",
];

let modelIndex = 0;

function getNextModel() {
  const model = groqModels[modelIndex];
  modelIndex = (modelIndex + 1) % groqModels.length;
  return model;
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy_key",
});

export async function generateSocialMediaPosts({
  topic,
  platforms,
  tone,
}: {
  topic: string;
  platforms: string[];
  tone: string;
}) {
  const model = getNextModel();

  const prompt = `
    You are Alex Hormozi. Generate high-leverage social media posts for the following platforms: ${platforms.join(", ")}.

    Topic: ${topic}
    Tone: ${tone}

    Guidelines:
    - Use the Hook-Story-Offer framework.
    - Use the Value Equation (Value = Dream Outcome × Perception of Achievement / Time Delay × Effort & Sacrifice).
    - Be authoritative, punchy, and direct.
    - For each platform, provide:
      1. Post Text
      2. 3-5 relevant hashtags
      3. A set of emojis
      4. An image prompt for an AI image generator that captures the essence of the post.

    Format the output as a JSON array of objects:
    [
      {
        "platform": "Platform Name",
        "text": "Post content...",
        "hashtags": ["#tag1", "#tag2"],
        "emojis": ["🚀", "💰"],
        "imagePrompt": "Detailed description for AI image generation..."
      }
    ]

    IMPORTANT: Respond ONLY with the JSON array.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: model,
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) throw new Error("No content received from Groq");

    // Sometimes Groq might wrap JSON in markdown blocks or just return the object
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      // Fallback: extract the first array-like structure if JSON.parse fails
      const start = content.indexOf('[');
      const end = content.lastIndexOf(']');
      if (start !== -1 && end !== -1 && end > start) {
        try {
          parsed = JSON.parse(content.substring(start, end + 1));
        } catch (e2) {
          throw new Error("Failed to parse Groq response as JSON");
        }
      } else {
        throw new Error("Failed to parse Groq response as JSON");
      }
    }

    // If it's an object with a key like "posts", extract it
    if (!Array.isArray(parsed) && parsed.posts) {
      parsed = parsed.posts;
    }

    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.error(`Error with model ${model}:`, error);
    // If it fails, we could try the next model recursively, but let's keep it simple for now
    throw error;
  }
}
