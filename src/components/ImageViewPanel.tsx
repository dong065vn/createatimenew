
import React, { useRef, useEffect, useState } from 'react';
import { useScheduleStore } from '../store/scheduleStore';
import { Card } from './ui/Card';
import { useLanguageStore } from '../store/languageStore';

interface ImageViewPanelProps {
  imageUrl: string;
}

export const ImageViewPanel: React.FC<ImageViewPanelProps> = ({ imageUrl }) => {
  const { t } = useLanguageStore();
  const events = useScheduleStore((state) => state.events);
  const hoveredEventId = useScheduleStore((state) => state.hoveredEventId);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      if (imageRef.current && containerRef.current) {
        const { naturalWidth, naturalHeight } = imageRef.current;
        const { width, height } = containerRef.current.getBoundingClientRect();
        
        const scaleX = width / naturalWidth;
        const scaleY = height / naturalHeight;
        
        setScale(Math.min(scaleX, scaleY));
      }
    };

    const image = imageRef.current;
    if (image) {
      image.onload = calculateScale;
    }
    window.addEventListener('resize', calculateScale);
    calculateScale(); 

    return () => {
      if (image) {
        image.onload = null;
      }
      window.removeEventListener('resize', calculateScale);
    };
  }, [imageUrl]);

  const imageDimensions = {
    width: (imageRef.current?.naturalWidth || 0) * scale,
    height: (imageRef.current?.naturalHeight || 0) * scale,
  };

  return (
    <Card className="h-full flex flex-col shadow-xl rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-750">
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary-700 to-blue-600 dark:from-primary-400 dark:to-blue-400 bg-clip-text text-transparent">
          {t('imageView.title')}
        </h2>
      </div>
      <div ref={containerRef} className="flex-grow flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="relative shadow-2xl rounded-lg overflow-hidden" style={{ width: imageDimensions.width, height: imageDimensions.height }}>
          <img ref={imageRef} src={imageUrl} alt="Uploaded schedule" className="object-contain w-full h-full" />
          {events.map(event => {
            const { x, y, width, height } = event.boundingBox;
            const isHovered = event.id === hoveredEventId;
            return (
              <div
                key={event.id}
                className={`absolute border-2 transition-all duration-300 rounded-md ${
                  isHovered
                  ? 'border-pink-500 bg-pink-500/40 shadow-lg shadow-pink-500/50 scale-105 z-10'
                  : 'border-primary-500 bg-primary-500/25 hover:bg-primary-500/35'
                }`}
                style={{
                  left: `${(x / (imageRef.current?.naturalWidth || 1)) * 100}%`,
                  top: `${(y / (imageRef.current?.naturalHeight || 1)) * 100}%`,
                  width: `${(width / (imageRef.current?.naturalWidth || 1)) * 100}%`,
                  height: `${(height / (imageRef.current?.naturalHeight || 1)) * 100}%`,
                }}
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
};