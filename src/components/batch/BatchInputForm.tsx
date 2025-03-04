
import { useState } from 'react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { QueryType } from '@/services/legalQueryService';
import { BatchQuery } from './types';

interface BatchInputFormProps {
  onAddQuery: (query: BatchQuery) => void;
  isProcessing: boolean;
}

const BatchInputForm = ({ onAddQuery, isProcessing }: BatchInputFormProps) => {
  const [queryText, setQueryText] = useState('');
  const [queryType, setQueryType] = useState<QueryType>('legal-research');
  
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
    
    onAddQuery(newQuery);
    setQueryText('');
    toast.success('Query added to batch');
  };
  
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter your legal query here..."
        value={queryText}
        onChange={(e) => setQueryText(e.target.value)}
        className="min-h-32 resize-none focus:border-primary focus:ring-primary"
        disabled={isProcessing}
      />
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3">
          <Select
            value={queryType}
            onValueChange={(value) => setQueryType(value as QueryType)}
            disabled={isProcessing}
          >
            <SelectTrigger className="w-full">
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
          disabled={isProcessing || !queryText.trim()}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Batch
        </Button>
      </div>
    </div>
  );
};

export default BatchInputForm;
