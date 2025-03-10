
import React, { useEffect, useRef, useState } from 'react';

interface ScrollSequenceProps {
  totalFrames?: number;
  startFrame?: number;
  scrollHeight?: number;
  children?: React.ReactNode;
}

const ScrollSequence: React.FC<ScrollSequenceProps> = ({
  totalFrames = 99,
  startFrame = 1,
  scrollHeight = 500,
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(startFrame);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // Initialize canvas and load first frame
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { alpha: false });
      if (context) {
        contextRef.current = context;
        
        // Load and display first frame
        const firstImage = new Image();
        firstImage.src = `/sequence/frame-${startFrame}.jpg`;
        firstImage.onload = () => {
          const rect = canvas.getBoundingClientRect();
          canvas.width = rect.width;
          canvas.height = rect.height;
          context.drawImage(firstImage, 0, 0, canvas.width, canvas.height);
        };
      }
    }
  }, [startFrame]);
  
  // Preload all frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/sequence/frame-${i}.jpg`;
      images.push(img);
    }
    
    imagesRef.current = images;
  }, [totalFrames]);
  
  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && contextRef.current && imagesRef.current[currentFrame - 1]?.complete) {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        context.drawImage(
          imagesRef.current[currentFrame - 1],
          0, 0,
          canvas.width,
          canvas.height
        );
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentFrame]);
  
  // Handle scroll animation
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollableHeight = rect.height - windowHeight;
        
        // Calculate progress (0 to 1) based on how far we've scrolled through the container
        const scrollProgress = Math.max(0, Math.min(1, 
          (-rect.top) / scrollableHeight
        ));
        
        // Calculate the frame to show based on scroll progress
        const frame = Math.min(
          Math.max(
            startFrame,
            Math.ceil(scrollProgress * (totalFrames - startFrame) + startFrame)
          ),
          totalFrames
        );
        
        if (frame !== currentFrame) {
          setCurrentFrame(frame);
          
          // Update canvas with new frame
          if (canvasRef.current && contextRef.current && imagesRef.current[frame - 1]?.complete) {
            const canvas = canvasRef.current;
            const context = contextRef.current;
            context.drawImage(imagesRef.current[frame - 1], 0, 0, canvas.width, canvas.height);
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentFrame, startFrame, totalFrames]);
  
  return (
    <div ref={containerRef} style={{ height: `${scrollHeight}vh` }}>
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
