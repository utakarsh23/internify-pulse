import { Building2, User, LogOut, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface NavbarProps {
  companyName?: string;
}

const Navbar = ({ companyName = "TechCorp" }: NavbarProps) => {
  const location = useLocation();

  const navItems = [
    { path: '/profile', label: 'Company Profile', icon: Building2 },
    { path: '/internships', label: 'Internships', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="h-16 bg-gradient-primary shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo and Company Name */}
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-primary-foreground" />
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">{companyName}</h1>
              <p className="text-primary-foreground/80 text-sm">Dashboard</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10 hidden sm:flex"
            >
              <Bell className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary-foreground text-primary">
                  {companyName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => {
                  localStorage.removeItem('authToken');
                  window.location.href = '/login';
                }}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-primary-dark">
        <div className="px-4 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                  isActive(item.path)
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'text-primary-foreground/80'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;