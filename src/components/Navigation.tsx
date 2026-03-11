import { useState } from "react";
import { Button } from "./ui/button";
import { HugeiconsIcon } from '@hugeicons/react';
import { File01Icon, UserIcon, Notification03Icon, Logout01Icon, ChartBarLineIcon, Radio01Icon, FlashIcon } from '@hugeicons/core-free-icons';
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";

import { NewsPublisherStatsModal } from "./NewsPublisherStatsModal";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  articles: Array<{
    id: string;
    status: string;
    publishedDate?: string;
    [key: string]: any;
  }>;
  roundups: Array<{
    id: string;
    status: string;
    publishedDate?: string;
    createdAt?: string;
    [key: string]: any;
  }>;
  newsStories: Array<{
    id: string;
    status: string;
    publishedDate?: string;
    createdAt?: string;
    [key: string]: any;
  }>;
}

export function Navigation({ activeTab, onTabChange, articles, roundups, newsStories }: NavigationProps) {
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  
  const tabs = [
    { id: "news-publishing", label: "News Publishing", icon: File01Icon },
    { id: "news-stories", label: "News Stories", icon: FlashIcon },
    { id: "news-roundup", label: "News Round Up", icon: Radio01Icon },
  ];

  const bottomActions = [
    { id: "notifications", label: "Notifications", icon: Notification03Icon },
    { id: "logout", label: "Log Out", icon: Logout01Icon },
  ];

  // Calculate today's publications
  const today = new Date().toISOString().split('T')[0];
  const todayPublishedArticles = articles.filter(article => 
    article.status === 'published' && 
    article.publishedDate?.startsWith(today)
  ).length;
  
  const todayPublishedRoundups = roundups.filter(roundup => 
    roundup.status === 'live' && 
    roundup.createdAt?.startsWith(today)
  ).length;
  
  const todayPublishedStories = newsStories.filter(story => 
    story.status === 'live' && 
    story.createdAt?.startsWith(today)
  ).length;
  
  const todayTotal = todayPublishedArticles + todayPublishedRoundups + todayPublishedStories;

  return (
    <div className="h-full bg-sidebar flex flex-col items-center py-3">
      {/* Profile Section - 40x40px with 20px border radius */}
      <div className="flex justify-center mb-6">
        <Avatar className="h-10 w-10 rounded-[20px]">
          <AvatarFallback className="rounded-[20px]">
            <HugeiconsIcon icon={UserIcon} className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      </div>

      {/* News Publisher Counter - positioned below profile */}
      <div className="flex justify-center mb-8">
        <motion.button
          onClick={() => setIsStatsModalOpen(true)}
          className="relative w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[#EDEFF2]/50 transition-colors group"
          title="Publisher Performance"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <HugeiconsIcon icon={ChartBarLineIcon} className="h-5 w-5 text-foreground" />
          {/* Counter badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.1 }}
          >
            <Badge 
              className={`absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground border-0 ${todayTotal > 99 ? 'text-[8px]' : 'text-[10px]'}`}
            >
              {todayTotal > 99 ? '99+' : todayTotal}
            </Badge>
          </motion.div>
        </motion.button>
      </div>
      
      {/* Primary Navigation Tabs */}
      <nav className="flex-1 flex flex-col items-center">
        <div className="flex flex-col gap-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <div key={tab.id} className="relative flex flex-col items-center">
                {/* Icon Container - 40x40px */}
                <button
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isActive 
                      ? 'bg-[#EDEFF2]' 
                      : 'hover:bg-[#EDEFF2]/50'
                  }`}
                  onClick={() => onTabChange(tab.id)}
                  title={tab.label}
                >
                  <HugeiconsIcon icon={tab.icon} className="text-foreground" style={{ width: '21.6px', height: '21.6px' }} />
                </button>
                
                {/* Active State Bar - positioned 5px below icon container */}
                {isActive && (
                  <div 
                    className="w-8 h-1 bg-primary rounded-full mt-[5px]"
                  />
                )}
              </div>
            );
          })}
        </div>
      </nav>
      
      {/* Bottom Actions */}
      <div className="flex flex-col gap-6 items-center">
        {bottomActions.map((action) => {
          return (
            <button
              key={action.id}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[#EDEFF2]/50 transition-colors"
              title={action.label}
            >
              <HugeiconsIcon icon={action.icon} className="h-6 w-6 text-foreground" />
            </button>
          );
        })}
      </div>
      
      {/* News Publisher Stats Modal */}
      <NewsPublisherStatsModal 
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        articles={articles}
        roundups={roundups}
        newsStories={newsStories}
      />
    </div>
  );
}