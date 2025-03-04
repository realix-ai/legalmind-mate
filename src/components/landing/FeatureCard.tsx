
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  variants: any;
}

const FeatureCard = ({ icon: Icon, title, description, path, variants }: FeatureCardProps) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-subtle border transition-all duration-300 hover:shadow-elevated hover:border-primary/30"
      variants={variants}
    >
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      <Button 
        variant="ghost" 
        className="mt-4 gap-2"
        onClick={() => navigate(path)}
      >
        Try it now
        <ArrowRight className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};

export default FeatureCard;
