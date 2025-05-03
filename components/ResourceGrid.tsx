'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ResourceCard } from '@/components/ResourceCard';
import { ResourceFilterBar, ResourceFilters } from '@/components/ResourceFilterBar';
import { Resource } from '@/lib/types';
import { Loader2 } from 'lucide-react';

// Define a generic interface that can work with both Resource types
interface ResourceGridProps<T extends Resource & { type: string }> {
  resources: T[];
  isLoading?: boolean;
  onEdit?: (resource: T) => void;
  onDelete?: () => void;
  compact?: boolean;
  showFilters?: boolean;
  className?: string;
}

export function ResourceGrid<T extends Resource & { type: string }>({
  resources,
  isLoading = false,
  onEdit,
  onDelete,
  compact = false,
  showFilters = true,
  className = '',
}: ResourceGridProps<T>) {
  const [filteredResources, setFilteredResources] = useState<T[]>(resources);
  const [filters, setFilters] = useState<ResourceFilters>({
    searchQuery: '',
    type: 'all',
    tags: [],
    sortBy: 'newest',
  });
  
  // Extract all unique tags from resources - memoized to prevent unnecessary recalculations
  const allTags = useMemo(() => {
    return Array.from(
      new Set(
        resources
          .flatMap(resource => resource.tags || [])
          .filter(Boolean)
      )
    );
  }, [resources]);
  
  // Apply filters and sorting when resources or filters change
  useEffect(() => {
    let result = [...resources];
    
    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        resource =>
          resource.title.toLowerCase().includes(query) ||
          (resource.description && resource.description.toLowerCase().includes(query)) ||
          (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply type filter
    if (filters.type !== 'all') {
      result = result.filter(resource => resource.type === filters.type);
    }
    
    // Apply tag filters
    if (filters.tags.length > 0) {
      result = result.filter(
        resource =>
          resource.tags &&
          filters.tags.some(tag => resource.tags?.includes(tag))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
        case 'oldest':
          return (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });
    
    setFilteredResources(result);
  }, [resources, filters]);
  
  // Handle filter changes - memoized with useCallback
  const handleFilterChange = useCallback((newFilters: ResourceFilters) => {
    setFilters(newFilters);
  }, []);
  
  return (
    <div className={`space-y-6 ${className}`}>
      {showFilters && (
        <ResourceFilterBar
          onFilterChange={handleFilterChange}
          availableTags={allTags}
        />
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#c9a227]" />
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">
            Aucune ressource ne correspond à vos critères de recherche.
          </p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'md:grid-cols-2 xl:grid-cols-3'} gap-6`}>
          {filteredResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onEdit={() => onEdit && onEdit(resource)}
              onDelete={onDelete}
              compact={compact}
            />
          ))}
        </div>
      )}
    </div>
  );
}
