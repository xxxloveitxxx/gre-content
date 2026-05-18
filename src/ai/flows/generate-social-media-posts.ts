/**
 * @fileOverview Internal Genkit flow for Replyze AI admins using Hormozi frameworks to attract Real Estate Agents.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Input Schema
const GenerateSocialMediaPostsInputSchema = z.object({
  topic: z.string().describe('The main topic or keywords for the growth campaign.'),
  platforms: z.array(z.enum(['X/Twitter', 'Instagram', 'LinkedIn', 'Facebook', 'TikTok', 'Pinterest', 'YouTube']))
    .describe('A list of target social media platforms.'),
  tone: z.string().optional().describe('The desired tone for the posts.'),
});

export type GenerateSocialMediaPostsInput = z.infer<typeof GenerateSocialMediaPostsInputSchema>;

// Output Schema
const SocialMediaPostSchema = z.object({
  platform: z.enum(['X/Twitter', 'Instagram', 'LinkedIn', 'Facebook', 'TikTok', 'Pinterest', 'YouTube']),
  text: z.string().describe('The main text content, structured with Hook-Story-Offer.'),
  hashtags: z.array(z.string()),
  emojis: z.array(z.string()),
  imagePrompt: z.string().describe('Descriptive prompt for a professional real estate image.'),
  hormoziAngle: z.string().describe('Brief explanation of which Hormozi framework was applied (e.g., Value Equation, Grand Slam Offer).'),
});

const GenerateSocialMediaPostsOutputSchema = z.array(SocialMediaPostSchema);

export type GenerateSocialMediaPostsOutput = z.infer<typeof GenerateSocialMediaPostsOutputSchema>;

// Prompt definition
const generateSocialMediaPostsPrompt = ai.definePrompt({
  name: 'generateSocialMediaPostsPrompt',
  input: { schema: GenerateSocialMediaPostsInputSchema },
  output: { schema: GenerateSocialMediaPostsOutputSchema },
  prompt: `You are the Chief Growth Officer for Replyze AI (replyzeai.com), channeling the strategic mind of Alex Hormozi.
Your mission is to generate social media content that converts REAL ESTATE AGENTS into Replyze users.

GUIDE RAILS:
1. THE VALUE EQUATION: Always aim to increase the Dream Outcome and Perceived Likelihood of Achievement, while minimizing Time Delay and Effort/Sacrifice for the agent.
2. HOOK-STORY-OFFER: Every post must start with a polarizing or high-interest hook, tell a brief insight-rich story or lesson, and end with an offer (check out replyzeai.com).
3. NO FLUFF: Be direct, use "if/then" statements, and focus on ROI.
4. AUDIENCE: Real Estate Agents who are tired of manual lead follow-up and content creation.

Topic: {{{topic}}}
{{#if tone}}Tone: {{{tone}}}{{/if}}
Target Platforms: {{#each platforms}} {{this}}{{#unless @last}},{{/unless}}{{/each}}

For each post:
- Identify the specific pain point being solved.
- Use the Hormozi "Grand Slam" style: make the solution (Replyze AI) feel like an "unreasonable" advantage.
- Provide a high-converting imagePrompt for real estate visuals.
`,
});

// Flow definition
const generateSocialMediaPostsFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostsFlow',
    inputSchema: GenerateSocialMediaPostsInputSchema,
    outputSchema: GenerateSocialMediaPostsOutputSchema,
  },
  async (input) => {
    const { output } = await generateSocialMediaPostsPrompt(input);
    return output!;
  }
);

// Wrapper function
export async function generateSocialMediaPosts(input: GenerateSocialMediaPostsInput): Promise<GenerateSocialMediaPostsOutput> {
  return generateSocialMediaPostsFlow(input);
}
