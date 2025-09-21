import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { internshipAPI } from '@/services/api';

interface CreateInternshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateInternshipModal = ({ isOpen, onClose, onSuccess }: CreateInternshipModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    responsibilities: [''],
    skillsRequired: [''],
    openings: '',
    duration: '',
    applicationDeadline: '',
    stipend: '',
    location: {
      address: '',
      city: '',
      pinCode: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await internshipAPI.create({
        ...formData,
        responsibilities: formData.responsibilities.filter(r => r.trim()),
        skillsRequired: formData.skillsRequired.filter(s => s.trim()),
        openings: parseInt(formData.openings) || 0
      });
      
      toast({
        title: "Internship Created",
        description: "Your internship has been posted successfully."
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create internship. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-modal animate-fade-in" onClick={onClose}>
      <div 
        className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-primary text-primary-foreground p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Create New Internship</h2>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="title">Internship Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Full-Stack Developer Intern"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="e.g., Engineering"
              />
            </div>
            <div>
              <Label htmlFor="openings">Openings</Label>
              <Input
                id="openings"
                type="number"
                value={formData.openings}
                onChange={(e) => handleInputChange('openings', e.target.value)}
                placeholder="e.g., 3"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="e.g., 3 months"
              />
            </div>
            <div>
              <Label htmlFor="stipend">Stipend</Label>
              <Input
                id="stipend"
                value={formData.stipend}
                onChange={(e) => handleInputChange('stipend', e.target.value)}
                placeholder="e.g., ₹15000/month"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="deadline">Application Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.applicationDeadline}
              onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-primary"
              disabled={loading || !formData.title.trim()}
            >
              {loading ? 'Creating...' : 'Create Internship'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInternshipModal;