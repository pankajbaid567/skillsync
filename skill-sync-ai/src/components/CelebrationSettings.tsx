/**
 * Celebration Settings Component
 * Allow users to control sound and haptic feedback
 */

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, VolumeX, Smartphone } from 'lucide-react';
import { 
  isSoundEnabled, 
  isHapticEnabled, 
  setSoundEnabled, 
  setHapticEnabled,
  quickCelebrate 
} from '@/lib/celebrations';
import { Button } from '@/components/ui/button';

export const CelebrationSettings = () => {
  const [sound, setSound] = useState(isSoundEnabled());
  const [haptic, setHaptic] = useState(isHapticEnabled());

  useEffect(() => {
    setSoundEnabled(sound);
  }, [sound]);

  useEffect(() => {
    setHapticEnabled(haptic);
  }, [haptic]);

  const testCelebration = () => {
    quickCelebrate.achievement('Test Celebration!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🎉</span> Celebration Settings
        </CardTitle>
        <CardDescription>
          Control how you experience achievements and milestones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sound Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {sound ? (
              <Volume2 className="h-5 w-5 text-primary" />
            ) : (
              <VolumeX className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <Label htmlFor="sound-toggle" className="text-base">
                Sound Effects
              </Label>
              <p className="text-sm text-muted-foreground">
                Play audio on achievements
              </p>
            </div>
          </div>
          <Switch
            id="sound-toggle"
            checked={sound}
            onCheckedChange={setSound}
          />
        </div>

        {/* Haptic Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className={`h-5 w-5 ${haptic ? 'text-primary' : 'text-muted-foreground'}`} />
            <div>
              <Label htmlFor="haptic-toggle" className="text-base">
                Haptic Feedback
              </Label>
              <p className="text-sm text-muted-foreground">
                Vibration on mobile devices
              </p>
            </div>
          </div>
          <Switch
            id="haptic-toggle"
            checked={haptic}
            onCheckedChange={setHaptic}
          />
        </div>

        {/* Test Button */}
        <Button 
          onClick={testCelebration}
          variant="outline" 
          className="w-full"
        >
          🎊 Test Celebration
        </Button>
      </CardContent>
    </Card>
  );
};
