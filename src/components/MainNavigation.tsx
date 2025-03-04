
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, BookText, FileText, BarChart3, PersonStanding, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import ResearchToolsPanel from '@/components/legal-research/ResearchToolsPanel';

const MainNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isResearchPanelOpen, setIsResearchPanelOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-20 border-b bg-background/80 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/')}
                className="text-lg font-bold mr-8"
              >
                Legal<span className="text-primary">Assistant</span>
              </button>
              
              <nav className="hidden md:flex items-center space-x-1">
                <Button
                  variant={isActive('/query-assistant') ? 'default' : 'ghost'}
                  className="h-9"
                  onClick={() => navigate('/query-assistant')}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Query Assistant
                </Button>
                
                <Button
                  variant={isActive('/document-drafting') ? 'default' : 'ghost'}
                  className="h-9"
                  onClick={() => navigate('/document-drafting')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Document Drafting
                </Button>
                
                <Button
                  variant={isActive('/case-management') ? 'default' : 'ghost'}
                  className="h-9"
                  onClick={() => navigate('/case-management')}
                >
                  <BookText className="h-4 w-4 mr-2" />
                  Case Management
                </Button>
                
                <Button
                  variant={isActive('/case-analytics') ? 'default' : 'ghost'}
                  className="h-9"
                  onClick={() => navigate('/case-analytics')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsResearchPanelOpen(true)}
                className="relative"
              >
                <BookOpen className="h-5 w-5" />
              </Button>
              
              <NotificationCenter />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/profile')}
                className="relative"
              >
                <PersonStanding className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <ResearchToolsPanel 
        isVisible={isResearchPanelOpen} 
        onClose={() => setIsResearchPanelOpen(false)} 
      />
    </>
  );
};

export default MainNavigation;
