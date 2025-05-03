'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ResourceType } from '@/lib/types';

interface ResourceFilterBarProps {
  onFilterChange: (filters: ResourceFilters) => void;
  availableTags?: string[];
  showTypeFilter?: boolean;
  showTagFilter?: boolean;
  showSortOptions?: boolean;
  className?: string;
}

export interface ResourceFilters {
  searchQuery: string;
  type: ResourceType | 'all';
  tags: string[];
  sortBy: 'newest' | 'oldest' | 'title' | 'type';
}

export function ResourceFilterBar({
  onFilterChange,
  availableTags = [],
  showTypeFilter = true,
  showTagFilter = true,
  showSortOptions = true,
  className = '',
}: ResourceFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'type'>('newest');
  const [tagInput, setTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  // Update parent component when filters change
  const handleFilterChange = useCallback(() => {
    onFilterChange({
      searchQuery,
      type: selectedType,
      tags: selectedTags,
      sortBy,
    });
  }, [searchQuery, selectedType, selectedTags, sortBy, onFilterChange]);

  useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle resource type selection
  const handleTypeChange = (value: string) => {
    setSelectedType(value as ResourceType | 'all');
  };

  // Handle sort option selection
  const handleSortChange = (value: string) => {
    setSortBy(value as 'newest' | 'oldest' | 'title' | 'type');
  };

  // Handle tag input
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  // Add tag when Enter is pressed
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  // Add a tag
  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setTagInput('');
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  // Select a predefined tag
  const selectPredefinedTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedTags([]);
    setSortBy('newest');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des ressources..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-9"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2">
          {showTypeFilter && (
            <Select
              value={selectedType}
              onValueChange={handleTypeChange}
              defaultValue="all"
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="video">Vidéo</SelectItem>
                <SelectItem value="link">Lien</SelectItem>
                <SelectItem value="printable">Imprimable</SelectItem>
              </SelectContent>
            </Select>
          )}

          {showSortOptions && (
            <Select
              value={sortBy}
              onValueChange={handleSortChange}
              defaultValue="newest"
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Plus récent</SelectItem>
                <SelectItem value="oldest">Plus ancien</SelectItem>
                <SelectItem value="title">Titre</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>
          )}

          {showTagFilter && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowTagInput(!showTagInput)}
              className="shrink-0"
              title="Filtrer par tags"
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}

          {(searchQuery || selectedType !== 'all' || selectedTags.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="shrink-0"
            >
              Effacer
            </Button>
          )}
        </div>
      </div>

      {/* Tag selection UI */}
      {showTagFilter && showTagInput && (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Input
              placeholder="Ajouter un tag..."
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
              className="flex-grow"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addTag(tagInput)}
              className="shrink-0"
              disabled={!tagInput.trim()}
            >
              Ajouter
            </Button>
          </div>

          {/* Available tags */}
          {availableTags.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tags disponibles:</p>
              <div className="flex flex-wrap gap-1">
                {availableTags
                  .filter(tag => !selectedTags.includes(tag))
                  .map(tag => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => selectPredefinedTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* Selected tags */}
          {selectedTags.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tags sélectionnés:</p>
              <div className="flex flex-wrap gap-1">
                {selectedTags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="rounded-full hover:bg-muted p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
