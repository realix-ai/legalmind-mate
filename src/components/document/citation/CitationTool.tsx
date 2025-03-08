
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, FileText, BookOpen } from 'lucide-react';
import SearchTab from './tabs/SearchTab';
import FormatTab from './tabs/FormatTab';
import DetailsTab from './tabs/DetailsTab';

interface CitationToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsertCitation: (citation: string) => void;
  onInsertCaseText: (text: string) => void;
}

export function CitationTool({ open, onOpenChange, onInsertCitation, onInsertCaseText }: CitationToolProps) {
  const [citationTab, setCitationTab] = useState('search');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // View case details
  const viewCaseDetails = (id: string) => {
    setSelectedCaseId(id);
    setCitationTab('details');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md w-[90%]">
        <SheetHeader>
          <SheetTitle>Legal Citation Tool</SheetTitle>
          <SheetDescription>
            Search case law or format your legal citations
          </SheetDescription>
        </SheetHeader>
        
        <Tabs value={citationTab} onValueChange={setCitationTab} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="search" className="flex items-center gap-1">
              <Search className="h-3.5 w-3.5" />
              <span>Search</span>
            </TabsTrigger>
            <TabsTrigger value="format" className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              <span>Format</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-1" disabled={!selectedCaseId}>
              <BookOpen className="h-3.5 w-3.5" />
              <span>Details</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search">
            <SearchTab 
              onInsertCitation={(citation) => {
                onInsertCitation(citation);
                onOpenChange(false);
              }} 
              onViewCaseDetails={viewCaseDetails}
            />
          </TabsContent>
          
          <TabsContent value="format">
            <FormatTab 
              onInsertCitation={(citation) => {
                onInsertCitation(citation);
                onOpenChange(false);
              }}
            />
          </TabsContent>
          
          <TabsContent value="details">
            <DetailsTab 
              selectedCaseId={selectedCaseId}
              onInsertCitation={(citation) => {
                onInsertCitation(citation);
                onOpenChange(false);
              }}
              onInsertCaseText={(text) => {
                onInsertCaseText(text);
                onOpenChange(false);
              }}
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

export default CitationTool;
