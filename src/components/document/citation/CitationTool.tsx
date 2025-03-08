
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { QuoteIcon, Search, BookText, FileText, BookOpen } from 'lucide-react';
import { formatCitation, citationTypes, citationStyles } from '@/utils/documents/citationFormatter';
import { useCaseLawSearch, useCaseDetails } from '@/services/caseLawService';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface CitationToolProps {
  onInsertCitation: (citation: string) => void;
  onInsertCaseText: (text: string) => void;
}

export function CitationTool({ onInsertCitation, onInsertCaseText }: CitationToolProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [citationTab, setCitationTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [customCitation, setCustomCitation] = useState({
    type: 'case',
    title: '',
    year: new Date().getFullYear(),
    volume: '',
    reporter: '',
    court: '',
    pageNumber: '',
    pinpoint: '',
  });
  const [citationStyle, setCitationStyle] = useState('bluebook');

  // Use the case law search hook
  const { data: searchResults, isLoading: isSearching } = useCaseLawSearch(searchQuery);
  const { data: caseDetails, isLoading: isLoadingDetails } = useCaseDetails(selectedCaseId);

  // Format the custom citation based on current values
  const formattedCitation = formatCitation(
    customCitation,
    citationStyle as any
  );

  // Handle the insertion of a citation
  const handleInsertCitation = () => {
    onInsertCitation(formattedCitation);
    toast.success('Citation inserted');
    setIsOpen(false);
  };

  // Handle inserting case text
  const handleInsertCaseText = () => {
    if (caseDetails?.fullText) {
      onInsertCaseText(caseDetails.fullText);
      toast.success('Case text inserted');
      setIsOpen(false);
    } else {
      toast.error('No case text available');
    }
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search will be automatically triggered by the useCaseLawSearch hook
    console.log("Searching for:", searchQuery);
  };

  // Update custom citation field
  const updateCitation = (field: string, value: any) => {
    setCustomCitation({
      ...customCitation,
      [field]: value
    });
  };

  // Insert search result as citation
  const insertSearchResult = (id: string, name: string, citation: string, year: number, court: string) => {
    onInsertCitation(`${name}, ${citation} (${court} ${year})`);
    toast.success('Citation inserted');
    setIsOpen(false);
  };

  // View case details
  const viewCaseDetails = (id: string) => {
    setSelectedCaseId(id);
    setCitationTab('details');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <QuoteIcon className="h-4 w-4" />
          Legal Citations
        </Button>
      </SheetTrigger>
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
          
          <TabsContent value="search" className="space-y-4">
            <form onSubmit={handleSearch} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search case law..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
            
            <ScrollArea className="h-[400px] rounded-md border p-2">
              {isSearching ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((result) => (
                    <div key={result.id} className="p-2 border rounded hover:bg-accent">
                      <h4 className="font-semibold text-sm">{result.name}</h4>
                      <p className="text-xs text-muted-foreground">{result.citation} ({result.court} {result.year})</p>
                      <div className="flex gap-2 mt-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-6 text-xs"
                          onClick={() => insertSearchResult(
                            result.id, 
                            result.name, 
                            result.citation, 
                            result.year, 
                            result.court
                          )}
                        >
                          Insert Citation
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-6 text-xs"
                          onClick={() => viewCaseDetails(result.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="py-8 text-center text-muted-foreground">
                  No results found for "{searchQuery}"
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Enter a search term to find relevant case law
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="format" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="citation-style">Citation Style</Label>
                <Select 
                  value={citationStyle} 
                  onValueChange={setCitationStyle}
                >
                  <SelectTrigger id="citation-style">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {citationStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="citation-type">Citation Type</Label>
                <Select 
                  value={customCitation.type} 
                  onValueChange={(value) => updateCitation('type', value)}
                >
                  <SelectTrigger id="citation-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {citationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="citation-title">Case Name/Title</Label>
                <Input
                  id="citation-title"
                  value={customCitation.title}
                  onChange={(e) => updateCitation('title', e.target.value)}
                  placeholder="e.g., Roe v. Wade"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="citation-year">Year</Label>
                  <Input
                    id="citation-year"
                    type="number"
                    value={customCitation.year}
                    onChange={(e) => updateCitation('year', e.target.value)}
                    placeholder="e.g., 2023"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="citation-volume">Volume</Label>
                  <Input
                    id="citation-volume"
                    value={customCitation.volume}
                    onChange={(e) => updateCitation('volume', e.target.value)}
                    placeholder="e.g., 410"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="citation-reporter">Reporter</Label>
                  <Input
                    id="citation-reporter"
                    value={customCitation.reporter}
                    onChange={(e) => updateCitation('reporter', e.target.value)}
                    placeholder="e.g., U.S."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="citation-page">Page Number</Label>
                  <Input
                    id="citation-page"
                    value={customCitation.pageNumber}
                    onChange={(e) => updateCitation('pageNumber', e.target.value)}
                    placeholder="e.g., 113"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="citation-court">Court</Label>
                <Input
                  id="citation-court"
                  value={customCitation.court}
                  onChange={(e) => updateCitation('court', e.target.value)}
                  placeholder="e.g., Supreme Court"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="citation-pinpoint">Pinpoint Citation</Label>
                <Input
                  id="citation-pinpoint"
                  value={customCitation.pinpoint}
                  onChange={(e) => updateCitation('pinpoint', e.target.value)}
                  placeholder="e.g., 115-116"
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Formatted Citation:</Label>
              <div className="p-3 border rounded-md bg-muted">
                <p className="break-all text-sm">{formattedCitation}</p>
              </div>
              <Button onClick={handleInsertCitation} className="w-full">
                Insert Citation
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            {isLoadingDetails ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : caseDetails ? (
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">{caseDetails.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {caseDetails.citation} ({caseDetails.court}, {caseDetails.year})
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Summary</h4>
                  <p className="text-sm">{caseDetails.summary}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Full Text</h4>
                  <ScrollArea className="h-[200px] rounded-md border p-2">
                    <pre className="text-xs whitespace-pre-wrap font-mono">
                      {caseDetails.fullText}
                    </pre>
                  </ScrollArea>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => insertSearchResult(
                      caseDetails.id, 
                      caseDetails.name, 
                      caseDetails.citation, 
                      caseDetails.year, 
                      caseDetails.court
                    )}
                    variant="outline"
                    className="flex-1"
                  >
                    Insert Citation
                  </Button>
                  <Button 
                    onClick={handleInsertCaseText}
                    className="flex-1"
                  >
                    Insert Full Text
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No case selected. Search for a case first.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

export default CitationTool;
