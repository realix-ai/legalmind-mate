
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
      className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl hover:border-primary/30 group"
      variants={variants}
    >
      <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Button 
        variant="ghost" 
        className="group-hover:bg-primary/10 gap-2"
        onClick={() => navigate(path)}
      >
        Try it now
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
  );
};

export default FeatureCard;
