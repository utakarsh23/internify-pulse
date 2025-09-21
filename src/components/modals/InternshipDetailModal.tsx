import { useState } from 'react';
import { X, MapPin, Calendar, Users, DollarSign, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Internship, Applicant } from '@/services/api';
import ApplicantModal from './ApplicantModal';

interface InternshipDetailModalProps {
  internship: Internship;
  isOpen: boolean;
  onClose: () => void;
  applicants?: Applicant[];
}

const InternshipDetailModal = ({
  internship,
  isOpen,
  onClose,
  applicants = []
}: InternshipDetailModalProps) => {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  if (!isOpen) return null;

  const skillDistribution = [
    { skill: 'JavaScript', count: 15, percentage: 75 },
    { skill: 'React', count: 12, percentage: 60 },
    { skill: 'Node.js', count: 10, percentage: 50 },
    { skill: 'MongoDB', count: 8, percentage: 40 },
  ];

  return (
    <>
      <div className="glass-modal animate-fade-in" onClick={onClose}>
        <div 
          className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-primary text-primary-foreground p-6 rounded-t-2xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{internship.title}</h2>
                <div className="flex items-center space-x-2 text-primary-foreground/90">
                  <Building className="h-4 w-4" />
                  <span>Tech Solutions Pvt Ltd</span>
                </div>
                <div className="flex items-center space-x-4 mt-3 text-sm">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>Bengaluru, 123 Innovation Park, Sector 21</span>
                  </div>
                  <span className="text-primary-foreground/70">On-site</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold">4.1</div>
                  <div className="text-sm opacity-90">Match Rating</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Job Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Job Description</h3>
              <p className="text-muted-foreground">
                {internship.description || "Join Tech Solutions Pvt Ltd as a Full-Stack Web Development Intern. Key responsibilities include Develop new user-facing features, Optimize applications for maximum speed and scalability and more."}
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Key Responsibilities */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Responsibilities</h3>
                  <ul className="space-y-2">
                    {(internship.responsibilities || [
                      "Develop new user-facing features",
                      "Optimize applications for maximum speed and scalability",
                      "Collaborate with designers and backend engineers"
                    ]).map((responsibility, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills & Requirements */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Skills & Requirements</h3>
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Skills Needed</p>
                    <Badge className="skill-tag skill-tag-engineering">Engineering</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Requirements</p>
                    <div className="flex flex-wrap gap-2">
                      {(internship.skills || ['JavaScript', 'React', 'Node.js', 'MongoDB']).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Job Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{internship.duration || '3 months'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Openings</p>
                      <p className="font-medium">{internship.openings || '3 positions'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stipend</p>
                      <p className="font-medium">₹{internship.stipend || '10,000'}/month</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Apply by</p>
                      <p className="font-medium">{internship.applicationDeadline || '10/15/2025'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium">{internship.department || 'Engineering'}</p>
                    </div>
                  </div>
                </div>

                {/* Skill Distribution Chart */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Current Applicant Skills</h3>
                  <div className="space-y-3">
                    {skillDistribution.map((item) => (
                      <div key={item.skill} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.skill}</span>
                          <span>{item.count} applicants ({item.percentage}%)</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Company Info & Applicants */}
              <div className="space-y-6">
                {/* Company Info */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <Building className="h-4 w-4 text-primary" />
                    <span>Company Info</span>
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Tech Solutions Pvt Ltd</strong></p>
                    <p className="text-muted-foreground">Mumbai</p>
                    <p className="text-muted-foreground">
                      Full Address:<br />
                      123 Innovation Park, Sector 21<br />
                      Bengaluru - 560001
                    </p>
                    <p className="text-muted-foreground">
                      Website: <span className="text-primary">techsolutions.com</span>
                    </p>
                  </div>
                </div>

                {/* Applicants List */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center justify-between">
                    <span>Applicants ({applicants.length})</span>
                    <Users className="h-4 w-4 text-primary" />
                  </h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {applicants.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No applicants yet</p>
                    ) : (
                      applicants.map((applicant) => (
                        <div
                          key={applicant.id}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                          onClick={() => setSelectedApplicant(applicant)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{applicant.name}</p>
                              <p className="text-xs text-muted-foreground">{applicant.email}</p>
                              <div className="mt-1">
                                <div className="flex items-center space-x-1 text-xs">
                                  <span>Match:</span>
                                  <span className="font-medium text-primary">
                                    {applicant.matchScore?.overallMatch || 85}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge 
                              variant={applicant.status === 'accepted' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {applicant.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex space-x-3">
                <Button variant="outline">Edit Internship</Button>
                <Button variant="outline">Close Applications</Button>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline">Save for Later</Button>
                <Button className="bg-gradient-primary">View All Applications</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applicant Detail Modal */}
      {selectedApplicant && (
        <ApplicantModal
          applicant={selectedApplicant}
          isOpen={!!selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          internshipId={internship.id}
        />
      )}
    </>
  );
};

export default InternshipDetailModal;