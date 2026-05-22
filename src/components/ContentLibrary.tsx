"use client";

import React, { useState } from 'react';
import { SocialPost, ContentStatus } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { 
  Trash2, 
  Edit3, 
  Calendar, 
  MoreHorizontal,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Search,
  Filter,
  Copy,
  Sparkles
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PostToXDialog } from './PostToXDialog';

interface ContentLibraryProps {
  posts: SocialPost[];
  onUpdate: (post: SocialPost) => void;
  onDelete: (id: string) => void;
}

const PLATFORM_ICONS: Record<string, any> = {
  'X/Twitter': <Twitter className="h-4 w-4" />,
  'Instagram': <Instagram className="h-4 w-4" />,
  'LinkedIn': <Linkedin className="h-4 w-4" />,
  'Facebook': <Facebook className="h-4 w-4" />,
  'TikTok': <span className="text-[10px] font-bold">TT</span>,
  'YouTube': <span className="text-[10px] font-bold">YT</span>,
};

export default function ContentLibrary({ posts, onUpdate, onDelete }: ContentLibraryProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [postingToX, setPostingToX] = useState<SocialPost | null>(null);
  const { toast } = useToast();

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.text.toLowerCase().includes(search.toLowerCase()) || 
                         p.topic.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  const changeStatus = (post: SocialPost, status: ContentStatus) => {
    onUpdate({ ...post, status });
    toast({
      title: "Status Updated",
      description: `Post marked as ${status}.`,
    });
  };

  const handleEditSave = () => {
    if (editingPost) {
      onUpdate(editingPost);
      setEditingPost(null);
      toast({
        title: "Saved",
        description: "Post updated successfully.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search real estate posts..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={statusFilter === 'draft' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setStatusFilter('draft')}
          >
            Drafts
          </Button>
          <Button 
            variant={statusFilter === 'scheduled' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setStatusFilter('scheduled')}
          >
            Scheduled
          </Button>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border-2 border-dashed rounded-xl">
          <div className="p-4 rounded-full bg-muted/50">
            <Filter className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No posts found</h3>
            <p className="text-muted-foreground max-w-xs">
              Start generating content for your real estate brand!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="group relative border shadow-sm flex flex-col hover:border-primary/40 transition-all duration-300 overflow-hidden">
              {post.imageUrl && (
                <div className="relative h-48 w-full overflow-hidden border-b">
                  <Image 
                    src={post.imageUrl} 
                    alt="Generated post visuals" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                    {PLATFORM_ICONS[post.platform] || <Sparkles className="h-3 w-3" />}
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {post.platform}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={
                    post.status === 'posted' ? 'default' : 
                    post.status === 'scheduled' ? 'secondary' : 'outline'
                  } className="capitalize text-[10px]">
                    {post.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setEditingPost(post)}>
                        <Edit3 className="mr-2 h-4 w-4" /> Edit Post
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPostingToX(post)}>
                        <Twitter className="mr-2 h-4 w-4" /> Post to X
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopy(post.text)}>
                        <Copy className="mr-2 h-4 w-4" /> Copy Text
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => changeStatus(post, 'draft')}>
                        Mark as Draft
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changeStatus(post, 'scheduled')}>
                        Mark as Scheduled
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changeStatus(post, 'posted')}>
                        Mark as Posted
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => onDelete(post.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap line-clamp-4 mb-3">
                  {post.text}
                </p>
                <div className="flex flex-wrap gap-1">
                  {post.hashtags.map((tag, i) => (
                    <span key={i} className="text-[10px] text-primary font-medium hover:underline cursor-pointer">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t bg-muted/10 flex justify-between py-3 px-4">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] hover:text-primary" onClick={() => handleCopy(post.text)}>
                  <Copy className="mr-1 h-3 w-3" /> Copy
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Real Estate Content</DialogTitle>
            <DialogDescription>
              Perfect your {editingPost?.platform} post for your agents.
            </DialogDescription>
          </DialogHeader>
          {editingPost && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Post Text</Label>
                <Textarea 
                  value={editingPost.text} 
                  onChange={(e) => setEditingPost({ ...editingPost, text: e.target.value })}
                  className="min-h-[150px]"
                />
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Platform: {editingPost.platform}</span>
                <span>Characters: {editingPost.text.length}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPost(null)}>Cancel</Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Post to X Dialog */}
      <PostToXDialog
        post={postingToX}
        open={!!postingToX}
        onOpenChange={(open) => !open && setPostingToX(null)}
        onSuccess={() => {
          if (postingToX) {
            changeStatus(postingToX, 'posted');
          }
        }}
      />
    </div>
  );
}
