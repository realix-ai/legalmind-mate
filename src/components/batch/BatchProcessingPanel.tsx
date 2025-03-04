
import { useState } from 'react';
import { toast } from "sonner";
import { BatchQuery } from './types';
import BatchHeader from './BatchHeader';
import BatchQueue from './BatchQueue';
import BatchResults from './BatchResults';

const BatchProcessingPanel = () => {
  const [batchQueries, setBatchQueries] = useState<BatchQuery[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const addQueryToBatch = (newQuery: BatchQuery) => {
    setBatchQueries(prev => [...prev, newQuery]);
  };
  
  const removeQueryFromBatch = (id: string) => {
    setBatchQueries(prev => prev.filter(query => query.id !== id));
    toast.info('Query removed from batch');
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
    toast.info('Batch queue cleared');
  };
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <BatchHeader 
        onAddQuery={addQueryToBatch} 
        isProcessing={isProcessing} 
      />
      
      <BatchQueue 
        queries={batchQueries}
        isProcessing={isProcessing}
        progress={progress}
        onRemoveQuery={removeQueryFromBatch}
        onProcess={processBatch}
        onReset={resetBatch}
      />
      
      <BatchResults queries={batchQueries} />
    </div>
  );
};

export default BatchProcessingPanel;
