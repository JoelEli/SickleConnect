import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Heart, Stethoscope } from 'lucide-react';

interface UserBadgeProps {
  role: 'patient' | 'doctor';
  genotype?: string;
  size?: 'sm' | 'default';
}

const UserBadge = ({ role, genotype, size = 'default' }: UserBadgeProps) => {
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  
  if (role === 'doctor') {
    return (
      <Badge variant="secondary" className="gap-1">
        <Stethoscope className={iconSize} />
        Doctor
      </Badge>
    );
  }

  return (
    <div className="flex gap-1">
      <Badge variant="default" className="gap-1">
        <Heart className={iconSize} />
        Patient
      </Badge>
      {genotype && (
        <Badge variant="outline" className="text-xs">
          {genotype}
        </Badge>
      )}
    </div>
  );
};

export default UserBadge;