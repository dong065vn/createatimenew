
import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div
      className="animate-spin inline-block w-12 h-12 border-4 rounded-full border-primary-500 border-t-transparent"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
