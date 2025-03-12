
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SettingsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const SettingsModal = ({ open, onOpenChange }: SettingsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your productivity tracker preferences
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="blocking">Blocking</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="startup">Launch on startup</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically start the app when you log in
                </p>
              </div>
              <Switch id="startup" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sync">Sync across devices</Label>
                <p className="text-sm text-muted-foreground">
                  Keep your stats and settings in sync
                </p>
              </div>
              <Switch id="sync" defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pomodoro">Pomodoro duration</Label>
              <Select defaultValue="25">
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="20">20 minutes</SelectItem>
                  <SelectItem value="25">25 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="blocking" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="strict">Strict mode</Label>
                <p className="text-sm text-muted-foreground">
                  Can't disable blocking during focus sessions
                </p>
              </div>
              <Switch id="strict" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="schedule">Schedule blocking</Label>
                <p className="text-sm text-muted-foreground">
                  Set specific hours for site blocking
                </p>
              </div>
              <Switch id="schedule" defaultChecked />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start time</Label>
                <Input type="time" id="start-time" defaultValue="09:00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End time</Label>
                <Input type="time" id="end-time" defaultValue="17:00" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="break-notif">Break reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when it's time for a break
                </p>
              </div>
              <Switch id="break-notif" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="goal-notif">Goal achievements</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications when you reach daily goals
                </p>
              </div>
              <Switch id="goal-notif" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="distraction-notif">Distraction alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get warned when spending too much time on distracting sites
                </p>
              </div>
              <Switch id="distraction-notif" />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
