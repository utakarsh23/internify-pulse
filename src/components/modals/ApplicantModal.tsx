import { X, Mail, Calendar, FileText, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, applicantAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface ApplicantModalProps {
  applicant: User;
  isOpen: boolean;
  onClose: () => void;
  internshipId: string;
}

const ApplicantModal = ({ applicant, isOpen, onClose, internshipId }: ApplicantModalProps) => {
  const { toast } = useToast();
  
  if (!isOpen) return null;

  const handleAccept = async () => {
    try {
      await applicantAPI.accept(internshipId, applicant._id);
      toast({
        title: "Application Accepted",
        description: `${applicant.name}'s application has been accepted.`
      });
      onClose();
    } catch (error) {
      console.error('Error accepting applicant:', error);
      toast({
        title: "Error",
        description: "Failed to accept application. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReject = async () => {
    try {
      await applicantAPI.reject(internshipId, applicant._id);
      toast({
        title: "Application Rejected",
        description: `${applicant.name}'s application has been rejected.`
      });
      onClose();
    } catch (error) {
      console.error('Error rejecting applicant:', error);
      toast({
        title: "Error",
        description: "Failed to reject application. Please try again.",
        variant: "destructive"
      });
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
              {applicant.about || "No description available."}
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
                  {(applicant.resume?.skills || []).map((skill) => (
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
                  {(applicant.experience?.internships || []).length === 0 ? (
                    <p className="text-muted-foreground">No experience listed</p>
                  ) : (
                    applicant.experience.internships.map((exp, index) => (
                      <div key={index} className="border-l-2 border-primary/30 pl-4">
                        <p className="font-medium">{exp.title} at {exp.company}</p>
                        <p className="text-sm text-muted-foreground">{exp.duration}</p>
                        <p className="text-sm text-muted-foreground">{exp.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Documents</h3>
                <div className="space-y-2">
                  {applicant.resumeDoc ? (
                    <div className="flex items-center space-x-2 p-2 border rounded-lg">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{applicant.resumeDoc.filename || 'Resume.pdf'}</span>
                      <Button variant="outline" size="sm" className="ml-auto">
                        View
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No documents uploaded</p>
                  )}
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
                      <span>Resume Skills Match</span>
                      <span className="font-medium text-blue-600">
                        {Math.round((applicant.resume?.skills?.length || 0) * 10)}%
                      </span>
                    </div>
                    <Progress value={(applicant.resume?.skills?.length || 0) * 10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Profile Completeness</span>
                      <span className="font-medium text-purple-600">
                        {applicant.about && applicant.resume?.skills?.length ? '85' : '45'}%
                      </span>
                    </div>
                    <Progress value={applicant.about && applicant.resume?.skills?.length ? 85 : 45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Match</span>
                      <span className="font-medium text-orange-600">
                        {Math.round(((applicant.resume?.skills?.length || 0) * 5 + (applicant.about ? 40 : 20)) / 2)}%
                      </span>
                    </div>
                    <Progress value={Math.round(((applicant.resume?.skills?.length || 0) * 5 + (applicant.about ? 40 : 20)) / 2)} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Preferences</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Preferred Location:</strong> {applicant.residence?.city || 'Not specified'}</p>
                  <p><strong>Field:</strong> {applicant.field || 'Not specified'}</p>
                  <p><strong>Phone:</strong> {applicant.phoneNumber || 'Not provided'}</p>
                </div>
              </div>

              {/* Contact */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Contact</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> {applicant.email}</p>
                  <p><strong>LinkedIn:</strong> {applicant.resume?.socialLinks?.linkedin || 'Not provided'}</p>
                  <p><strong>GitHub:</strong> {applicant.resume?.socialLinks?.github || 'Not provided'}</p>
                </div>
              </div>

              {/* Application Date */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Profile created {new Date().toLocaleDateString()}</span>
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
              >
                Reject
              </Button>
              <Button 
                className="bg-gradient-primary" 
                onClick={handleAccept}
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