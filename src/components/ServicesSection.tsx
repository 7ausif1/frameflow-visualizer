
import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedText from './AnimatedText';

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

export interface Service {
  title: string;
  description: string;
  link: string;
}

interface ServiceCardProps {
  title: string;
  description: string;
  index: number;
  link: string;
  animationConfig?: {
    startRotation?: number;
    endRotation?: number;
    startOpacity?: number;
    endOpacity?: number;
    scrubAmount?: number;
    duration?: number;
    ease?: string;
    startTrigger?: string;
    endTrigger?: string;
  };
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  description, 
  index, 
  link,
  animationConfig = {}
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const {
    startRotation = 5,
    endRotation = 0,
    startOpacity = 0.7,
    endOpacity = 1,
    scrubAmount = 0.5,
    duration = 0.8,
    ease = "power2.out",
    startTrigger = "top 80%",
    endTrigger = "top 50%"
  } = animationConfig;
  
  useEffect(() => {
    // Set initial state if not first card
    if (index !== 0 && cardRef.current) {
      gsap.set(cardRef.current, {
        rotation: startRotation,
        opacity: startOpacity,
        transformOrigin: 'top right'
      });
    }
    
    // Create animation for each card
    const animation = gsap.to(cardRef.current, {
      rotation: endRotation,
      opacity: endOpacity,
      duration: duration,
      ease: ease,
      scrollTrigger: {
        trigger: cardRef.current,
        start: startTrigger,
        end: endTrigger,
        scrub: scrubAmount,
        toggleActions: "play reverse play reverse", // This makes the animation work both scrolling up and down
        // markers: true,    // Uncomment for debugging
      }
    });
    
    return () => {
      // Clean up animation when component unmounts
      if (animation && animation.scrollTrigger) {
        animation.scrollTrigger.kill();
      }
      animation.kill();
    };
  }, [index, startRotation, endRotation, startOpacity, endOpacity, scrubAmount, duration, ease, startTrigger, endTrigger]);
  
  return (
    <div 
      ref={cardRef}
      className={`
        bg-background border border-border p-10 md:p-12 rounded-2xl shadow-sm
        mb-8 md:mb-16
      `}
    >
      <div className="max-w-3xl">
        <h3 className="text-2xl md:text-3xl font-display font-light mb-6">{title}</h3>
        <p className="text-muted-foreground mb-8">{description}</p>
        <a 
          href={link} 
          className="inline-flex items-center gap-2 font-medium text-primary hover:underline group"
        >
          Learn more <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
};

interface ServicesSectionProps {
  title?: string;
  subtitle?: string;
  services: Service[];
  animationConfig?: {
    startRotation?: number;
    endRotation?: number;
    startOpacity?: number;
    endOpacity?: number;
    scrubAmount?: number;
    duration?: number;
    ease?: string;
    startTrigger?: string;
    endTrigger?: string;
  };
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  title = "Bringing your ideas to life",
  subtitle = "We offer a range of services to help you create memorable digital experiences that engage and inspire.",
  services,
  animationConfig
}) => {
  return (
    <section className="py-24 md:py-32 px-6 md:px-10 bg-secondary/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <span className="text-sm font-medium text-primary/70 block mb-4">Services</span>
          <h2 className="text-3xl md:text-4xl font-display font-light tracking-tight mb-6">
            <AnimatedText
              text={title}
              highlightedText="life"
              startOpacity={0.7}
              endOpacity={1}
              startTrigger="top 90%"
              endTrigger="top 60%"
              scrubAmount={0.3}
            />
          </h2>
          <AnimatedText
            text={subtitle}
            element="p"
            className="text-muted-foreground"
            startOpacity={0.7}
            endOpacity={1}
            startTrigger="top 85%"
            endTrigger="top 65%"
            scrubAmount={0.3}
          />
        </div>

        <div className="space-y-8 md:space-y-16">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              index={index}
              title={service.title}
              description={service.description}
              link={service.link}
              animationConfig={animationConfig}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Default services data - can be overridden by props
ServicesSection.defaultProps = {
  services: [
    {
      title: "Interactive Scroll Experiences",
      description: "We create immersive scroll-based interactions that engage users and tell your brand story through motion and animation.",
      link: "#"
    },
    {
      title: "Visual Design & Branding",
      description: "From logo design to comprehensive brand systems, we craft visual identities that communicate your unique value proposition.",
      link: "#"
    },
    {
      title: "Web Development",
      description: "We build fast, responsive, and accessible websites that work flawlessly across all devices and platforms.",
      link: "#"
    },
    {
      title: "Motion Design",
      description: "Adding thoughtful animations and transitions to enhance user experience and bring your digital products to life.",
      link: "#"
    },
    {
      title: "UI/UX Design",
      description: "User-centered design approaches that balance beautiful interfaces with intuitive, frictionless user experiences.",
      link: "#"
    }
  ]
};

export default ServicesSection;
