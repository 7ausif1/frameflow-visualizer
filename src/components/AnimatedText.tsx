
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

interface AnimatedTextProps {
  text: string;
  highlightedText?: string;
  element?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  className?: string;
  highlightClassName?: string;
  startOpacity?: number;
  endOpacity?: number;
  startTrigger?: string;
  endTrigger?: string;
  scrubAmount?: number;
  duration?: number;
  ease?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  highlightedText,
  element = 'h2',
  className = '',
  highlightClassName = 'relative inline-block',
  startOpacity = 0.7,
  endOpacity = 1,
  startTrigger = "top 80%",
  endTrigger = "top 50%",
  scrubAmount = 0.5,
  duration = 0.8,
  ease = "power2.out"
}) => {
  const textRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    // Set initial opacity
    if (textRef.current) {
      gsap.set(textRef.current, {
        opacity: startOpacity,
        y: 10 // Slight vertical offset for movement effect
      });
    }
    
    // Create animation
    const animation = gsap.to(textRef.current, {
      opacity: endOpacity,
      y: 0,
      duration: duration,
      ease: ease,
      scrollTrigger: {
        trigger: textRef.current,
        start: startTrigger,
        end: endTrigger,
        scrub: scrubAmount,
        toggleActions: "play reverse play reverse", // This makes the animation work both scrolling up and down
        // markers: true, // Uncomment for debugging
      }
    });
    
    return () => {
      // Clean up
      if (animation && animation.scrollTrigger) {
        animation.scrollTrigger.kill();
      }
      animation.kill();
    };
  }, [startOpacity, endOpacity, startTrigger, endTrigger, scrubAmount, duration, ease]);
  
  // If there's highlighted text, split the text into parts
  if (highlightedText && text.includes(highlightedText)) {
    const parts = text.split(highlightedText);
    const Element = element as keyof JSX.IntrinsicElements;
    
    return (
      <Element ref={textRef} className={cn(className, "text-reveal")}>
        {parts[0]}
        <span className={highlightClassName}>
          {highlightedText}
          <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
        </span>
        {parts[1]}
      </Element>
    );
  }
  
  // If no highlighted text, render as normal
  const Element = element as keyof JSX.IntrinsicElements;
  return <Element ref={textRef} className={cn(className, "text-reveal")}>{text}</Element>;
};

export default AnimatedText;
