
import { useState } from 'react';
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

interface Case {
  id: string;
  title: string;
  caseNumber: string;
  clientName: string;
  date: string;
  status: 'active' | 'closed' | 'pending';
  priority: 'high' | 'medium' | 'low';
  description?: string;
  nextHearing?: string;
  assignedTo?: string[];
  documents?: { id: string; name: string; type: string; date: string }[];
  notes?: { id: string; text: string; date: string }[];
}

const CaseManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  
  const cases: Case[] = [
    {
      id: 'case-001',
      title: 'Johnson v. BigCorp Industries',
      caseNumber: 'CV-2023-1234',
      clientName: 'Robert Johnson',
      date: 'Mar 15, 2023',
      status: 'active',
      priority: 'high',
      description: 'Wrongful termination lawsuit against BigCorp Industries. Client alleges discrimination based on age and retaliation for whistleblowing activities.',
      nextHearing: 'Jun 18, 2024',
      assignedTo: ['Jane Smith', 'Michael Wong'],
      documents: [
        { id: 'doc-001', name: 'Complaint', type: 'Legal Filing', date: 'Mar 15, 2023' },
        { id: 'doc-002', name: 'Response to Interrogatories', type: 'Discovery', date: 'May 22, 2023' },
        { id: 'doc-003', name: 'Deposition Transcript - R. Johnson', type: 'Deposition', date: 'Jul 10, 2023' }
      ],
      notes: [
        { id: 'note-001', text: 'Client meeting - discussed settlement parameters', date: 'Apr 5, 2023' },
        { id: 'note-002', text: 'Opposing counsel requested extension for discovery', date: 'Jun 12, 2023' }
      ]
    },
    {
      id: 'case-002',
      title: 'Estate of Williams',
      caseNumber: 'PR-2023-5678',
      clientName: 'Sarah Williams',
      date: 'Jan 10, 2023',
      status: 'active',
      priority: 'medium',
      description: 'Probate administration for the Estate of Thomas Williams. Complex estate with multiple properties and business interests.',
      nextHearing: 'Jul 22, 2024',
      assignedTo: ['Michael Wong'],
      documents: [
        { id: 'doc-004', name: 'Petition for Probate', type: 'Legal Filing', date: 'Jan 10, 2023' },
        { id: 'doc-005', name: 'Inventory and Appraisal', type: 'Document', date: 'Mar 15, 2023' }
      ],
      notes: [
        { id: 'note-003', text: 'Client meeting - discussed asset distribution', date: 'Feb 20, 2023' }
      ]
    },
    {
      id: 'case-003',
      title: 'TechStart LLC v. Innovate Systems',
      caseNumber: 'CV-2022-9876',
      clientName: 'TechStart LLC',
      date: 'Nov 05, 2022',
      status: 'closed',
      priority: 'high',
      description: 'Patent infringement case regarding proprietary algorithm. Settlement reached on May 15, 2023.',
      documents: [
        { id: 'doc-006', name: 'Settlement Agreement', type: 'Contract', date: 'May 15, 2023' }
      ]
    },
    {
      id: 'case-004',
      title: 'Garcia Property Acquisition',
      caseNumber: 'RE-2023-4321',
      clientName: 'Elena Garcia',
      date: 'Apr 22, 2023',
      status: 'pending',
      priority: 'low',
      description: 'Commercial property acquisition in downtown district. Due diligence phase.',
      assignedTo: ['Jane Smith'],
      documents: [
        { id: 'doc-007', name: 'Purchase Agreement (Draft)', type: 'Contract', date: 'Apr 25, 2023' }
      ]
    },
    {
      id: 'case-005',
      title: 'MediHealth Compliance Review',
      caseNumber: 'HC-2023-5555',
      clientName: 'MediHealth Inc.',
      date: 'Feb 12, 2023',
      status: 'active',
      priority: 'medium',
      description: 'Regulatory compliance review for healthcare provider. Focus on HIPAA and new state regulations.',
      assignedTo: ['Michael Wong', 'David Chen'],
      documents: [
        { id: 'doc-008', name: 'Compliance Report', type: 'Document', date: 'Apr 30, 2023' }
      ]
    }
  ];
  
  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseItem.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(caseItem.status);
    const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(caseItem.priority);
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  const selectedCaseData = cases.find((caseItem) => caseItem.id === selectedCase);
  
  const toggleStatusFilter = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter(s => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };
  
  const togglePriorityFilter = (priority: string) => {
    if (priorityFilter.includes(priority)) {
      setPriorityFilter(priorityFilter.filter(p => p !== priority));
    } else {
      setPriorityFilter([...priorityFilter, priority]);
    }
  };
  
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
        {!selectedCase ? (
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
              
              <Button className="gap-2 self-start">
                <Plus className="h-4 w-4" />
                New Case
              </Button>
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
                          onClick={() => toggleStatusFilter(status)}
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
                          onClick={() => togglePriorityFilter(priority)}
                        >
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {filteredCases.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredCases.map((caseItem) => (
                  <motion.div key={caseItem.id} variants={itemVariants}>
                    <CaseCard
                      title={caseItem.title}
                      caseNumber={caseItem.caseNumber}
                      clientName={caseItem.clientName}
                      date={caseItem.date}
                      status={caseItem.status}
                      priority={caseItem.priority}
                      onClick={() => setSelectedCase(caseItem.id)}
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
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button variant="outline" onClick={resetFilters}>
                  Reset filters
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {selectedCaseData && (
              <>
                <div className="mb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 mb-4"
                    onClick={() => setSelectedCase(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Cases
                  </Button>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-semibold">{selectedCaseData.title}</h1>
                      <p className="text-muted-foreground">Case #{selectedCaseData.caseNumber}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">Edit Case</Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="col-span-2 space-y-6">
                    {/* Case Details */}
                    <div className="border rounded-xl overflow-hidden">
                      <div className="bg-muted p-4">
                        <h3 className="font-medium">Case Details</h3>
                      </div>
                      
                      <div className="p-5">
                        <p className="mb-6">{selectedCaseData.description}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Client</span>
                            </div>
                            <p className="text-sm">{selectedCaseData.clientName}</p>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Date Opened</span>
                            </div>
                            <p className="text-sm">{selectedCaseData.date}</p>
                          </div>
                          
                          {selectedCaseData.nextHearing && (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Next Hearing</span>
                              </div>
                              <p className="text-sm">{selectedCaseData.nextHearing}</p>
                            </div>
                          )}
                          
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Priority</span>
                            </div>
                            <p className="text-sm capitalize">{selectedCaseData.priority}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Documents */}
                    <div className="border rounded-xl overflow-hidden">
                      <div className="bg-muted p-4 flex items-center justify-between">
                        <h3 className="font-medium">Documents</h3>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                      
                      {selectedCaseData.documents && selectedCaseData.documents.length > 0 ? (
                        <div className="divide-y">
                          {selectedCaseData.documents.map((doc) => (
                            <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                                  <FileText className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm">{doc.name}</h4>
                                  <p className="text-xs text-muted-foreground">{doc.type} • {doc.date}</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">View</Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-sm text-muted-foreground mb-4">No documents attached to this case yet.</p>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Plus className="h-4 w-4" />
                            Add Document
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Assigned To */}
                    {selectedCaseData.assignedTo && (
                      <div className="border rounded-xl overflow-hidden">
                        <div className="bg-muted p-4">
                          <h3 className="font-medium">Assigned To</h3>
                        </div>
                        
                        <div className="p-4">
                          {selectedCaseData.assignedTo.map((person, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 py-2"
                            >
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                {person.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span>{person}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Case Notes */}
                    <div className="border rounded-xl overflow-hidden">
                      <div className="bg-muted p-4 flex items-center justify-between">
                        <h3 className="font-medium">Case Notes</h3>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>
                      
                      {selectedCaseData.notes && selectedCaseData.notes.length > 0 ? (
                        <div className="divide-y">
                          {selectedCaseData.notes.map((note) => (
                            <div key={note.id} className="p-4">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                                  <MessageSquare className="h-4 w-4 text-primary" />
                                </div>
                                <p className="text-xs text-muted-foreground">{note.date}</p>
                              </div>
                              <p className="text-sm pl-11">{note.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-sm text-muted-foreground mb-4">No notes for this case yet.</p>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Plus className="h-4 w-4" />
                            Add Note
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default CaseManagement;
