import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { FileText, Radio, Zap, Calendar, TrendingUp, Target } from "lucide-react";

interface NewsPublisherStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Array<{
    id: string;
    status: string;
    publishedDate?: string;
    ingestionTime?: string;
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

export function NewsPublisherStatsModal({ isOpen, onClose, articles, roundups, newsStories }: NewsPublisherStatsModalProps) {
  // Helper function to get date string in YYYY-MM-DD format
  const getDateString = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };

  // Helper function to format date for display
  const formatDisplayDate = (daysAgo: number) => {
    if (daysAgo === 0) return 'Today';
    if (daysAgo === 1) return 'Yesterday';
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  // Calculate today's stats
  const today = getDateString(0);
  const todayStats = {
    articlesPublished: articles.filter(a => a.status === 'published' && a.publishedDate?.startsWith(today)).length,
    roundupsPublished: roundups.filter(r => r.status === 'live' && r.createdAt?.startsWith(today)).length,
    storiesPublished: newsStories.filter(s => s.status === 'live' && s.createdAt?.startsWith(today)).length,
    totalActions: 0
  };
  todayStats.totalActions = todayStats.articlesPublished + todayStats.roundupsPublished + todayStats.storiesPublished;

  // Calculate historical stats
  const totalArticlesPublished = articles.filter(a => a.status === 'published').length;
  const totalRoundupsPublished = roundups.filter(r => r.status === 'live').length;
  const totalStoriesPublished = newsStories.filter(s => s.status === 'live').length;

  // Calculate this week and this month stats
  const thisWeekStart = getDateString(7);
  const thisMonthStart = getDateString(30);
  
  const thisWeekTotal = articles.filter(a => a.status === 'published' && a.publishedDate && a.publishedDate >= thisWeekStart).length +
                       roundups.filter(r => r.status === 'live' && r.createdAt && r.createdAt >= thisWeekStart).length +
                       newsStories.filter(s => s.status === 'live' && s.createdAt && s.createdAt >= thisWeekStart).length;
                       
  const thisMonthTotal = articles.filter(a => a.status === 'published' && a.publishedDate && a.publishedDate >= thisMonthStart).length +
                        roundups.filter(r => r.status === 'live' && r.createdAt && r.createdAt >= thisMonthStart).length +
                        newsStories.filter(s => s.status === 'live' && s.createdAt && s.createdAt >= thisMonthStart).length;

  const historicalStats = {
    totalArticlesPublished,
    totalRoundupsPublished,
    totalStoriesPublished,
    averagePerDay: Math.round((totalArticlesPublished + totalRoundupsPublished + totalStoriesPublished) / 30 * 10) / 10,
    thisWeek: thisWeekTotal,
    thisMonth: thisMonthTotal
  };

  // Calculate recent activity for the last 5 days
  const recentActivity = Array.from({ length: 5 }, (_, i) => {
    const dateStr = getDateString(i);
    return {
      date: formatDisplayDate(i),
      articles: articles.filter(a => a.status === 'published' && a.publishedDate?.startsWith(dateStr)).length,
      roundups: roundups.filter(r => r.status === 'live' && r.createdAt?.startsWith(dateStr)).length,
      stories: newsStories.filter(s => s.status === 'live' && s.createdAt?.startsWith(dateStr)).length
    };
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            Publisher Performance
          </DialogTitle>
          <DialogDescription>
            Track your publishing activity, performance metrics, and historical data for articles, roundups, and stories.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Today's Performance */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Today's Activity</h3>
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                {todayStats.totalActions} total actions
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Articles</span>
                </div>
                <div className="text-2xl font-semibold text-blue-900">{todayStats.articlesPublished}</div>
                <div className="text-xs text-blue-600">published today</div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Radio className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Roundups</span>
                </div>
                <div className="text-2xl font-semibold text-purple-900">{todayStats.roundupsPublished}</div>
                <div className="text-xs text-purple-600">published today</div>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Stories</span>
                </div>
                <div className="text-2xl font-semibold text-orange-900">{todayStats.storiesPublished}</div>
                <div className="text-xs text-orange-600">published today</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Historical Performance */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Historical Performance</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Lifetime totals */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Lifetime Totals</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Total Articles</span>
                    </div>
                    <span className="font-semibold">{historicalStats.totalArticlesPublished.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Radio className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Total Roundups</span>
                    </div>
                    <span className="font-semibold">{historicalStats.totalRoundupsPublished}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Total Stories</span>
                    </div>
                    <span className="font-semibold">{historicalStats.totalStoriesPublished}</span>
                  </div>
                </div>
              </div>
              
              {/* Period summaries */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Period Summaries</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Week</span>
                    <Badge variant="outline">{historicalStats.thisWeek} total</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Month</span>
                    <Badge variant="outline">{historicalStats.thisMonth} total</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Daily Average</span>
                    <Badge variant="outline">{historicalStats.averagePerDay} per day</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Recent Activity */}
          <div>
            <h3 className="font-medium mb-4">Recent Activity</h3>
            <div className="space-y-2">
              {recentActivity.map((day, index) => (
                <div key={day.date} className={`p-3 rounded-lg border ${index === 0 ? 'bg-primary/5 border-primary/20' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${index === 0 ? 'text-primary' : 'text-foreground'}`}>
                        {day.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {day.articles}
                      </span>
                      <span className="flex items-center gap-1">
                        <Radio className="h-3 w-3" />
                        {day.roundups}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {day.stories}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}