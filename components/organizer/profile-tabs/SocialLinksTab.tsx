'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OrganizerProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Globe, Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';

interface SocialLinksTabProps {
  profile: OrganizerProfile;
  onProfileUpdate: (updatedProfile: Partial<OrganizerProfile>) => void;
}

export function SocialLinksTab({ profile, onProfileUpdate }: SocialLinksTabProps) {
  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    const updatedSocialLinks = {
      ...(profile.socialLinks || {}),
      [name]: value
    };
    
    onProfileUpdate({ socialLinks: updatedSocialLinks });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-[#c9a227]" />
          Liens sociaux
        </CardTitle>
        <CardDescription>
          Ajoutez vos liens vers vos réseaux sociaux et site web
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3">
          <Label htmlFor="website" className="flex items-center">
            <Globe className="h-4 w-4 mr-2 text-[#c9a227]" />
            Site web
          </Label>
          <Input
            id="website"
            name="website"
            value={profile.socialLinks?.website || ''}
            onChange={handleSocialLinkChange}
            placeholder="https://www.votresite.com"
            className="w-full"
          />
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="linkedin" className="flex items-center">
            <Linkedin className="h-4 w-4 mr-2 text-[#0077b5]" />
            LinkedIn
          </Label>
          <Input
            id="linkedin"
            name="linkedin"
            value={profile.socialLinks?.linkedin || ''}
            onChange={handleSocialLinkChange}
            placeholder="https://www.linkedin.com/in/votrenom"
            className="w-full"
          />
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="twitter" className="flex items-center">
            <Twitter className="h-4 w-4 mr-2 text-[#1da1f2]" />
            Twitter
          </Label>
          <Input
            id="twitter"
            name="twitter"
            value={profile.socialLinks?.twitter || ''}
            onChange={handleSocialLinkChange}
            placeholder="https://twitter.com/votrecompte"
            className="w-full"
          />
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="instagram" className="flex items-center">
            <Instagram className="h-4 w-4 mr-2 text-[#e1306c]" />
            Instagram
          </Label>
          <Input
            id="instagram"
            name="instagram"
            value={profile.socialLinks?.instagram || ''}
            onChange={handleSocialLinkChange}
            placeholder="https://www.instagram.com/votrecompte"
            className="w-full"
          />
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="facebook" className="flex items-center">
            <Facebook className="h-4 w-4 mr-2 text-[#4267B2]" />
            Facebook
          </Label>
          <Input
            id="facebook"
            name="facebook"
            value={profile.socialLinks?.facebook || ''}
            onChange={handleSocialLinkChange}
            placeholder="https://www.facebook.com/votrecompte"
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
