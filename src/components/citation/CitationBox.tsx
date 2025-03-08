
import { useState, useMemo } from 'react';
import { 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  BookOpen,
  Check,
  Filter,
  Calendar,
  MapPin,
  X
} from 'lucide-react';
import { Citation } from '@/services/citationService';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CitationBoxProps {
  citations: Citation[];
  className?: string;
  maxInitialDisplay?: number;
}

const CitationBox = ({ 
  citations, 
  className,
  maxInitialDisplay = 2 
}: CitationBoxProps) => {
  const [expanded, setExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [courtFilter, setCourtFilter] = useState<string | null>(null);
  const [yearRange, setYearRange] = useState<[number, number]>([1950, new Date().getFullYear()]);
  
  // Citation display format
  const [citationFormat, setCitationFormat] = useState<'standard' | 'bluebook' | 'apa' | 'chicago'>('standard');
  
  if (citations.length === 0) {
    return null;
  }
  
  // Get unique courts for filter dropdown
  const availableCourts = useMemo(() => {
    const courts = new Set<string>();
    citations.forEach(citation => courts.add(citation.court));
    return Array.from(courts);
  }, [citations]);
  
  // Get year range for slider
  const yearBounds = useMemo(() => {
    if (citations.length === 0) return [1950, new Date().getFullYear()];
    
    let minYear = citations[0].year;
    let maxYear = citations[0].year;
    
    citations.forEach(citation => {
      if (citation.year < minYear) minYear = citation.year;
      if (citation.year > maxYear) maxYear = citation.year;
    });
    
    return [minYear, maxYear] as [number, number];
  }, [citations]);
  
  // Apply filters
  const filteredCitations = useMemo(() => {
    return citations.filter(citation => {
      // Apply court filter
      if (courtFilter && citation.court !== courtFilter) {
        return false;
      }
      
      // Apply year range filter
      if (citation.year < yearRange[0] || citation.year > yearRange[1]) {
        return false;
      }
      
      return true;
    });
  }, [citations, courtFilter, yearRange]);
  
  const displayCitations = expanded ? filteredCitations : filteredCitations.slice(0, maxInitialDisplay);
  
  const handleCopyCitation = (citation: Citation) => {
    // Format the citation based on the selected format
    let citationText = "";
    
    switch (citationFormat) {
      case 'bluebook':
        citationText = `${citation.title}, ${citation.citation} (${citation.court}, ${citation.year})`;
        break;
      case 'apa':
        citationText = `${citation.title}. (${citation.year}). ${citation.citation}. ${citation.court}.`;
        break;
      case 'chicago':
        citationText = `${citation.title}, ${citation.citation}, ${citation.court} ${citation.year}.`;
        break;
      default:
        citationText = `${citation.title}, ${citation.citation} (${citation.court}, ${citation.year})`;
    }
    
    navigator.clipboard.writeText(citationText);
    setCopiedId(citation.id);
    toast.success("Citation copied to clipboard");
    
    // Reset copied state after a short delay
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };
  
  const resetFilters = () => {
    setCourtFilter(null);
    // Fix: Cast yearBounds to the explicit tuple type
    setYearRange(yearBounds as [number, number]);
  };
  
  return (
    <div className={cn(
      "mt-6 border rounded-lg p-4 bg-muted/30 shadow-sm",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Related Legal Citations</h3>
        </div>
        <div className="flex items-center gap-2">
          <Select value={citationFormat} onValueChange={(value) => setCitationFormat(value as any)}>
            <SelectTrigger className="h-7 text-xs w-[130px]">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="bluebook">Bluebook</SelectItem>
              <SelectItem value="apa">APA</SelectItem>
              <SelectItem value="chicago">Chicago</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-3 w-3 mr-1" />
            Filter
          </Button>
        </div>
      </div>
      
      <Collapsible open={showFilters} onOpenChange={setShowFilters}>
        <CollapsibleContent>
          <div className="p-2 mb-3 bg-background rounded-md border space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium">Filter Citations</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs"
                onClick={resetFilters}
              >
                <X className="h-3 w-3 mr-1" />
                Reset
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium">Court</span>
                </div>
                <Select 
                  value={courtFilter || ""}
                  onValueChange={(value) => setCourtFilter(value || null)}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="All Courts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Courts</SelectItem>
                    {availableCourts.map(court => (
                      <SelectItem key={court} value={court}>{court}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium">Year Range: {yearRange[0]} - {yearRange[1]}</span>
                </div>
                <Slider
                  min={yearBounds[0]}
                  max={yearBounds[1]}
                  step={1}
                  value={yearRange}
                  onValueChange={(value) => setYearRange(value as [number, number])}
                  className="my-2"
                />
              </div>
            </div>
            
            {/* Display active filters */}
            <div className="flex flex-wrap gap-1">
              {courtFilter && (
                <Badge variant="outline" className="text-xs py-0 h-5">
                  {courtFilter}
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setCourtFilter(null)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
              
              {(yearRange[0] !== yearBounds[0] || yearRange[1] !== yearBounds[1]) && (
                <Badge variant="outline" className="text-xs py-0 h-5">
                  {yearRange[0]} - {yearRange[1]}
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => setYearRange(yearBounds as [number, number])}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {filteredCitations.length === 0 ? (
        <div className="bg-background rounded-md p-4 text-sm border">
          <p className="text-muted-foreground text-center">No citations match the current filters.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayCitations.map(citation => (
              <div 
                key={citation.id} 
                className="bg-background rounded-md p-4 text-sm border transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-primary/90">{citation.title}</h4>
                    <p className="text-muted-foreground text-xs mt-1">{citation.citation} ({citation.court}, {citation.year})</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 relative"
                      onClick={() => handleCopyCitation(citation)}
                      title="Copy citation"
                    >
                      {copiedId === citation.id ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                    {citation.url && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => window.open(citation.url, '_blank')}
                        title="Open source"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {citation.summary && (
                  <p className="mt-3 text-xs text-muted-foreground border-t pt-2 line-clamp-3">
                    {citation.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
          
          {filteredCitations.length > maxInitialDisplay && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs mt-3 w-full flex items-center justify-center text-muted-foreground hover:text-foreground"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Show {filteredCitations.length - maxInitialDisplay} More {filteredCitations.length - maxInitialDisplay === 1 ? 'Citation' : 'Citations'}
                </>
              )}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default CitationBox;
