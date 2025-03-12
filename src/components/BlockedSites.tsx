
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Clock } from 'lucide-react';
import { toast } from 'sonner';

// Type definition for a blocked site
interface BlockedSite {
  id: number;
  domain: string;
  active: boolean;
  schedule: string | null;
}

const BlockedSites = () => {
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([]);
  const [newSite, setNewSite] = useState('');
  const [isExtension, setIsExtension] = useState(false);
  
  // Check if running as extension and load data
  useEffect(() => {
    const isRunningAsExtension = !!window.chrome?.runtime?.id;
    setIsExtension(isRunningAsExtension);
    
    if (isRunningAsExtension) {
      // Load from Chrome storage
      chrome.runtime.sendMessage({ action: 'getBlockedSites' }, (response) => {
        if (response && response.data) {
          setBlockedSites(response.data);
        } else {
          // Initialize with empty array if no data
          chrome.storage.local.set({ blockedSites: [] });
        }
      });
    } else {
      // Use mock data in non-extension environment
      setBlockedSites([
        { id: 1, domain: "facebook.com", active: true, schedule: null },
        { id: 2, domain: "twitter.com", active: true, schedule: "9:00 - 17:00" },
        { id: 3, domain: "netflix.com", active: false, schedule: null },
        { id: 4, domain: "reddit.com", active: true, schedule: "9:00 - 17:00" },
        { id: 5, domain: "instagram.com", active: true, schedule: null },
      ]);
    }
  }, []);
  
  // Save changes to Chrome storage
  const saveBlockedSites = (sites: BlockedSite[]) => {
    if (isExtension) {
      chrome.runtime.sendMessage({ 
        action: 'updateBlockedSites', 
        sites 
      }, () => {
        toast.success("Blocked sites updated");
      });
    }
    setBlockedSites(sites);
  };
  
  const handleAddSite = () => {
    if (newSite.trim() === '') return;
    
    // Format domain (remove http/https/www)
    const formattedDomain = newSite.toLowerCase()
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
      .split('/')[0];
    
    // Check if already in the list
    if (blockedSites.some(site => site.domain === formattedDomain)) {
      toast.error("This site is already in your blocked list");
      return;
    }
    
    const newSiteObject = {
      id: Date.now(),
      domain: formattedDomain,
      active: true,
      schedule: null
    };
    
    const updatedSites = [newSiteObject, ...blockedSites];
    saveBlockedSites(updatedSites);
    setNewSite('');
    toast.success(`Added ${formattedDomain} to blocked sites`);
  };
  
  const handleRemoveSite = (id: number) => {
    const site = blockedSites.find(site => site.id === id);
    const updatedSites = blockedSites.filter(site => site.id !== id);
    saveBlockedSites(updatedSites);
    
    if (site) {
      toast.success(`Removed ${site.domain} from blocked sites`);
    }
  };
  
  const handleToggleSite = (id: number) => {
    const updatedSites = blockedSites.map(site => 
      site.id === id ? { ...site, active: !site.active } : site
    );
    
    const toggledSite = updatedSites.find(site => site.id === id);
    saveBlockedSites(updatedSites);
    
    if (toggledSite) {
      toast.success(
        toggledSite.active 
          ? `Blocking enabled for ${toggledSite.domain}` 
          : `Blocking disabled for ${toggledSite.domain}`
      );
    }
  };

  // Handle key press in input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSite();
    }
  };

  return (
    <Card className="w-full animate-scale-in shadow-soft transition-all hover:shadow-medium">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Blocked Sites</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-6">
          <Input
            type="text"
            placeholder="Enter website domain (e.g., facebook.com)"
            value={newSite}
            onChange={(e) => setNewSite(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleAddSite} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        
        <div className="space-y-3">
          {blockedSites.length === 0 ? (
            <div className="text-center text-muted-foreground py-6">
              No blocked sites yet. Add your first site above.
            </div>
          ) : (
            blockedSites.map((site) => (
              <div 
                key={site.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <Switch 
                    checked={site.active} 
                    onCheckedChange={() => handleToggleSite(site.id)}
                    className="data-[state=checked]:bg-primary"
                  />
                  <div>
                    <p className={`font-medium ${!site.active ? "text-muted-foreground" : ""}`}>{site.domain}</p>
                    {site.schedule && (
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {site.schedule}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  {site.active && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-600 mr-3">Blocked</Badge>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleRemoveSite(site.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockedSites;
