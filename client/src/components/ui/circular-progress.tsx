import React from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  thickness?: number;
  color?: 'primary' | 'secondary' | 'accent' | 'destructive';
  className?: string;
  label?: React.ReactNode;
}

export function CircularProgress({
  value,
  max,
  size = 80,
  thickness = 8,
  color = 'primary',
  className,
  label
}: CircularProgressProps) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const offset = circumference - (percent / 100) * circumference;

  const colorClass = {
    'primary': 'stroke-primary',
    'secondary': 'stroke-blue-500',
    'accent': 'stroke-orange-500',
    'destructive': 'stroke-red-500'
  }[color];

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="stroke-gray-200 fill-transparent"
          strokeWidth={thickness}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn('fill-transparent transition-all duration-300 ease-in-out', colorClass)}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {label !== undefined ? label : <span className="text-sm font-semibold">{Math.round(percent)}%</span>}
      </div>
    </div>
  );
}
