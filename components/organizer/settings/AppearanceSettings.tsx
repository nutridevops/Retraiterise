'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Palette, Moon, Sun, Monitor } from 'lucide-react';

interface AppearanceSettingsProps {
  settings: {
    theme: 'light' | 'dark' | 'system';
    colorScheme: 'default' | 'blue' | 'green' | 'purple' | 'orange';
    fontSize: 'small' | 'medium' | 'large';
    reducedMotion: boolean;
    compactView: boolean;
  };
  onUpdate: (updates: Partial<AppearanceSettingsProps['settings']>) => void;
}

export function AppearanceSettings({ settings, onUpdate }: AppearanceSettingsProps) {
  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    onUpdate({ theme: value });
    
    // Apply theme immediately for better user experience
    const root = document.documentElement;
    if (value === 'dark') {
      root.classList.add('dark');
    } else if (value === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const handleColorSchemeChange = (value: 'default' | 'blue' | 'green' | 'purple' | 'orange') => {
    onUpdate({ colorScheme: value });
    
    // Apply color scheme immediately
    document.documentElement.setAttribute('data-color-scheme', value);
  };

  const handleFontSizeChange = (value: 'small' | 'medium' | 'large') => {
    onUpdate({ fontSize: value });
    
    // Apply font size immediately
    if (value === 'small') {
      document.documentElement.style.fontSize = '14px';
    } else if (value === 'medium') {
      document.documentElement.style.fontSize = '16px';
    } else {
      document.documentElement.style.fontSize = '18px';
    }
  };

  const handleToggle = (key: 'reducedMotion' | 'compactView') => {
    const newValue = !settings[key];
    onUpdate({ [key]: newValue });
    
    // Apply settings immediately
    if (key === 'reducedMotion') {
      if (newValue) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
    } else if (key === 'compactView') {
      if (newValue) {
        document.documentElement.classList.add('compact-view');
      } else {
        document.documentElement.classList.remove('compact-view');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="h-5 w-5 mr-2 text-[#c9a227]" />
          Apparence
        </CardTitle>
        <CardDescription>
          Personnalisez l'apparence de l'interface utilisateur
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-3">Thème</h3>
            <RadioGroup 
              value={settings.theme} 
              onValueChange={(value) => handleThemeChange(value as 'light' | 'dark' | 'system')}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem 
                  value="light" 
                  id="theme-light" 
                  className="sr-only"
                />
                <Label
                  htmlFor="theme-light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <Sun className="mb-2 h-6 w-6" />
                  Clair
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="dark" 
                  id="theme-dark" 
                  className="sr-only"
                />
                <Label
                  htmlFor="theme-dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <Moon className="mb-2 h-6 w-6" />
                  Sombre
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="system" 
                  id="theme-system" 
                  className="sr-only"
                />
                <Label
                  htmlFor="theme-system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <Monitor className="mb-2 h-6 w-6" />
                  Système
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Schéma de couleurs</h3>
            <RadioGroup 
              value={settings.colorScheme} 
              onValueChange={(value) => handleColorSchemeChange(value as 'default' | 'blue' | 'green' | 'purple' | 'orange')}
              className="grid grid-cols-5 gap-4"
            >
              <div>
                <RadioGroupItem 
                  value="default" 
                  id="color-default" 
                  className="sr-only"
                />
                <Label
                  htmlFor="color-default"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <div className="h-6 w-6 rounded-full bg-[#c9a227]" />
                  <span className="mt-2">Défaut</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="blue" 
                  id="color-blue" 
                  className="sr-only"
                />
                <Label
                  htmlFor="color-blue"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <div className="h-6 w-6 rounded-full bg-blue-500" />
                  <span className="mt-2">Bleu</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="green" 
                  id="color-green" 
                  className="sr-only"
                />
                <Label
                  htmlFor="color-green"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <div className="h-6 w-6 rounded-full bg-green-500" />
                  <span className="mt-2">Vert</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="purple" 
                  id="color-purple" 
                  className="sr-only"
                />
                <Label
                  htmlFor="color-purple"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <div className="h-6 w-6 rounded-full bg-purple-500" />
                  <span className="mt-2">Violet</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="orange" 
                  id="color-orange" 
                  className="sr-only"
                />
                <Label
                  htmlFor="color-orange"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <div className="h-6 w-6 rounded-full bg-orange-500" />
                  <span className="mt-2">Orange</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Taille de police</h3>
            <RadioGroup 
              value={settings.fontSize} 
              onValueChange={(value) => handleFontSizeChange(value as 'small' | 'medium' | 'large')}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem 
                  value="small" 
                  id="font-small" 
                  className="sr-only"
                />
                <Label
                  htmlFor="font-small"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <span className="text-sm">Aa</span>
                  <span className="mt-2">Petite</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="medium" 
                  id="font-medium" 
                  className="sr-only"
                />
                <Label
                  htmlFor="font-medium"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <span className="text-base">Aa</span>
                  <span className="mt-2">Moyenne</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem 
                  value="large" 
                  id="font-large" 
                  className="sr-only"
                />
                <Label
                  htmlFor="font-large"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <span className="text-lg">Aa</span>
                  <span className="mt-2">Grande</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reduced-motion">Réduire les animations</Label>
                <p className="text-sm text-muted-foreground">
                  Minimiser les animations et les transitions
                </p>
              </div>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={() => handleToggle('reducedMotion')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact-view">Vue compacte</Label>
                <p className="text-sm text-muted-foreground">
                  Réduire l'espacement entre les éléments pour afficher plus de contenu
                </p>
              </div>
              <Switch
                id="compact-view"
                checked={settings.compactView}
                onCheckedChange={() => handleToggle('compactView')}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
