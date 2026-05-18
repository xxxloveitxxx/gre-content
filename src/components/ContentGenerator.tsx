"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, SendHorizontal, Image as ImageIcon, FileText, Zap, Shield, TrendingUp } from 'lucide-react';
import { generateSocialMediaPosts } from '@/ai/flows/generate-social-media-posts';
import { generatePostImage } from '@/ai/flows/generate-post-image';
import { Platform, SocialPost, PromptTemplate } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface ContentGeneratorProps {
  onGenerated: (posts: SocialPost[]) => void;
  templates: PromptTemplate[];
}

const PLATFORMS: Platform[] = ['X/Twitter', 'Instagram', 'LinkedIn', 'Facebook', 'TikTok', 'YouTube'];

export default function ContentGenerator({ onGenerated, templates }: ContentGeneratorProps) {
  const [topic, setTopic] = useState('Why manual follow-up is killing your real estate commission checks.');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['LinkedIn', 'Instagram', 'X/Twitter']);
  const [tone, setTone] = useState('authoritative');
  const [generateImages, setGenerateImages] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handlePlatformToggle = (platform: Platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform) 
        : [...prev, platform]
    );
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    try {
      const postsResult = await generateSocialMediaPosts({
        topic,
        platforms: selectedPlatforms as any,
        tone,
      });

      const newPosts: SocialPost[] = await Promise.all(postsResult.map(async (post) => {
        let imageUrl = undefined;
        if (generateImages && post.imagePrompt) {
          try {
            imageUrl = await generatePostImage({ prompt: post.imagePrompt });
          } catch (e) {
            console.error("Image generation failed", e);
          }
        }

        return {
          id: Math.random().toString(36).substr(2, 9),
          platform: post.platform as Platform,
          text: post.text,
          hashtags: post.hashtags,
          emojis: post.emojis,
          imagePrompt: post.imagePrompt,
          imageUrl: imageUrl,
          status: 'draft',
          createdAt: new Date().toISOString(),
          topic: topic
        };
      }));

      onGenerated(newPosts);
    } catch (error) {
      console.error("Generation failed", error);
      toast({
        variant: "destructive",
        title: "Forge Failed",
        description: "The AI engine encountered an error.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-primary/20 shadow-xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Zap className="h-6 w-6 text-primary fill-primary/20" />
                Hormozi Forge Engine
              </CardTitle>
              <Badge variant="secondary" className="font-bold">REAL ESTATE FOCUS</Badge>
            </div>
            <CardDescription>
              Generating high-leverage growth assets for replyzeai.com.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="topic">Campaign Core Concept / Hook</Label>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Growth Topic</span>
              </div>
              <Textarea 
                id="topic" 
                placeholder="Ex: The $10k/month agent follow-up mistake..." 
                className="min-h-[120px] text-lg font-medium border-primary/20 focus:border-primary"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tone">Strategic Voice</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger id="tone" className="border-primary/10">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="authoritative">Authoritative (Hormozi)</SelectItem>
                    <SelectItem value="educational">Educational / Deep Insight</SelectItem>
                    <SelectItem value="polarizing">Polarizing / Contrarian</SelectItem>
                    <SelectItem value="visionary">Visionary (Future of Real Estate)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Target Audience Context</Label>
                <div className="flex items-center gap-2 p-2 rounded-md bg-muted border border-dashed text-sm font-semibold text-muted-foreground">
                  <Shield className="h-4 w-4" /> Real Estate Agents
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Distribution Channels</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="gen-images" 
                    checked={generateImages}
                    onCheckedChange={(checked) => setGenerateImages(!!checked)}
                  />
                  <Label htmlFor="gen-images" className="text-xs font-bold flex items-center gap-1 cursor-pointer text-primary">
                    <ImageIcon className="h-3 w-3" /> Auto-Generate Visuals
                  </Label>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PLATFORMS.map((platform) => (
                  <div key={platform} className={`flex items-center space-x-2 rounded-lg border p-3 transition-all cursor-pointer ${selectedPlatforms.includes(platform) ? 'border-primary bg-primary/5 shadow-inner' : 'hover:bg-accent/5'}`}>
                    <Checkbox 
                      id={`p-${platform}`} 
                      checked={selectedPlatforms.includes(platform)}
                      onCheckedChange={() => handlePlatformToggle(platform)}
                      className="border-primary"
                    />
                    <Label 
                      htmlFor={`p-${platform}`} 
                      className="text-xs font-bold cursor-pointer flex-1"
                    >
                      {platform}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t py-6 flex justify-between items-center">
            <div className="text-[10px] text-muted-foreground font-medium max-w-[200px]">
              *System uses Hook-Story-Offer and Value Equation guardrails.
            </div>
            <Button 
              disabled={isGenerating || !topic.trim() || selectedPlatforms.length === 0} 
              onClick={handleGenerate}
              size="lg"
              className="px-10 shadow-lg shadow-primary/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Forging Assets...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4 fill-current" />
                  Forge Content
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-accent">
              <FileText className="h-4 w-4" />
              Strategic Blueprints
            </CardTitle>
            <CardDescription className="text-xs">Proven Hormozi growth angles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "The Value Equation", topic: "How Replyze AI makes lead conversion 10x easier for agents." },
              { label: "Pain-Solution Gap", topic: "The hidden cost of being a 'manual follow-up' agent." },
              { label: "Future Advantage", topic: "Why AI-first real estate teams will own 90% of the local market." },
              { label: "Grand Slam Offer", topic: "How to use Replyze to scale to $1M GCI with zero extra effort." }
            ].map((blueprint, i) => (
              <Button 
                key={i}
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-left truncate text-[11px] font-semibold border-accent/10 hover:border-accent hover:bg-accent/5"
                onClick={() => setTopic(blueprint.topic)}
              >
                {blueprint.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Growth Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs font-medium opacity-90 leading-relaxed italic">
              "The goal isn't just to post. It's to make an offer so good they'd feel stupid saying no. Use Replyze AI to bridge the 'effort' gap for agents."
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}