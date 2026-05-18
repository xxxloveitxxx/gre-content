export type Platform = 'X/Twitter' | 'Instagram' | 'LinkedIn' | 'Facebook' | 'TikTok' | 'Pinterest' | 'YouTube';

export type ContentStatus = 'draft' | 'scheduled' | 'posted';

export interface SocialPost {
  id: string;
  platform: Platform;
  text: string;
  hashtags: string[];
  emojis: string[];
  characterCount?: number;
  wordCount?: number;
  status: ContentStatus;
  createdAt: string;
  scheduledAt?: string;
  topic: string;
  imageUrl?: string;
  imagePrompt?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  category?: string;
}
