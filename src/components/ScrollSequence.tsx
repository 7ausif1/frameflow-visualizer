
import React, { useEffect, useRef, useState } from 'react';

interface ScrollSequenceProps {
  totalFrames?: number;
  startFrame?: number;
  scrollHeight?: number;
  children?: React.ReactNode;
}

const ScrollSequence: React.FC<ScrollSequenceProps> = ({
  totalFrames = 99, // Updated to match your total frames
  startFrame = 1,
  scrollHeight = 500,
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(startFrame);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // Preload images and setup canvas
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;
    
    const preloadImages = () => {
      for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        img.src = `/sequence/frame-${i}.jpg`;
        img.onload = () => {
          loadedCount++;
          
          if (loadedCount === 1) {
            // Draw the first frame as soon as it's loaded
            if (canvasRef.current && contextRef.current) {
              const canvas = canvasRef.current;
              const context = contextRef.current;
              context.clearRect(0, 0, canvas.width, canvas.height);
              context.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
          }
        };
        img.onerror = (e) => {
          console.error(`Failed to load image: /sequence/frame-${i}.jpg`, e);
          loadedCount++;
        };
        images.push(img);
      }
    };
    
    // Setup canvas with proper dimensions
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      
      // Set actual canvas dimensions
      const updateCanvasSize = () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Maintain aspect ratio
        if (images[currentFrame - 1]?.complete) {
          const context = canvas.getContext('2d');
          if (context) {
            context.drawImage(images[currentFrame - 1], 0, 0, canvas.width, canvas.height);
          }
        }
      };
      
      const context = canvas.getContext('2d', { alpha: false });
      if (context) {
        contextRef.current = context;
        context.imageSmoothingEnabled = true;
        updateCanvasSize();
        
        window.addEventListener('resize', updateCanvasSize);
        return () => {
          window.removeEventListener('resize', updateCanvasSize);
        };
      }
    }
    
    imagesRef.current = images;
    preloadImages();
  }, [totalFrames, startFrame, currentFrame]);
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollProgress = -rect.top / (rect.height - window.innerHeight);
        const frameIndex = Math.min(
          Math.max(
            1,
            Math.ceil(scrollProgress * (totalFrames - 1) + startFrame)
          ),
          totalFrames
        );
        
        if (frameIndex !== currentFrame) {
          setCurrentFrame(frameIndex);
          
          if (canvasRef.current && contextRef.current && imagesRef.current[frameIndex - 1]?.complete) {
            const canvas = canvasRef.current;
            const context = contextRef.current;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(imagesRef.current[frameIndex - 1], 0, 0, canvas.width, canvas.height);
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentFrame, startFrame, totalFrames]);

  return (
    <div ref={containerRef} className="scroll-container" style={{ height: `${scrollHeight}vh` }}>
      <div className="sequence-container">
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
