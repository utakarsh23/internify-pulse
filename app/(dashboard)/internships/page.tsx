'use client'

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MapPin, Calendar, Users, DollarSign, Edit, Trash2, Eye, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { internshipAPI, Internship, Application, User } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const InternshipManagement = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    filterInternships();
  }, [internships, searchTerm, statusFilter]);

  const fetchInternships = async () => {
    try {
      const response = await internshipAPI.getAll();
      setInternships(response.data.internships);
    } catch (error) {
      console.error('Error fetching internships:', error);
      toast({
        title: "Error",
        description: "Failed to fetch internships. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterInternships = () => {
    let filtered = internships;

    if (searchTerm) {
      filtered = filtered.filter(internship =>
        internship.internshipDetails.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.internshipDetails.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      const isOpen = statusFilter === 'open';
      filtered = filtered.filter(internship => internship.status === isOpen);
    }

    setFilteredInternships(filtered);
  };

  const handleViewInternship = async (internship: Internship) => {
    setSelectedInternship(internship);
    
    // Fetch applications for this internship
    try {
      const response = await internshipAPI.getApplicants(internship._id);
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch applications. Please try again.",
        variant: "destructive"
      });
      setApplications([]);
    }
  };

  const handleCloseApplications = async (internshipId: string) => {
    try {
      await internshipAPI.close(internshipId);
      toast({
        title: "Applications Status Updated",
        description: "Internship application status has been updated."
      });
      fetchInternships();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteInternship = async (internshipId: string) => {
    try {
      await internshipAPI.delete(internshipId);
      toast({
        title: "Internship Deleted",
        description: "The internship has been successfully deleted."
      });
      fetchInternships();
    } catch (error) {
      console.error('Error deleting internship:', error);
      toast({
        title: "Error",
        description: "Failed to delete internship. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Internship Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage your posted internships and applications
            </p>
          </div>
          <Button 
            className="bg-gradient-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Internship
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search internships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{internships.length}</div>
                  <div className="text-xs text-muted-foreground">Total Internships</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {internships.filter(i => i.status === true).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {internships.reduce((sum, i) => sum + (i.applications?.length || 0), 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Applications</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <DollarSign className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    ₹{Math.round(internships.reduce((sum, i) => {
                      const stipend = parseInt(i.internshipDetails.stipend?.replace(/[^\d]/g, '') || '0');
                      return sum + stipend;
                    }, 0) / (internships.length || 1) / 1000)}K
                  </div>
                  <div className="text-xs text-muted-foreground">Avg. Stipend</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Internships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.map((internship) => (
            <Card key={internship._id} className="glass-card hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{internship.internshipDetails.title}</CardTitle>
                  <Badge 
                    variant={internship.status ? 'default' : 'secondary'}
                    className={internship.status ? 'bg-green-100 text-green-800' : ''}
                  >
                    {internship.status ? 'open' : 'closed'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{internship.internshipDetails.department}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {internship.internshipDetails.responsibilities?.join(', ') || 'No description available'}
                </p>

                {/* Key Details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{internship.internshipDetails.openings || 0} openings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{internship.internshipDetails.duration || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{internship.internshipDetails.stipend || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <span>{internship.applications?.length || 0} applicants</span>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <p className="text-xs font-medium mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {(internship.internshipDetails.skillsRequired || []).slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {(internship.internshipDetails.skillsRequired || []).length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(internship.internshipDetails.skillsRequired || []).length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-2">
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewInternship(internship)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <div className="flex space-x-1">
                    {internship.status && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCloseApplications(internship._id)}
                      >
                        Close
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteInternship(internship._id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInternships.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No internships found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search criteria or filters.' 
                : 'Get started by creating your first internship posting.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Internship
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipManagement;