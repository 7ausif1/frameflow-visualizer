
import React, { useEffect, useRef, useState } from 'react';

interface ScrollSequenceProps {
  totalFrames?: number;
  startFrame?: number;
  scrollHeight?: number;
  children?: React.ReactNode;
}

const ScrollSequence: React.FC<ScrollSequenceProps> = ({
  totalFrames = 50,
  startFrame = 1,
  scrollHeight = 500,
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(startFrame);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const loadingTextRef = useRef<HTMLDivElement>(null);
  
  // Preload images and setup canvas
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;
    setTotalImages(totalFrames);
    
    const preloadImages = () => {
      for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        img.src = `/sequence/frame-${i}.jpg`;
        img.onload = () => {
          loadedCount++;
          setImagesLoaded(loadedCount);
          
          if (loadedCount === totalFrames && canvasRef.current && contextRef.current) {
            // Initial render of the first frame
            contextRef.current.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        };
        img.onerror = () => {
          console.error(`Failed to load image: /sequence/frame-${i}.jpg`);
          loadedCount++;
          setImagesLoaded(loadedCount);
        };
        images.push(img);
      }
    };
    
    // Setup canvas
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        contextRef.current = context;
        
        // Set canvas dimensions
        const updateCanvasSize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          
          // Redraw current frame if images are loaded
          if (imagesRef.current.length > 0 && currentFrame > 0) {
            const frameIndex = currentFrame - 1;
            if (imagesRef.current[frameIndex]?.complete) {
              context.drawImage(
                imagesRef.current[frameIndex],
                0, 0,
                canvas.width, canvas.height
              );
            }
          }
        };
        
        // Initialize canvas size
        updateCanvasSize();
        
        // Handle resize
        window.addEventListener('resize', updateCanvasSize);
        
        // Clean up
        return () => {
          window.removeEventListener('resize', updateCanvasSize);
        };
      }
    }
    
    imagesRef.current = images;
    preloadImages();
  }, [totalFrames, startFrame]);
  
  // Handle scroll events to update the current frame
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = window.pageYOffset;
        const containerTop = containerRef.current.offsetTop;
        const containerHeight = containerRef.current.offsetHeight;
        
        // Calculate scroll progress (0 to 1)
        const scrollPosition = Math.min(
          Math.max(0, (scrollTop - containerTop) / (containerHeight - window.innerHeight)),
          1
        );
        
        // Calculate frame based on scroll position
        const frameIndex = Math.min(
          Math.floor(scrollPosition * (totalFrames - 1)) + startFrame,
          totalFrames
        );
        
        if (frameIndex !== currentFrame) {
          setCurrentFrame(frameIndex);
          
          // Draw the new frame
          if (canvasRef.current && contextRef.current && imagesRef.current[frameIndex - 1]) {
            const context = contextRef.current;
            const canvas = canvasRef.current;
            
            if (imagesRef.current[frameIndex - 1].complete) {
              context.drawImage(
                imagesRef.current[frameIndex - 1],
                0, 0,
                canvas.width, canvas.height
              );
            }
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial call to set the correct frame
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentFrame, startFrame, totalFrames]);
  
  // Handle loading text animation
  useEffect(() => {
    if (loadingTextRef.current) {
      const loadingPercentage = Math.floor((imagesLoaded / totalImages) * 100);
      loadingTextRef.current.textContent = `Loading ${loadingPercentage}%`;
      
      if (loadingPercentage === 100) {
        loadingTextRef.current.classList.add('animate-fade-out');
        setTimeout(() => {
          if (loadingTextRef.current) {
            loadingTextRef.current.style.display = 'none';
          }
        }, 1000);
      }
    }
  }, [imagesLoaded, totalImages]);
  
  return (
    <div className="scroll-container" style={{ height: `${scrollHeight}vh` }} ref={containerRef}>
      <div className="sequence-container">
        <canvas ref={canvasRef} />
        {imagesLoaded < totalImages && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-50">
            <div ref={loadingTextRef} className="text-3xl font-display font-light">
              Loading 0%
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default ScrollSequence;
