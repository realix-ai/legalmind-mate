
import { useState } from 'react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  PlayCircle,
  PlusCircle,
  X,
  RefreshCw
} from 'lucide-react';
import { QueryType } from '@/services/legalQueryService';

interface BatchQuery {
  id: string;
  text: string;
  type: QueryType;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: string;
}

const BatchProcessingPanel = () => {
  const [queryText, setQueryText] = useState('');
  const [queryType, setQueryType] = useState<QueryType>('legal-research');
  const [batchQueries, setBatchQueries] = useState<BatchQuery[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const addQueryToBatch = () => {
    if (!queryText.trim()) {
      toast.error('Please enter a query');
      return;
    }
    
    const newQuery: BatchQuery = {
      id: `query-${Date.now()}`,
      text: queryText.trim(),
      type: queryType,
      status: 'pending'
    };
    
    setBatchQueries(prev => [...prev, newQuery]);
    setQueryText('');
    toast.success('Query added to batch');
  };
  
  const removeQueryFromBatch = (id: string) => {
    setBatchQueries(prev => prev.filter(query => query.id !== id));
  };
  
  const processBatch = async () => {
    if (batchQueries.length === 0) {
      toast.error('No queries to process');
      return;
    }
    
    setIsProcessing(true);
    setProgress(0);
    
    const totalQueries = batchQueries.length;
    let completedQueries = 0;
    
    // Update all queries to pending
    setBatchQueries(prev => 
      prev.map(query => ({ ...query, status: 'pending', result: undefined }))
    );
    
    // Process each query sequentially
    for (const query of batchQueries) {
      try {
        // Update current query to processing
        setBatchQueries(prev => 
          prev.map(q => q.id === query.id ? { ...q, status: 'processing' } : q)
        );
        
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate a mock result based on query type
        let result = '';
        switch (query.type) {
          case 'legal-research':
            result = `Research findings for "${query.text}": Several precedents were identified including Smith v. Johnson (2018) and Wilson Corp v. Davidson (2020).`;
            break;
          case 'risk-analysis':
            result = `Risk analysis for "${query.text}": Medium risk level identified with potential issues in jurisdictional considerations.`;
            break;
          case 'summarize':
            result = `Summary of "${query.text}": This query relates to contractual obligations and potential breach scenarios.`;
            break;
          case 'data-analysis':
            result = `Data analysis for "${query.text}": Statistical findings indicate 73% of similar cases settled before trial.`;
            break;
        }
        
        // Update query to completed with result
        setBatchQueries(prev => 
          prev.map(q => q.id === query.id ? { ...q, status: 'completed', result } : q)
        );
        
        completedQueries++;
        setProgress(Math.round((completedQueries / totalQueries) * 100));
        
      } catch (error) {
        console.error('Error processing query:', error);
        
        // Update query to failed
        setBatchQueries(prev => 
          prev.map(q => q.id === query.id ? { ...q, status: 'failed' } : q)
        );
        
        completedQueries++;
        setProgress(Math.round((completedQueries / totalQueries) * 100));
      }
    }
    
    setIsProcessing(false);
    toast.success('Batch processing completed');
  };
  
  const resetBatch = () => {
    setBatchQueries([]);
    setProgress(0);
    setIsProcessing(false);
  };
  
  // Get status icon based on query status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="text-green-500 h-5 w-5" />;
      case 'failed':
        return <AlertCircle className="text-red-500 h-5 w-5" />;
      case 'processing':
        return <RefreshCw className="text-blue-500 h-5 w-5 animate-spin" />;
      default:
        return <Clock className="text-gray-500 h-5 w-5" />;
    }
  };
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add Queries to Batch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your legal query here..."
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              className="min-h-32"
              disabled={isProcessing}
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/3">
                <Select
                  value={queryType}
                  onValueChange={(value) => setQueryType(value as QueryType)}
                  disabled={isProcessing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select query type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="legal-research">Legal Research</SelectItem>
                    <SelectItem value="risk-analysis">Risk Analysis</SelectItem>
                    <SelectItem value="summarize">Summarize</SelectItem>
                    <SelectItem value="data-analysis">Data Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={addQueryToBatch} 
                className="w-full sm:w-auto"
                disabled={isProcessing}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add to Batch
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Batch Queue ({batchQueries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {batchQueries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No queries in the batch. Add some queries above.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="max-h-[300px] overflow-y-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Status</TableHead>
                      <TableHead>Query</TableHead>
                      <TableHead className="w-32">Type</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batchQueries.map((query) => (
                      <TableRow key={query.id}>
                        <TableCell>{getStatusIcon(query.status)}</TableCell>
                        <TableCell className="font-medium">
                          <div className="truncate max-w-[400px]">{query.text}</div>
                        </TableCell>
                        <TableCell>{query.type.replace('-', ' ')}</TableCell>
                        <TableCell>
                          {query.status === 'pending' && !isProcessing && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeQueryFromBatch(query.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing batch...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={resetBatch}
                  disabled={isProcessing || batchQueries.length === 0}
                >
                  Clear All
                </Button>
                
                <Button
                  onClick={processBatch}
                  disabled={isProcessing || batchQueries.length === 0}
                >
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Process Batch
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {batchQueries.some(q => q.status === 'completed') && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {batchQueries
                .filter(q => q.status === 'completed')
                .map((query) => (
                  <div key={`result-${query.id}`} className="border rounded-md p-4">
                    <h3 className="font-medium text-sm mb-2">{query.text}</h3>
                    <Separator className="my-2" />
                    <p className="text-sm">{query.result}</p>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BatchProcessingPanel;
