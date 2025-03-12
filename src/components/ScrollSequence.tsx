
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
  speed?: number;
  className?: string;
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
  smoothness = 1,
  speed = 1,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(startFrame);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  
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
          drawImageProperly(context, firstImage, canvas.width, canvas.height);
        };
      }
    }
  }, [startFrame, baseUrl, framePrefix, frameExtension]);
  
  // Function to maintain aspect ratio
  const drawImageProperly = (
    ctx: CanvasRenderingContext2D, 
    img: HTMLImageElement, 
    canvasWidth: number, 
    canvasHeight: number
  ) => {
    // Get the image dimensions
    const imgWidth = img.width;
    const imgHeight = img.height;
    
    // Calculate the scale factor to fit the canvas while preserving aspect ratio
    const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    
    // Calculate new dimensions
    const newWidth = imgWidth * scale;
    const newHeight = imgHeight * scale;
    
    // Calculate positioning to center the image
    const x = (canvasWidth - newWidth) / 2;
    const y = (canvasHeight - newHeight) / 2;
    
    // Clear canvas and draw the image centered and scaled properly
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, x, y, newWidth, newHeight);
  };
  
  // Preload all frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;
    
    for (let i = startFrame; i <= totalFrames; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
        setImagesLoaded(Math.floor((loadedCount / (totalFrames - startFrame + 1)) * 100));
      };
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
        
        drawImageProperly(
          context,
          imagesRef.current[currentFrame - startFrame],
          canvas.width,
          canvas.height
        );
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentFrame, startFrame]);
  
  // Handle scroll animation with smoothness and speed
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollableHeight = rect.height - windowHeight;
        
        const scrollProgress = Math.max(0, Math.min(1, 
          (-rect.top) / scrollableHeight
        ));
        
        // Apply speed factor to scroll progress
        const adjustedProgress = Math.max(0, Math.min(1, scrollProgress * speed));
        
        const targetFrame = Math.min(
          Math.max(
            startFrame,
            Math.ceil(adjustedProgress * (totalFrames - startFrame) + startFrame)
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
            
            drawImageProperly(
              context,
              imagesRef.current[smoothedFrame - startFrame],
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
  }, [currentFrame, startFrame, totalFrames, smoothness, speed]);
  
  return (
    <div ref={containerRef} style={{ height: `${scrollHeight}vh` }} className={`w-full ${className}`}>
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {imagesLoaded < 100 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10 transition-opacity duration-300">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
            <div className="text-primary font-medium">Loading {imagesLoaded}%</div>
          </div>
        )}
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
