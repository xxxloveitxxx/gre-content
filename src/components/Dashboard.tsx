"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Library,
  FileText,
  TrendingUp,
  Zap,
  Target,
  BarChart3,
  Users,
  Activity,
  Layers,
  Cpu,
  Globe,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import GlassCard from "./ui/glass-card";
import MagneticButton from "./ui/magnetic-button";
import AnimatedCounter from "./ui/animated-counter";
import AnimatedProgress from "./ui/animated-progress";
import Tilt3DCard from "./ui/tilt-3d-card";
import CursorTrail from "./ui/cursor-trail";
import ContentGenerator from "./ContentGenerator";
import ContentLibrary from "./ContentLibrary";
import TemplateManager from "./TemplateManager";
import { SocialPost, PromptTemplate } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Dynamically import 3D scene to avoid SSR issues
const Scene3D = dynamic(() => import("./3d/Scene3D"), {
  ssr: false,
  loading: () => null,
});

const navItems = [
  { id: "dashboard", label: "Command Center", icon: Cpu },
  { id: "generate", label: "Forge Engine", icon: Sparkles },
  { id: "library", label: "Asset Vault", icon: Library },
  { id: "templates", label: "Frameworks", icon: FileText },
];

const stats = [
  { label: "Content Generated", value: 12847, icon: Zap, color: "primary" as const, suffix: "" },
  { label: "Active Campaigns", value: 24, icon: Target, color: "accent" as const, suffix: "" },
  { label: "Engagement Rate", value: 94, icon: BarChart3, color: "warm" as const, suffix: "%" },
  { label: "Team Members", value: 8, icon: Users, color: "primary" as const, suffix: "" },
];

const recentActivity = [
  { action: "Generated campaign", item: "Spring Launch 2024", time: "2 min ago", status: "success" },
  { action: "Template updated", item: "Urgency Framework", time: "15 min ago", status: "info" },
  { action: "Content published", item: "Weekly Newsletter", time: "1 hour ago", status: "success" },
  { action: "AI training", item: "New tone model", time: "3 hours ago", status: "pending" },
];

