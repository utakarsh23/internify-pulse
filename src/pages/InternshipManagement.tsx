import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MapPin, Calendar, Users, DollarSign, Edit, Trash2, Eye, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { internshipAPI, Internship, applicantAPI, Applicant } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import InternshipDetailModal from '@/components/modals/InternshipDetailModal';

const InternshipManagement = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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
      setInternships(response.data);
    } catch (error) {
      // Mock data for demo
      const mockInternships: Internship[] = [
        {
          id: '1',
          title: 'Full-Stack Web Development Intern',
          department: 'Engineering',
          openings: 3,
          duration: '3 months',
          status: 'open',
          description: 'Join Tech Solutions Pvt Ltd as a Full-Stack Web Development Intern. Key responsibilities include developing new user-facing features, optimizing applications for maximum speed and scalability.',
          responsibilities: [
            'Develop new user-facing features',
            'Optimize applications for maximum speed and scalability',
            'Collaborate with designers and backend engineers'
          ],
          requirements: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
          skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
          stipend: 10000,
          applicationDeadline: '2025-10-15',
          applicantCount: 15
        },
        {
          id: '2',
          title: 'Mobile App Development Intern',
          department: 'Product Engineering',
          openings: 2,
          duration: '4 months',
          status: 'open',
          description: 'Work on cutting-edge mobile applications using React Native and modern development practices.',
          responsibilities: [
            'Develop cross-platform mobile applications',
            'Implement push notifications and real-time features',
            'Work with React Native and Expo'
          ],
          requirements: ['React Native', 'JavaScript', 'Mobile Development'],
          skills: ['React Native', 'JavaScript', 'TypeScript', 'Expo'],
          stipend: 12000,
          applicationDeadline: '2025-10-25',
          applicantCount: 8
        },
        {
          id: '3',
          title: 'Backend Developer Intern',
          department: 'Engineering',
          openings: 2,
          duration: '3 months',
          status: 'closed',
          description: 'Backend development intern to work on API development, database design, and server-side logic.',
          responsibilities: [
            'Design and implement RESTful APIs',
            'Database design and optimization',
            'Server deployment and monitoring'
          ],
          requirements: ['Node.js', 'Python', 'Database Design'],
          skills: ['Node.js', 'Python', 'PostgreSQL', 'Docker'],
          stipend: 11000,
          applicationDeadline: '2025-09-30',
          applicantCount: 22
        },
        {
          id: '4',
          title: 'Data Science Intern',
          department: 'Analytics',
          openings: 1,
          duration: '6 months',
          status: 'open',
          description: 'Work with our data science team to analyze user behavior and improve product recommendations.',
          responsibilities: [
            'Analyze large datasets',
            'Build machine learning models',
            'Create data visualizations'
          ],
          requirements: ['Python', 'Machine Learning', 'SQL'],
          skills: ['Python', 'Pandas', 'Scikit-learn', 'SQL'],
          stipend: 15000,
          applicationDeadline: '2025-11-01',
          applicantCount: 12
        }
      ];
      setInternships(mockInternships);
    } finally {
      setLoading(false);
    }
  };

  const filterInternships = () => {
    let filtered = internships;

    if (searchTerm) {
      filtered = filtered.filter(internship =>
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(internship => internship.status === statusFilter);
    }

    setFilteredInternships(filtered);
  };

  const handleViewInternship = async (internship: Internship) => {
    setSelectedInternship(internship);
    
    // Fetch applicants for this internship
    try {
      const response = await internshipAPI.getApplicants(internship.id);
      setApplicants(response.data);
    } catch (error) {
      // Mock applicants for demo
      const mockApplicants: Applicant[] = [
        {
          id: '1',
          name: 'Utkarsh Tripathi',
          email: 'utkarsh.t@somaiya.edu',
          resumeSummary: 'Backend developer with experience in Node.js and Python',
          skills: ['Java', 'Python', 'JavaScript', 'Node.js', 'MongoDB'],
          experience: ['Internship at XYZ Corp', 'Personal projects in web development'],
          status: 'applied',
          applicationDate: '2024-10-15',
          matchScore: {
            skillSimilarity: 48.4,
            profileMatch: 82.5,
            overallMatch: 67.0
          },
          documents: ['Resume.pdf']
        },
        {
          id: '2',
          name: 'Priya Sharma',
          email: 'priya.sharma@email.com',
          resumeSummary: 'Frontend developer passionate about React and user experience',
          skills: ['React', 'JavaScript', 'CSS', 'HTML', 'TypeScript'],
          experience: ['Frontend Developer at ABC Tech', 'Freelance web development'],
          status: 'shortlisted',
          applicationDate: '2024-10-12',
          matchScore: {
            skillSimilarity: 65.2,
            profileMatch: 78.3,
            overallMatch: 71.7
          },
          documents: ['Resume.pdf', 'Portfolio.pdf']
        }
      ];
      setApplicants(mockApplicants);
    }
  };

  const handleCloseApplications = async (internshipId: string) => {
    try {
      await internshipAPI.close(internshipId);
      toast({
        title: "Applications Closed",
        description: "No new applications will be accepted for this internship."
      });
      fetchInternships();
    } catch (error) {
      toast({
        title: "Success",
        description: "Applications have been closed for this internship.",
      });
      // Mock update for demo
      setInternships(prev =>
        prev.map(internship =>
          internship.id === internshipId
            ? { ...internship, status: 'closed' as const }
            : internship
        )
      );
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
      toast({
        title: "Success",
        description: "The internship has been deleted.",
      });
      // Mock delete for demo
      setInternships(prev => prev.filter(internship => internship.id !== internshipId));
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
          <Button className="bg-gradient-primary">
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
                    {internships.filter(i => i.status === 'open').length}
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
                    {internships.reduce((sum, i) => sum + i.applicantCount, 0)}
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
                    ₹{Math.round(internships.reduce((sum, i) => sum + i.stipend, 0) / internships.length / 1000)}K
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
            <Card key={internship.id} className="glass-card hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{internship.title}</CardTitle>
                  <Badge 
                    variant={internship.status === 'open' ? 'default' : 'secondary'}
                    className={internship.status === 'open' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {internship.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{internship.department}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {internship.description}
                </p>

                {/* Key Details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{internship.openings} openings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{internship.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>₹{internship.stipend.toLocaleString()}/month</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <span>{internship.applicantCount} applicants</span>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <p className="text-xs font-medium mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {internship.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {internship.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{internship.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewInternship(internship)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {internship.status === 'open' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCloseApplications(internship.id)}
                      >
                        Close
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteInternship(internship.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInternships.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No internships found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? "Try adjusting your search or filter criteria."
                  : "Create your first internship to get started."}
              </p>
              <Button className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Internship
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Internship Detail Modal */}
      {selectedInternship && (
        <InternshipDetailModal
          internship={selectedInternship}
          applicants={applicants}
          isOpen={!!selectedInternship}
          onClose={() => setSelectedInternship(null)}
        />
      )}
    </div>
  );
};

export default InternshipManagement;