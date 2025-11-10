
import React from 'react';
import { AlertCircle, CheckCircle, Info, XOctagon } from 'lucide-react';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  children: React.ReactNode;
}

const variants = {
  info: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'border-blue-400',
    iconColor: 'text-blue-500',
    Icon: Info,
  },
  success: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    border: 'border-green-400',
    iconColor: 'text-green-500',
    Icon: CheckCircle,
  },
  warning: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    border: 'border-yellow-400',
    iconColor: 'text-yellow-500',
    Icon: AlertCircle,
  },
  danger: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-400',
    iconColor: 'text-red-500',
    Icon: XOctagon,
  },
};

export const Alert: React.FC<AlertProps> = ({ variant = 'info', title, children }) => {
  const { bg, border, iconColor, Icon } = variants[variant];

  return (
    <div className={`border-l-4 p-4 rounded-md shadow-md ${bg} ${border}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-6 w-6 ${iconColor}`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</p>
          <div className="mt-2 text-md text-gray-700 dark:text-gray-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
