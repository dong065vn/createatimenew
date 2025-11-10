
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
    <Card className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">{t('imageView.title')}</h2>
      </div>
      <div ref={containerRef} className="flex-grow flex items-center justify-center p-2 overflow-hidden">
        <div className="relative" style={{ width: imageDimensions.width, height: imageDimensions.height }}>
          <img ref={imageRef} src={imageUrl} alt="Uploaded schedule" className="object-contain w-full h-full" />
          {events.map(event => {
            const { x, y, width, height } = event.boundingBox;
            const isHovered = event.id === hoveredEventId;
            return (
              <div
                key={event.id}
                className={`absolute border-2 transition-all duration-200 ${
                  isHovered 
                  ? 'border-pink-500 bg-pink-500/30' 
                  : 'border-primary-500 bg-primary-500/20'
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