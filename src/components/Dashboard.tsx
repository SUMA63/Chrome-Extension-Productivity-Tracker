
import React from 'react';
import ProductivityChart from './ProductivityChart';
import WebsiteTracker from './WebsiteTracker';
import BlockedSites from './BlockedSites';
import FocusTimer from './FocusTimer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Clock, ShieldAlert, Target } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="animate-slide-up" style={{ animationDelay: "0ms" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+2.5% from yesterday</p>
            <div className="mt-2 h-1 w-full bg-secondary">
              <div className="h-1 bg-primary" style={{ width: "87%" }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-up" style={{ animationDelay: "50ms" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Productive Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5h 24m</div>
            <p className="text-xs text-muted-foreground">Today's tracked time</p>
            <div className="mt-2 h-1 w-full bg-secondary">
              <div className="h-1 bg-primary" style={{ width: "65%" }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sites Visited</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Across 4 categories</p>
            <div className="mt-2 flex space-x-1">
              <div className="h-1 flex-1 bg-primary"></div>
              <div className="h-1 flex-1 bg-blue-400"></div>
              <div className="h-1 flex-1 bg-blue-300"></div>
              <div className="h-1 flex-1 bg-blue-200"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-up" style={{ animationDelay: "150ms" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Distractions Blocked</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">27</div>
            <p className="text-xs text-muted-foreground">Saving approx. 45 minutes</p>
            <div className="mt-2 h-1 w-full bg-secondary">
              <div className="h-1 bg-primary" style={{ width: "27%" }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full animate-fade-in">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="websites">Websites</TabsTrigger>
          <TabsTrigger value="blocking">Blocking</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProductivityChart />
            </div>
            <div>
              <FocusTimer />
            </div>
          </div>
          <div>
            <WebsiteTracker />
          </div>
        </TabsContent>
        
        <TabsContent value="websites">
          <WebsiteTracker />
        </TabsContent>
        
        <TabsContent value="blocking">
          <BlockedSites />
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">Detailed reports coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
