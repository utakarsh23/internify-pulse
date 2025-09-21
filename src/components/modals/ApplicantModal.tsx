import { X, Mail, Calendar, FileText, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Applicant } from '@/services/api';

interface ApplicantModalProps {
  applicant: Applicant;
  isOpen: boolean;
  onClose: () => void;
  internshipId: string;
}

const ApplicantModal = ({ applicant, isOpen, onClose, internshipId }: ApplicantModalProps) => {
  if (!isOpen) return null;

  const handleAccept = async () => {
    try {
      // Call accept API
      console.log('Accepting applicant:', applicant.id);
      onClose();
    } catch (error) {
      console.error('Error accepting applicant:', error);
    }
  };

  const handleReject = async () => {
    try {
      // Call reject API
      console.log('Rejecting applicant:', applicant.id);
      onClose();
    } catch (error) {
      console.error('Error rejecting applicant:', error);
    }
  };

  return (
    <div className="glass-modal animate-fade-in" onClick={onClose}>
      <div 
        className="glass-card max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-primary text-primary-foreground p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-2xl font-bold">{applicant.name.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{applicant.name}</h2>
                <p className="text-primary-foreground/80">No title provided</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{applicant.email}</span>
                </div>
              </div>
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

        <div className="p-6 space-y-6">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">About</h3>
            <p className="text-muted-foreground">
              {applicant.resumeSummary || "Hey, it's Utkarsh, a backend developer."}
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {(applicant.skills || [
                    'Java', 'Python', 'C', 'Javascript', 'VS Code', 'IntelliJ',
                    'Git', 'Github', 'Canva', 'Figma', 'Postman', 'MS Office',
                    'Spring', 'SpringBoot', 'Flask', 'Node.js', 'Express.js',
                    'MongoDB', 'Tkinter', 'Numpy', 'Computer Networks',
                    'Arduino Programming', 'Frontend (Basics)', 'Data Structures And Algorithms',
                    'GraphQL', 'gRPC', 'SKILL-X', '3s', 'cs', 'mibmibmib',
                    'vsbr', 'jhsbjf', 'Backend Developer', 'backend Development'
                  ]).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Experience</h3>
                <div className="space-y-4">
                  {(applicant.experience || []).length === 0 ? (
                    <p className="text-muted-foreground">No experience listed</p>
                  ) : (
                    applicant.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-primary/30 pl-4">
                        <p className="font-medium">{exp}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Documents</h3>
                <div className="space-y-2">
                  {(applicant.documents || ['Resume.pdf']).map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 border rounded-lg">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{doc}</span>
                      <Button variant="outline" size="sm" className="ml-auto">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Match Analysis & Actions */}
            <div className="space-y-6">
              {/* AI Match Analysis */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>AI Match Analysis</span>
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Skill Similarity</span>
                      <span className="font-medium text-blue-600">
                        {applicant.matchScore?.skillSimilarity || 48.4}%
                      </span>
                    </div>
                    <Progress value={applicant.matchScore?.skillSimilarity || 48.4} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Profile Match</span>
                      <span className="font-medium text-purple-600">
                        {applicant.matchScore?.profileMatch || 82.5}%
                      </span>
                    </div>
                    <Progress value={applicant.matchScore?.profileMatch || 82.5} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Match</span>
                      <span className="font-medium text-orange-600">
                        {applicant.matchScore?.overallMatch || 67.0}%
                      </span>
                    </div>
                    <Progress value={applicant.matchScore?.overallMatch || 67.0} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Preferences</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Preferred Location:</strong> Remote / Pune</p>
                  <p><strong>Looking For:</strong> Summer Internship 2025</p>
                  <p><strong>Open to:</strong> Product, Strategy, Ops</p>
                </div>
              </div>

              {/* Contact */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Contact</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> {applicant.email}</p>
                  <p><strong>LinkedIn:</strong> https://www.linkedin.com/in/tripathiutkarsh/</p>
                  <p><strong>Website:</strong> https://github.com/utkarsh23</p>
                </div>
              </div>

              {/* Application Date */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Applied on {applicant.applicationDate || 'Oct 15, 2024'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex space-x-3">
              <Button variant="outline">Send Message</Button>
              <Button variant="outline">Download Resume</Button>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="destructive" 
                onClick={handleReject}
                disabled={applicant.status === 'rejected'}
              >
                Reject
              </Button>
              <Button 
                className="bg-gradient-primary" 
                onClick={handleAccept}
                disabled={applicant.status === 'accepted'}
              >
                Accept Application
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantModal;