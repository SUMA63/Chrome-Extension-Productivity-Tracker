
import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between animate-fade-in">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <div className="h-4 w-4 rounded-full bg-white"></div>
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Distraction Dodger</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/10 text-primary text-sm">DD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
