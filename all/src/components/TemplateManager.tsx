"use client";

import React, { useState } from 'react';
import { PromptTemplate } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, FileText, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TemplateManagerProps {
  templates: PromptTemplate[];
  onUpdate: (templates: PromptTemplate[]) => void;
}

export default function TemplateManager({ templates, onUpdate }: TemplateManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newContent, setNewContent] = useState('');
  const { toast } = useToast();

  const handleAdd = () => {
    if (!newName.trim() || !newContent.trim()) return;

    const newTemplate: PromptTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      content: newContent,
    };

    onUpdate([...templates, newTemplate]);
    setNewName('');
    setNewContent('');
    setIsAdding(false);
    toast({
      title: "Template Saved",
      description: "You can now reuse this prompt in the studio.",
    });
  };

  const handleDelete = (id: string) => {
    onUpdate(templates.filter(t => t.id !== id));
    toast({
      title: "Deleted",
      description: "Template removed.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold font-headline">Prompt Templates</h3>
          <p className="text-sm text-muted-foreground">Save your favorite writing styles and common topics.</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Template
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border-accent/40 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-sm">Create New Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="t-name">Template Name</Label>
              <Input 
                id="t-name" 
                placeholder="Ex: Product Launch Style" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-content">Prompt Fragment / Instructions</Label>
              <Textarea 
                id="t-content" 
                placeholder="Ex: Mention the eco-friendly materials and offer a 20% discount code..." 
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button onClick={handleAdd}>Save Template</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {templates.length === 0 && !isAdding ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl">
          <Sparkles className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">You haven't saved any templates yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="group overflow-hidden">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold truncate flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  {template.name}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                  onClick={() => handleDelete(template.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed italic">
                  "{template.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}