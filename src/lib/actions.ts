'use server';

import * as aiService from './ai-service';

export async function generateSocialMediaPostsAction(data: {
  topic: string;
  platforms: string[];
  tone: string;
}) {
  return await aiService.generateSocialMediaPosts(data);
}
