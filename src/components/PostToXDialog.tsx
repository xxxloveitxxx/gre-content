"use client";

import React, { useState, useEffect } from 'react';
import { SocialPost } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Twitter, PlusCircle, Loader2 } from 'lucide-react';

interface PostToXDialogProps {
  post: SocialPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface XAccount {
  username: string;
  name: string;
}

export function PostToXDialog({ post, open, onOpenChange, onSuccess }: PostToXDialogProps) {
  const [text, setText] = useState('');
  const [accounts, setAccounts] = useState<XAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchingAccounts, setFetchingAccounts] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (post) {
      setText(post.text);
    }
  }, [post]);

  useEffect(() => {
    if (open) {
      fetchAccounts();
    }
  }, [open]);

  const fetchAccounts = async () => {
    setFetchingAccounts(true);
    try {
      const res = await fetch('/api/x/accounts');
      if (res.ok) {
        const data = await res.json();
        setAccounts(data);
        if (data.length > 0 && !selectedAccount) {
          setSelectedAccount(data[0].username);
        }
      }
    } catch (error) {
      console.error('Failed to fetch X accounts', error);
    } finally {
      setFetchingAccounts(false);
    }
  };

  const handlePost = async () => {
    if (!selectedAccount) {
      toast({
        title: "No account selected",
        description: "Please connect an X account first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/x/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          username: selectedAccount,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Tweet Posted!",
          description: "Your content is now live on X.",
        });
        onSuccess();
        onOpenChange(false);
      } else {
        toast({
          title: "Post Failed",
          description: data.error || "An error occurred while posting.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to the server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    window.location.href = '/api/auth/x/login';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Twitter className="h-5 w-5 text-[#1DA1F2]" />
            Post to X
          </DialogTitle>
          <DialogDescription>
            Review and edit your tweet before sending it out.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Account</Label>
            {fetchingAccounts ? (
               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                 <Loader2 className="h-4 w-4 animate-spin" /> Loading accounts...
               </div>
            ) : accounts.length > 0 ? (
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.username} value={acc.username}>
                      @{acc.username} ({acc.name})
                    </SelectItem>
                  ))}
                  <div className="border-t mt-1 pt-1">
                    <button
                      onClick={handleConnect}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted rounded-sm"
                    >
                      <PlusCircle className="h-4 w-4" /> Connect another account
                    </button>
                  </div>
                </SelectContent>
              </Select>
            ) : (
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleConnect}>
                <PlusCircle className="h-4 w-4" /> Connect X Account
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tweet Text</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px]"
              maxLength={280}
            />
            <div className="flex justify-end text-[10px] text-muted-foreground">
              {text.length}/280
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handlePost}
            disabled={loading || accounts.length === 0}
            className="bg-[#1DA1F2] hover:bg-[#1A91DA] text-white"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post Tweet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
