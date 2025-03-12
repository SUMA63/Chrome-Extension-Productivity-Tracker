
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, ExternalLink } from 'lucide-react';
import { formatTimeSpent } from '@/utils/trackerUtils';

// Type definition for website data
interface Website {
  id: number;
  favicon: string;
  name: string;
  url: string;
  category: 'Productive' | 'Distracting' | 'Communication' | 'Neutral';
  timeSpent: number;
  visits: number;
}

const WebsiteTracker = () => {
  const [websiteData, setWebsiteData] = useState<Website[]>([]);
  const [isExtension, setIsExtension] = useState(false);
  
  // Check if running as extension and load data
  useEffect(() => {
    const isRunningAsExtension = !!window.chrome?.runtime?.id;
    setIsExtension(isRunningAsExtension);
    
    if (isRunningAsExtension) {
      // Load from Chrome storage
      chrome.runtime.sendMessage({ action: 'getWebsiteData' }, (response) => {
        if (response && response.data) {
          setWebsiteData(response.data);
        }
      });
      
      // Set up listener for storage updates
      const storageListener = () => {
        chrome.runtime.sendMessage({ action: 'getWebsiteData' }, (response) => {
          if (response && response.data) {
            setWebsiteData(response.data);
          }
        });
      };
      
      // Listen for changes
      chrome.storage.onChanged.addListener(storageListener);
      
      return () => {
        chrome.storage.onChanged.removeListener(storageListener);
      };
    } else {
      // Use mock data in non-extension environment
      setWebsiteData([
        { 
          id: 1, 
          favicon: "https://www.google.com/favicon.ico", 
          name: "Google Docs", 
          url: "docs.google.com", 
          category: "Productive", 
          timeSpent: 8100, // in seconds
          visits: 12 
        },
        { 
          id: 2, 
          favicon: "https://www.github.com/favicon.ico", 
          name: "GitHub", 
          url: "github.com", 
          category: "Productive", 
          timeSpent: 6120,
          visits: 8 
        },
        { 
          id: 3, 
          favicon: "https://www.youtube.com/favicon.ico", 
          name: "YouTube", 
          url: "youtube.com", 
          category: "Distracting", 
          timeSpent: 2700,
          visits: 5 
        },
        { 
          id: 4, 
          favicon: "https://www.slack.com/favicon.ico", 
          name: "Slack", 
          url: "slack.com", 
          category: "Communication", 
          timeSpent: 4200,
          visits: 24 
        },
        { 
          id: 5, 
          favicon: "https://www.twitter.com/favicon.ico", 
          name: "Twitter", 
          url: "twitter.com", 
          category: "Distracting", 
          timeSpent: 1800,
          visits: 7 
        },
      ]);
    }
  }, []);

  const handleVisitSite = (url: string) => {
    // Open website in a new tab
    window.open(`https://${url}`, '_blank');
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    
    return `${minutes}m`;
  };

  return (
    <Card className="w-full animate-scale-in shadow-soft transition-all hover:shadow-medium">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Website Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Website</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Time Spent</TableHead>
              <TableHead>Visits</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {websiteData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                  {isExtension 
                    ? "No website data recorded yet. Start browsing to track your activity."
                    : "Connect as a Chrome extension to track your website activity."}
                </TableCell>
              </TableRow>
            ) : (
              websiteData.map((site) => (
                <TableRow key={site.id} className="transition-colors hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={site.favicon} 
                        alt={`${site.name} favicon`} 
                        className="h-5 w-5"
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = 'https://placehold.co/20/lightgray/gray?text=W';
                        }}
                      />
                      <div>
                        <div>{site.name}</div>
                        <div className="text-xs text-muted-foreground">{site.url}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        site.category === 'Productive' 
                          ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200' 
                          : site.category === 'Distracting' 
                            ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200' 
                            : 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-200'
                      }
                    >
                      {site.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {formatTime(site.timeSpent)}
                    </div>
                  </TableCell>
                  <TableCell>{site.visits}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <button 
                        className="hover:text-primary transition-colors"
                        onClick={() => handleVisitSite(site.url)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WebsiteTracker;
