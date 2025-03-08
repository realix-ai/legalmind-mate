
import React from 'react';
import { Zap, Clock, ShieldCheck, Search, CheckCircle2, BookOpen } from 'lucide-react';
import FeatureButton from './FeatureButton';

const FeaturesGrid = () => {
  const features = [
    { icon: <Zap className="h-4 w-4" />, text: "Fast Research" },
    { icon: <Clock className="h-4 w-4" />, text: "Time Saving" },
    { icon: <ShieldCheck className="h-4 w-4" />, text: "Secure & Compliant" },
    { icon: <BookOpen className="h-4 w-4" />, text: "Comprehensive Database" },
    { icon: <CheckCircle2 className="h-4 w-4" />, text: "High Accuracy" },
    { icon: <Search className="h-4 w-4" />, text: "Advanced Search" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {features.map((feature, index) => (
        <FeatureButton 
          key={index}
          icon={feature.icon}
          text={feature.text}
          index={index}
        />
      ))}
    </div>
  );
};

export default FeaturesGrid;
