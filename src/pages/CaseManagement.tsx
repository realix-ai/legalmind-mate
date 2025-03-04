
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import CaseCard from '@/components/CaseCard';
import { 
  Plus, 
  Search,
  SlidersHorizontal,
  X,
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  AlertTriangle,
  FileText,
  MessageSquare,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Case as CaseType, getCases, createCase, getCase, getCaseDocuments } from '@/utils/documents';

const CaseManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [cases, setCases] = useState<CaseType[]>([]);
  const [newCaseName, setNewCaseName] = useState('');
  const [isCreateCaseDialogOpen, setIsCreateCaseDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [caseData, setCaseData] = useState<any | null>(null);
  const [caseDocuments, setCaseDocuments] = useState<any[]>([]);
  
  // Initialize with cases from storage
  useEffect(() => {
    const loadCases = () => {
      try {
        const storedCases = getCases();
        setCases(storedCases);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading cases:', error);
        setIsLoading(false);
      }
    };
    
    loadCases();
  }, []);

  // Load case details when a case is selected
  useEffect(() => {
    if (selectedCase) {
      const caseInfo = getCase(selectedCase);
      if (caseInfo) {
        setCaseData({
          ...caseInfo,
          // Demo data for UI - in a real app, this would be fetched from a database
          caseNumber: `CASE-${caseInfo.id.substring(5, 10)}`,
          clientName: 'Client Name', // This would be fetched from the database
          date: new Date(caseInfo.createdAt).toLocaleDateString(),
          status: 'active',
          priority: 'medium',
          description: `Case details for ${caseInfo.name}`,
          nextHearing: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          assignedTo: ['Case Manager'],
        });
        
        // Load case documents
        const docs = getCaseDocuments(selectedCase);
        setCaseDocuments(docs.map(doc => ({
          id: doc.id,
          name: doc.title,
          type: 'Document',
          date: new Date(doc.lastModified).toLocaleDateString()
        })));
      }
    }
  }, [selectedCase]);

  const handleCreateCase = () => {
    if (!newCaseName.trim()) {
      toast.error('Please enter a case name');
      return;
    }
    
    try {
      const newCase = createCase(newCaseName);
      setCases([...cases, newCase]);
      setNewCaseName('');
      setIsCreateCaseDialogOpen(false);
      toast.success('Case created successfully');
    } catch (error) {
      console.error('Error creating case:', error);
      toast.error('Failed to create case');
    }
  };

  const handleCaseClick = (caseId: string) => {
    // Navigate to case chat
    navigate(`/case-chat/${caseId}`);
  };
  
  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch = caseItem.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // For demo purposes, we don't have real status/priority data, so we'll return all cases
    // In a real app, you would filter based on case status and priority
    return matchesSearch;
  });
  
  const resetFilters = () => {
    setStatusFilter([]);
    setPriorityFilter([]);
    setSearchQuery('');
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };
  
  return (
    <div className="min-h-screen pb-16">
      <Navigation />
      
      <main className="container max-w-7xl mx-auto pt-24 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold">Case Management</h1>
              <p className="text-muted-foreground mt-1">Track and manage all your legal cases</p>
            </div>
            
            <Dialog open={isCreateCaseDialogOpen} onOpenChange={setIsCreateCaseDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 self-start">
                  <Plus className="h-4 w-4" />
                  New Case
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Case</DialogTitle>
                  <DialogDescription>
                    Add details for your new case.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="caseName" className="text-right">
                      Case Name
                    </Label>
                    <Input
                      id="caseName"
                      value={newCaseName}
                      onChange={(e) => setNewCaseName(e.target.value)}
                      className="col-span-3"
                      placeholder="Enter case name"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateCase}>Create Case</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background"
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {(statusFilter.length > 0 || priorityFilter.length > 0) && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                  {statusFilter.length + priorityFilter.length}
                </span>
              )}
            </Button>
          </motion.div>
          
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-8 border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Filters</h3>
                <button
                  className="text-sm text-muted-foreground hover:text-foreground"
                  onClick={resetFilters}
                >
                  Reset all
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {['active', 'pending', 'closed'].map((status) => (
                      <button
                        key={status}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          statusFilter.includes(status)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                        onClick={() => {
                          if (statusFilter.includes(status)) {
                            setStatusFilter(statusFilter.filter(s => s !== status));
                          } else {
                            setStatusFilter([...statusFilter, status]);
                          }
                        }}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Priority</h4>
                  <div className="flex flex-wrap gap-2">
                    {['high', 'medium', 'low'].map((priority) => (
                      <button
                        key={priority}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          priorityFilter.includes(priority)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                        onClick={() => {
                          if (priorityFilter.includes(priority)) {
                            setPriorityFilter(priorityFilter.filter(p => p !== priority));
                          } else {
                            setPriorityFilter([...priorityFilter, priority]);
                          }
                        }}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredCases.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCases.map((caseItem) => (
                <motion.div key={caseItem.id} variants={itemVariants}>
                  <CaseCard
                    title={caseItem.name}
                    caseNumber={`CASE-${caseItem.id.substring(5, 10)}`}
                    clientName="Client"
                    date={new Date(caseItem.createdAt).toLocaleDateString()}
                    status="active"
                    priority="medium"
                    onClick={() => handleCaseClick(caseItem.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-16 border rounded-lg"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No cases found</h3>
              <p className="text-muted-foreground mb-6">
                {cases.length === 0 
                  ? "You haven't created any cases yet. Click 'New Case' to get started."
                  : "Try adjusting your search or filters to find what you're looking for."}
              </p>
              {cases.length === 0 ? (
                <Button onClick={() => setIsCreateCaseDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first case
                </Button>
              ) : (
                <Button variant="outline" onClick={resetFilters}>
                  Reset filters
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default CaseManagement;
