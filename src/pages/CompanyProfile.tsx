import { useState, useEffect } from 'react';
import { Building2, MapPin, Globe, Users, Edit3, Mail, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { companyAPI, Company } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const CompanyProfile = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Company>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const response = await companyAPI.getProfile();
      setCompany(response.data);
      setEditForm(response.data);
    } catch (error) {
      console.error('Error fetching company profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch company profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(company || {});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(company || {});
  };

  const handleSave = async () => {
    try {
      const response = await companyAPI.updateProfile(editForm);
      setCompany(response.data);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your company profile has been successfully updated."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: keyof Company, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-muted rounded-lg"></div>
                <div className="h-48 bg-muted rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-muted rounded-lg"></div>
                <div className="h-48 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Company Profile</h1>
            <p className="text-muted-foreground mt-1">
              Manage your company information and settings
            </p>
          </div>
          {!isEditing ? (
            <Button onClick={handleEdit} className="bg-gradient-primary">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Overview */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span>Company Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Company Name */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Company Name</label>
                  {isEditing ? (
                    <Input
                      value={editForm.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter company name"
                    />
                  ) : (
                    <p className="text-lg font-semibold">{company.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Contact Email</label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter contact email"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{company.email}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  {isEditing ? (
                    <Textarea
                      value={editForm.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your company"
                      rows={4}
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">{company.description}</p>
                  )}
                </div>

                {/* Industry */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Industry</label>
                  {isEditing ? (
                    <Input
                      value={editForm.industry || ''}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      placeholder="Enter industry"
                    />
                  ) : (
                    <Badge variant="secondary">{company.industry}</Badge>
                  )}
                </div>

                {/* Website */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Website</label>
                  {isEditing ? (
                    <Input
                      value={editForm.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="Enter website URL"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {company.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  {isEditing ? (
                    <Input
                      value={editForm.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Enter company location"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{company.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-accent rounded-lg">
                    <div className="text-3xl font-bold text-primary">{company.totalInternships}</div>
                    <div className="text-sm text-muted-foreground">Total Internships Posted</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-xl font-semibold">8</div>
                      <div className="text-xs text-muted-foreground">Active</div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-xl font-semibold">42</div>
                      <div className="text-xs text-muted-foreground">Applications</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New application received</p>
                      <p className="text-xs text-muted-foreground">Full-Stack Development Intern</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Internship posted</p>
                      <p className="text-xs text-muted-foreground">Backend Developer Intern</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Application deadline</p>
                      <p className="text-xs text-muted-foreground">Mobile App Development</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  View All Applications
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Create New Internship
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="h-4 w-4 mr-2" />
                  Company Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;