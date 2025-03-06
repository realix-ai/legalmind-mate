
import { motion } from 'framer-motion';
import { useUserProfile } from '@/hooks/use-user-profile';
import AiAssistantButton from '@/components/ai/AiAssistantButton';
import { toast } from 'sonner';

const QueryHeader = () => {
  const { userName } = useUserProfile();
  
  const handleAssistantResponse = (response: string) => {
    toast.info('AI Tip', {
      description: response,
      duration: 8000,
    });
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Legal Query Assistant</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Ask legal questions and get AI-powered answers to assist with your cases
          </p>
        </div>
        <AiAssistantButton 
          context="Query Assistant page. The user can ask legal research questions."
          onAssistantResponse={handleAssistantResponse}
          buttonText="Query Tips"
        />
      </div>
    </motion.div>
  );
};

export default QueryHeader;
