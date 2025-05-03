// src/pages/organizer/ResourceManagement.tsx
import React, { useState } from 'react';
import { 
  FileText, 
  Video, 
  Link as LinkIcon, 
  FileUp, 
  Search, 
  Filter, 
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  Users,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import OrganizerLayout from '@/components/layouts/OrganizerLayout';

// Mock data - would come from Firestore in a real implementation
const mockResources = [
  {
    id: '1',
    title: 'RISE Method Handbook',
    description: 'Complete guide to the RISE method and principles',
    type: 'pdf',
    tags: ['guide', 'method', 'theory'],
    createdAt: '2025-04-01T10:00:00',
    updatedAt: '2025-04-15T14:30:00',
    size: '2.4 MB',
    downloads: 42,
    visibleTo: 'all',
    thumbnail: '/path/to/thumbnail1.jpg'
  },
  {
    id: '2',
    title: 'Morning Routine Guide',
    description: 'Step-by-step guide to optimize your morning routine',
    type: 'pdf',
    tags: ['routine', 'morning', 'practice'],
    createdAt: '2025-04-05T11:30:00',
    updatedAt: '2025-04-05T11:30:00',
    size: '1.8 MB',
    downloads: 36,
    visibleTo: 'all',
    thumbnail: '/path/to/thumbnail2.jpg'
  },
  {
    id: '3',
    title: 'Neurofitness Exercise Video',
    description: 'Guided video for neurofitness exercises with Sandra',
    type: 'video',
    tags: ['exercise', 'neurofitness', 'practice'],
    createdAt: '2025-04-10T09:15:00',
    updatedAt: '2025-04-10T09:15:00',
    size: '158.3 MB',
    downloads: 27,
    visibleTo: 'all',
    thumbnail: '/path/to/thumbnail3.jpg'
  },
  {
    id: '4',
    title: 'Breathing Techniques PDF',
    description: 'Detailed guide on advanced breathing techniques',
    type: 'pdf',
    tags: ['breathing', 'technique', 'practice'],
    createdAt: '2025-04-12T16:45:00',
    updatedAt: '2025-04-20T10:20:00',
    size: '3.2 MB',
    downloads: 31,
    visibleTo: 'all',
    thumbnail: '/path/to/thumbnail4.jpg'
  },
  {
    id: '5',
    title: 'Meditation Audio Guide',
    description: 'Guided meditation sessions with Laetitia',
    type: 'audio',
    tags: ['meditation', 'audio', 'practice'],
    createdAt: '2025-04-15T14:30:00',
    updatedAt: '2025-04-15T14:30:00',
    size: '45.6 MB',
    downloads: 18,
    visibleTo: 'all',
    thumbnail: '/path/to/thumbnail5.jpg'
  }
];

const ResourceManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);
  
  // Filter resources based on search query and type filter
  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === null || resource.type === selectedType;
    
    return matchesSearch && matchesType;
  });
  
  const handleDeleteResource = (id: string) => {
    setResourceToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    // In a real app, this would call a Firebase function to delete the resource
    console.log(`Deleting resource: ${resourceToDelete}`);
    
    // Close dialog and reset state
    setIsDeleteDialogOpen(false);
    setResourceToDelete(null);
  };
  
  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-400" />;
      case 'video':
        return <Video className="h-5 w-5 text-purple-400" />;
      case 'audio':
        return <FileText className="h-5 w-5 text-blue-400" />;
      case 'link':
        return <LinkIcon className="h-5 w-5 text-green-400" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };
  
  return (
    <OrganizerLayout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-alta text-rise-gold mb-2">
                Resource Management
              </h1>
              <p className="text-white/80">
                Manage all client resources in one place
              </p>
            </div>
            <Button 
              className="bg-rise-gold text-rise-dark-green hover:bg-rise-gold/90 flex items-center gap-2"
              onClick={() => setIsAddResourceOpen(true)}
            >
              <FileUp className="h-4 w-4" />
              Add New Resource
            </Button>
          </div>
          
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
              <Input 
                placeholder="Search resources..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-rise-gold/30 text-white"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white/10 border-rise-gold/30 text-white flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {selectedType ? `Type: ${selectedType}` : 'Filter by Type'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedType(null)}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedType('pdf')}>
                  <FileText className="h-4 w-4 text-red-400 mr-2" />
                  PDF Documents
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedType('video')}>
                  <Video className="h-4 w-4 text-purple-400 mr-2" />
                  Videos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedType('audio')}>
                  <FileText className="h-4 w-4 text-blue-400 mr-2" />
                  Audio Files
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedType('link')}>
                  <LinkIcon className="h-4 w-4 text-green-400 mr-2" />
                  External Links
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Resources Table */}
          <div className="overflow-x-auto rounded-lg border border-rise-gold/30 bg-rise-dark-green/50 backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-rise-gold/30 hover:bg-transparent">
                  <TableHead className="text-rise-gold">Resource</TableHead>
                  <TableHead className="text-rise-gold">Type</TableHead>
                  <TableHead className="text-rise-gold">Size</TableHead>
                  <TableHead className="text-rise-gold">Downloads</TableHead>
                  <TableHead className="text-rise-gold">Last Updated</TableHead>
                  <TableHead className="text-rise-gold">Visibility</TableHead>
                  <TableHead className="text-rise-gold w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow 
                    key={resource.id} 
                    className="border-rise-gold/30 hover:bg-white/5"
                  >
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-2">
                        {getResourceTypeIcon(resource.type)}
                        <div>
                          <div>{resource.title}</div>
                          <div className="text-xs text-white/60">{resource.description}</div>
                          <div className="flex gap-1 mt-1">
                            {resource.tags.map((tag) => (
                              <Badge 
                                key={tag} 
                                variant="outline"
                                className="text-xs px-1 py-0 h-5 border-rise-gold/30 text-white/60"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/80 uppercase text-xs">
                      {resource.type}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {resource.size}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {resource.downloads}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {new Date(resource.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${
                          resource.visibleTo === 'all' 
                            ? 'bg-green-500/20 text-green-200 hover:bg-green-500/30' 
                            : 'bg-orange-500/20 text-orange-200 hover:bg-orange-500/30'
                        } border-none`}
                      >
                        {resource.visibleTo === 'all' ? 'All Clients' : 'Limited Access'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-white/60 hover:text-white hover:bg-white/10"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="flex items-center cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center cursor-pointer">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center cursor-pointer">
                            <Users className="h-4 w-4 mr-2" />
                            Manage Access
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="flex items-center text-red-400 cursor-pointer"
                            onClick={() => handleDeleteResource(resource.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredResources.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-white/60 py-8">
                      No resources found. Try adjusting your filters or add a new resource.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      {/* Add Resource Dialog - Would be a separate component in real implementation */}
      <Dialog open={isAddResourceOpen} onOpenChange={setIsAddResourceOpen}>
        <DialogContent className="bg-rise-dark-green border-rise-gold/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-rise-gold">Add New Resource</DialogTitle>
            <DialogDescription className="text-white/60">
              Upload a new resource for your clients
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Resource Title
              </label>
              <Input 
                id="title" 
                placeholder="Enter title..." 
                className="bg-white/10 border-rise-gold/30"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Input 
                id="description" 
                placeholder="Enter description..." 
                className="bg-white/10 border-rise-gold/30"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Resource Type
              </label>
              <select 
                id="type" 
                className="w-full bg-white/10 border-rise-gold/30 text-white rounded-md py-2 px-3"
              >
                <option value="pdf">PDF Document</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="link">External Link</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags (comma separated)
              </label>
              <Input 
                id="tags" 
                placeholder="Enter tags..." 
                className="bg-white/10 border-rise-gold/30"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="visibility" className="text-sm font-medium">
                Visibility
              </label>
              <select 
                id="visibility" 
                className="w-full bg-white/10 border-rise-gold/30 text-white rounded-md py-2 px-3"
              >
                <option value="all">All Clients</option>
                <option value="specific">Specific Clients</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="file" className="text-sm font-medium">
                Upload File
              </label>
              <div className="border-2 border-dashed border-rise-gold/30 rounded-md p-6 text-center">
                <FileUp className="mx-auto h-12 w-12 text-white/40" />
                <p className="mt-2 text-sm text-white/60">
                  Drag and drop a file here, or click to browse
                </p>
                <input
                  id="file"
                  type="file"
                  className="hidden"
                />
                <Button
                  onClick={() => document.getElementById('file')?.click()}
                  variant="outline"
                  className="mt-4 bg-white/10 border-rise-gold/30 hover:bg-white/20"
                >
                  Browse Files
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddResourceOpen(false)}
              className="border-rise-gold/30 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              className="bg-rise-gold text-rise-dark-green hover:bg-rise-gold/90"
              onClick={() => setIsAddResourceOpen(false)}
            >
              Upload Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-rise-dark-green border-rise-gold/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Delete Resource</DialogTitle>
            <DialogDescription className="text-white/60">
              Are you sure you want to delete this resource? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-rise-gold/30 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={confirmDelete}
            >
              Delete Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OrganizerLayout>
  );
};

export default ResourceManagement;