const performanceMetrics = [
  { label: "CPU Usage", value: 67, color: "primary" as const },
  { label: "Memory", value: 45, color: "accent" as const },
  { label: "API Calls", value: 89, color: "warm" as const },
  { label: "Storage", value: 34, color: "primary" as const },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "generate" | "library" | "templates">("dashboard");
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedPosts = localStorage.getItem("replyze_posts");
    const savedTemplates = localStorage.getItem("replyze_templates");
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    if (savedTemplates) setTemplates(JSON.parse(savedTemplates));
  }, []);

  useEffect(() => {
    localStorage.setItem("replyze_posts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem("replyze_templates", JSON.stringify(templates));
  }, [templates]);

  const addPost = (newPosts: SocialPost[]) => {
    setPosts((prev) => [...newPosts, ...prev]);
    toast({
      title: "Growth Content Forged",
      description: `Generated ${newPosts.length} Hormozi-style assets.`,
    });
  };

  const updatePost = (updatedPost: SocialPost) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-background">
      {/* Cursor Trail Effect */}
      <CursorTrail />
      
      {/* 3D Background */}
      <Scene3D />

      {/* Animated Grid Background */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col",
          "w-72 border-r border-border/30",
          "glass-strong"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-4 border-b border-border/30 p-6">
          <motion.div
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Cpu className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground glow-text-primary">
              NEXUS
            </h1>
            <p className="text-xs text-muted-foreground">AI Command Center</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-4 py-3",
                  "transition-all duration-300",
                  isActive
                    ? "bg-primary/20 text-primary glow-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className={cn(
                    "rounded-lg p-2",
                    isActive ? "bg-primary/30" : "bg-muted/30"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto h-2 w-2 rounded-full bg-primary"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Status Panel */}
        <div className="border-t border-border/30 p-4">
          <div className="rounded-xl bg-muted/30 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">System Status</span>
              <span className="flex items-center gap-1 text-xs text-green-400">
                <motion.div
                  className="h-2 w-2 rounded-full bg-green-400"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Online
              </span>
            </div>
            <AnimatedProgress value={78} glowColor="accent" />
          </div>
        </div>
      </motion.aside>

      {/* Mobile Menu Toggle */}
      <motion.button
        className="fixed left-4 top-4 z-50 rounded-xl bg-card/80 p-3 backdrop-blur-xl lg:hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </motion.button>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 overflow-auto p-8 transition-all duration-300",
          isSidebarOpen ? "ml-72" : "ml-8"
        )}
      >
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <motion.h1
                    className="text-4xl font-bold tracking-tight"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                      Command Center
                    </span>
                  </motion.h1>
                  <p className="mt-2 text-muted-foreground">
                    Welcome back. Your AI systems are operating at peak efficiency.
                  </p>
                </div>
                <MagneticButton
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                  onClick={() => setActiveTab("generate")}
                >
                  <Zap className="h-4 w-4" />
                  Quick Generate
                </MagneticButton>
              </div>

              {/* Stats Grid */}
              <div className="perspective-2000 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Tilt3DCard 
                      key={stat.label}
                      glowColor={stat.color === "primary" ? "hsl(260 100% 65% / 0.3)" : stat.color === "accent" ? "hsl(175 100% 50% / 0.3)" : "hsl(35 100% 55% / 0.3)"}
                    >
                      <GlassCard
                        glowColor={stat.color}
                        delay={index}
                        className="group cursor-pointer p-6"
                      >
                      <motion.div
                        onHoverStart={() => setHoveredStat(index)}
                        onHoverEnd={() => setHoveredStat(null)}
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <motion.div
                            className={cn(
                              "rounded-xl p-3",
                              stat.color === "primary" && "bg-primary/20",
                              stat.color === "accent" && "bg-accent/20",
                              stat.color === "warm" && "bg-amber-500/20"
                            )}
                            animate={{
                              scale: hoveredStat === index ? 1.1 : 1,
                              rotate: hoveredStat === index ? 10 : 0,
                            }}
                          >
                            <Icon
                              className={cn(
                                "h-6 w-6",
                                stat.color === "primary" && "text-primary",
                                stat.color === "accent" && "text-accent",
                                stat.color === "warm" && "text-amber-400"
                              )}
                            />
                          </motion.div>
                          <motion.div
                            className="text-xs text-muted-foreground"
                            animate={{ opacity: hoveredStat === index ? 1 : 0.7 }}
                          >
                            <Activity className="h-4 w-4" />
                          </motion.div>
                        </div>
                        <div className="text-3xl font-bold">
                          <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                      </motion.div>
                    </GlassCard>
                    </Tilt3DCard>
                  );
                })}
              </div>

              {/* Main Content Grid */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Activity Feed */}
                <GlassCard className="lg:col-span-2 p-6" glowColor="primary" delay={4}>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Recent Activity</h2>
                    <motion.button
                      className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                      whileHover={{ x: 5 }}
                    >
                      View all <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="group flex items-center gap-4 rounded-xl bg-muted/30 p-4 transition-all duration-300 hover:bg-muted/50"
                      >
                        <motion.div
                          className={cn(
                            "h-3 w-3 rounded-full",
                            activity.status === "success" && "bg-green-400",
                            activity.status === "info" && "bg-blue-400",
                            activity.status === "pending" && "bg-amber-400"
                          )}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.item}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>

                {/* Performance Metrics */}
                <GlassCard className="p-6" glowColor="accent" delay={5}>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">System Metrics</h2>
                    <Layers className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-6">
                    {performanceMetrics.map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{metric.label}</span>
                          <span className="font-medium">{metric.value}%</span>
                        </div>
                        <AnimatedProgress value={metric.value} glowColor={metric.color} />
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </div>

              {/* Interactive Globe Section */}
              <GlassCard className="p-8" glowColor="primary" delay={6}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">Global Reach</h2>
                    <p className="mt-2 text-muted-foreground">
                      Content distributed across 47 regions worldwide
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary">
                        <AnimatedCounter value={2847} suffix="K" />
                      </p>
                      <p className="text-sm text-muted-foreground">Total Impressions</p>
                    </div>
                    <motion.div
                      className="rounded-full bg-primary/20 p-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Globe className="h-8 w-8 text-primary" />
                    </motion.div>
                  </div>
                </div>
                
                {/* Region Bars */}
                <div className="mt-8 grid gap-4 md:grid-cols-4">
                  {[
                    { region: "North America", value: 89, color: "primary" as const },
                    { region: "Europe", value: 76, color: "accent" as const },
                    { region: "Asia Pacific", value: 64, color: "warm" as const },
                    { region: "Latin America", value: 42, color: "primary" as const },
                  ].map((region, index) => (
                    <motion.div
                      key={region.region}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="rounded-xl bg-muted/30 p-4"
                    >
                      <p className="mb-2 text-sm font-medium">{region.region}</p>
                      <AnimatedProgress value={region.value} glowColor={region.color} />
                      <p className="mt-2 text-2xl font-bold">{region.value}%</p>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "generate" && (
            <motion.div
              key="generate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-6xl"
            >
              <GlassCard className="p-6" glowColor="primary">
                <ContentGenerator onGenerated={addPost} templates={templates} />
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "library" && (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-6xl"
            >
              <GlassCard className="p-6" glowColor="accent">
                <ContentLibrary posts={posts} onUpdate={updatePost} onDelete={deletePost} />
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "templates" && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-6xl"
            >
              <GlassCard className="p-6" glowColor="warm">
                <TemplateManager templates={templates} onUpdate={setTemplates} />
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
