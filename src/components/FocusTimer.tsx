
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const FocusTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [initialTime] = useState(25 * 60);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setTime(initialTime);
  };
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const progress = ((initialTime - time) / initialTime) * 100;

  return (
    <Card className="w-full h-[300px] flex flex-col animate-scale-in shadow-soft transition-all hover:shadow-medium">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Focus Timer</CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            Pomodoro
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-light tracking-tight mb-4">{formatTime(time)}</div>
            <Progress value={progress} className="h-2 mb-6" />
            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-12 w-12 border-2"
                onClick={toggleTimer}
              >
                {isActive ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-12 w-12 border-2"
                onClick={resetTimer}
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-center text-muted-foreground mt-4">
          Focus for 25 minutes, then take a 5 minute break
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusTimer;
