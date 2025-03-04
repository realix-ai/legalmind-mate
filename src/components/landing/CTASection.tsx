
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 px-4">
      <div className="container max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 relative z-10">Ready to transform your legal practice?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 relative z-10">
            Join thousands of legal professionals who are saving time and improving outcomes with our AI assistant.
          </p>
          
          <Button 
            size="lg" 
            className="gap-2 relative z-10"
            onClick={() => navigate('/query-assistant')}
          >
            Get Started Now
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
