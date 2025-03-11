
import React, { useEffect, useRef, useState } from 'react';

interface ScrollSequenceProps {
  totalFrames?: number;
  startFrame?: number;
  scrollHeight?: number;
  children?: React.ReactNode;
  baseUrl?: string;
  framePrefix?: string;
  frameExtension?: string;
  frameNumberPadding?: number;
  smoothness?: number;
}

const ScrollSequence: React.FC<ScrollSequenceProps> = ({
  totalFrames = 99,
  startFrame = 1,
  scrollHeight = 500,
  children,
  baseUrl = '/sequence',
  framePrefix = 'frame-',
  frameExtension = '.jpg',
  frameNumberPadding = 1,
  smoothness = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(startFrame);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  const getFramePath = (frame: number) => {
    const paddedNumber = String(frame).padStart(frameNumberPadding, '0');
    return `${baseUrl}/${framePrefix}${paddedNumber}${frameExtension}`;
  };
  
  // Initialize canvas and load first frame
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { alpha: false });
      if (context) {
        contextRef.current = context;
        
        const firstImage = new Image();
        firstImage.src = getFramePath(startFrame);
        firstImage.onload = () => {
          const rect = canvas.getBoundingClientRect();
          canvas.width = rect.width;
          canvas.height = rect.height;
          context.drawImage(firstImage, 0, 0, canvas.width, canvas.height);
        };
      }
    }
  }, [startFrame, baseUrl, framePrefix, frameExtension]);
  
  // Preload all frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    
    for (let i = startFrame; i <= totalFrames; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      images.push(img);
    }
    
    imagesRef.current = images;
  }, [totalFrames, startFrame, baseUrl, framePrefix, frameExtension]);
  
  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && contextRef.current && imagesRef.current[currentFrame - startFrame]?.complete) {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        context.drawImage(
          imagesRef.current[currentFrame - startFrame],
          0, 0,
          canvas.width,
          canvas.height
        );
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentFrame, startFrame]);
  
  // Handle scroll animation with smoothness
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollableHeight = rect.height - windowHeight;
        
        const scrollProgress = Math.max(0, Math.min(1, 
          (-rect.top) / scrollableHeight
        ));
        
        const targetFrame = Math.min(
          Math.max(
            startFrame,
            Math.ceil(scrollProgress * (totalFrames - startFrame) + startFrame)
          ),
          totalFrames
        );
        
        // Apply smoothing based on the smoothness factor
        const smoothedFrame = Math.round(
          currentFrame + (targetFrame - currentFrame) / (smoothness * 2)
        );
        
        if (smoothedFrame !== currentFrame) {
          setCurrentFrame(smoothedFrame);
          
          if (canvasRef.current && contextRef.current && imagesRef.current[smoothedFrame - startFrame]?.complete) {
            const canvas = canvasRef.current;
            const context = contextRef.current;
            context.drawImage(
              imagesRef.current[smoothedFrame - startFrame],
              0, 0,
              canvas.width,
              canvas.height
            );
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentFrame, startFrame, totalFrames, smoothness]);
  
  return (
    <div ref={containerRef} style={{ height: `${scrollHeight}vh` }} className="w-full">
      <div className="sticky top-0 w-full h-screen">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover"
        />
        {children}
      </div>
    </div>
  );
};

export default ScrollSequence;
