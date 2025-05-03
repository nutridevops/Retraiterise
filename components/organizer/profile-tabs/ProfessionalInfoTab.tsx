'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OrganizerProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Award, GraduationCap, Languages, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProfessionalInfoTabProps {
  profile: OrganizerProfile;
  onProfileUpdate: (updatedProfile: Partial<OrganizerProfile>) => void;
}

export function ProfessionalInfoTab({ profile, onProfileUpdate }: ProfessionalInfoTabProps) {
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onProfileUpdate({ [name]: value });
  };

  const handleAddSpecialty = () => {
    if (!newSpecialty.trim()) return;
    
    const updatedSpecialties = [...(profile.specialties || []), newSpecialty.trim()];
    onProfileUpdate({ specialties: updatedSpecialties });
    setNewSpecialty('');
  };

  const handleRemoveSpecialty = (specialty: string) => {
    const updatedSpecialties = (profile.specialties || []).filter(s => s !== specialty);
    onProfileUpdate({ specialties: updatedSpecialties });
  };

  const handleAddCertification = () => {
    if (!newCertification.trim()) return;
    
    const updatedCertifications = [...(profile.certifications || []), newCertification.trim()];
    onProfileUpdate({ certifications: updatedCertifications });
    setNewCertification('');
  };

  const handleRemoveCertification = (certification: string) => {
    const updatedCertifications = (profile.certifications || []).filter(c => c !== certification);
    onProfileUpdate({ certifications: updatedCertifications });
  };

  const handleAddLanguage = () => {
    if (!newLanguage.trim()) return;
    
    const updatedLanguages = [...(profile.languages || []), newLanguage.trim()];
    onProfileUpdate({ languages: updatedLanguages });
    setNewLanguage('');
  };

  const handleRemoveLanguage = (language: string) => {
    const updatedLanguages = (profile.languages || []).filter(l => l !== language);
    onProfileUpdate({ languages: updatedLanguages });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-[#c9a227]" />
            Spécialités
          </CardTitle>
          <CardDescription>
            Vos domaines d'expertise et spécialités
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {(profile.specialties || []).map((specialty, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {specialty}
                <button 
                  onClick={() => handleRemoveSpecialty(specialty)}
                  className="ml-1 rounded-full hover:bg-gray-200 p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              placeholder="Ajouter une spécialité"
              className="flex-1"
            />
            <Button 
              onClick={handleAddSpecialty}
              variant="outline"
              size="sm"
              className="flex-shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-[#c9a227]" />
            Certifications
          </CardTitle>
          <CardDescription>
            Vos certifications et accréditations professionnelles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {(profile.certifications || []).map((certification, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {certification}
                <button 
                  onClick={() => handleRemoveCertification(certification)}
                  className="ml-1 rounded-full hover:bg-gray-200 p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              placeholder="Ajouter une certification"
              className="flex-1"
            />
            <Button 
              onClick={handleAddCertification}
              variant="outline"
              size="sm"
              className="flex-shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Languages className="h-5 w-5 mr-2 text-[#c9a227]" />
            Langues
          </CardTitle>
          <CardDescription>
            Les langues que vous parlez
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {(profile.languages || []).map((language, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {language}
                <button 
                  onClick={() => handleRemoveLanguage(language)}
                  className="ml-1 rounded-full hover:bg-gray-200 p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Ajouter une langue"
              className="flex-1"
            />
            <Button 
              onClick={handleAddLanguage}
              variant="outline"
              size="sm"
              className="flex-shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-[#c9a227]" />
            Expérience professionnelle
          </CardTitle>
          <CardDescription>
            Votre parcours professionnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <Label htmlFor="experience">Expérience</Label>
            <Textarea
              id="experience"
              name="experience"
              value={profile.experience || ''}
              onChange={handleInputChange}
              placeholder="Décrivez votre expérience professionnelle..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-[#c9a227]" />
            Formation
          </CardTitle>
          <CardDescription>
            Votre parcours académique et formations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <Label htmlFor="education">Formation</Label>
            <Textarea
              id="education"
              name="education"
              value={profile.education || ''}
              onChange={handleInputChange}
              placeholder="Décrivez votre parcours académique et vos formations..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
