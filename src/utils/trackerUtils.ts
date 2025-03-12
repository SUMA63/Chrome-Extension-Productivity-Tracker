
// Types for our tracker data
export type Website = {
  id: number;
  url: string;
  name: string;
  favicon: string;
  category: 'Productive' | 'Distracting' | 'Communication' | 'Neutral';
  timeSpent: number; // in seconds
  visits: number;
};

export type BlockedSite = {
  id: number;
  domain: string;
  active: boolean;
  schedule: string | null;
};

export type ProductivityData = {
  time: string;
  productive: number;
  distracted: number;
};

// Helper functions for the tracker
export const formatTimeSpent = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
};

export const calculateProductivityScore = (
  productiveTime: number,
  distractedTime: number
): number => {
  const totalTime = productiveTime + distractedTime;
  if (totalTime === 0) return 0;
  
  const score = (productiveTime / totalTime) * 100;
  return Math.round(score);
};

export const getDomainFromUrl = (url: string): string => {
  try {
    // Remove protocol and path, just get the domain
    const domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
    return domain;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return url;
  }
};

// Check if a URL is blocked
export const isUrlBlocked = (url: string, blockedSites: BlockedSite[]): boolean => {
  const domain = getDomainFromUrl(url);
  
  return blockedSites.some(site => {
    if (!site.active) return false;
    
    // Check if the domain matches or if it's a subdomain
    const isMatch = site.domain === domain || domain.endsWith(`.${site.domain}`);
    
    // If there's a schedule, we would check time here
    if (isMatch && site.schedule) {
      const [startTime, endTime] = site.schedule.split(' - ');
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      const currentTimeValue = currentHour * 60 + currentMinute;
      const startTimeValue = startHour * 60 + startMinute;
      const endTimeValue = endHour * 60 + endMinute;
      
      return currentTimeValue >= startTimeValue && currentTimeValue <= endTimeValue;
    }
    
    return isMatch;
  });
};

// Helper to categorize websites based on their domain
export const categorizeWebsite = (domain: string): 'Productive' | 'Distracting' | 'Communication' | 'Neutral' => {
  // Common productive sites
  if (
    domain.includes('github') ||
    domain.includes('gitlab') ||
    domain.includes('stackoverflow') ||
    domain.includes('docs.google') ||
    domain.includes('notion') ||
    domain.includes('trello') ||
    domain.includes('asana') ||
    domain.includes('jira') ||
    domain.includes('figma') ||
    domain.includes('udemy') ||
    domain.includes('coursera')
  ) {
    return 'Productive';
  }
  
  // Common distracting sites
  if (
    domain.includes('facebook') ||
    domain.includes('twitter') ||
    domain.includes('instagram') ||
    domain.includes('tiktok') ||
    domain.includes('reddit') ||
    domain.includes('youtube') ||
    domain.includes('netflix') ||
    domain.includes('twitch') ||
    domain.includes('amazon')
  ) {
    return 'Distracting';
  }
  
  // Communication sites
  if (
    domain.includes('gmail') ||
    domain.includes('outlook') ||
    domain.includes('slack') ||
    domain.includes('teams') ||
    domain.includes('discord') ||
    domain.includes('zoom') ||
    domain.includes('meet.google')
  ) {
    return 'Communication';
  }
  
  // Default category
  return 'Neutral';
};
