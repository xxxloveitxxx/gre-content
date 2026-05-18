"use client";

import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Library, 
  LayoutDashboard, 
  Sparkles,
  FileText,
  Clock,
  Home,
  Users,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import ContentGenerator from './ContentGenerator';
import ContentLibrary from './ContentLibrary';
import TemplateManager from './TemplateManager';
import { SocialPost, PromptTemplate } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'generate' | 'library' | 'templates'>('generate');
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedPosts = localStorage.getItem('replyze_posts');
    const savedTemplates = localStorage.getItem('replyze_templates');
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    if (savedTemplates) setTemplates(JSON.parse(savedTemplates));
  }, []);

  useEffect(() => {
    localStorage.setItem('replyze_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('replyze_templates', JSON.stringify(templates));
  }, [templates]);

  const addPost = (newPosts: SocialPost[]) => {
    setPosts(prev => [...newPosts, ...prev]);
    toast({
      title: "Growth Content Forged",
      description: `Generated ${newPosts.length} Hormozi-style assets.`,
    });
  };

  const updatePost = (updatedPost: SocialPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader className="border-b p-4 bg-primary text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold font-headline group-data-[collapsible=icon]:hidden">
                Admin Forge
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === 'generate'} 
                  onClick={() => setActiveTab('generate')}
                  tooltip="Forge Engine"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Forge Engine</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === 'library'} 
                  onClick={() => setActiveTab('library')}
                  tooltip="Asset Library"
                >
                  <Library className="h-4 w-4" />
                  <span>Asset Library</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === 'templates'} 
                  onClick={() => setActiveTab('templates')}
                  tooltip="Growth Frameworks"
                >
                  <FileText className="h-4 w-4" />
                  <span>Frameworks</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4 group-data-[collapsible=icon]:hidden bg-muted/50">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Users className="h-3 w-3" />
                <span>Targeting: Real Estate Agents</span>
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                replyzeai.com internal
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h2 className="text-lg font-bold uppercase tracking-tight font-headline text-primary">
                {activeTab === 'generate' ? 'Hormozi Content Engine' : activeTab === 'library' ? 'Asset Library' : 'Strategic Templates'}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                ADMIN ACCESS
              </Badge>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            <div className="mx-auto max-w-6xl space-y-8">
              {activeTab === 'generate' && (
                <ContentGenerator onGenerated={addPost} templates={templates} />
              )}
              {activeTab === 'library' && (
                <ContentLibrary 
                  posts={posts} 
                  onUpdate={updatePost} 
                  onDelete={deletePost} 
                />
              )}
              {activeTab === 'templates' && (
                <TemplateManager 
                  templates={templates} 
                  onUpdate={setTemplates} 
                />
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

import { Badge } from '@/components/ui/badge';
