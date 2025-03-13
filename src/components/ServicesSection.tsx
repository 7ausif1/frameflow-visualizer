
import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

interface ServiceCardProps {
  title: string;
  description: string;
  index: number;
  link: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, index, link }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Set initial state if not first card
    if (index !== 0 && cardRef.current) {
      gsap.set(cardRef.current, {
        rotation: 5,
        opacity: 0.7,
        transformOrigin: 'top right'
      });
    }
    
    // Create animation for each card
    const animation = gsap.to(cardRef.current, {
      rotation: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 80%", // Start animation when the top of the element hits 80% from the top of viewport
        end: "top 50%",   // End animation when the top of the element hits 50% from the top of viewport
        scrub: 0.5,       // Smooth scrubbing effect
        once: true,       // Only animate once
        // markers: true,    // Uncomment for debugging
      }
    });
    
    return () => {
      // Clean up animation when component unmounts
      animation.kill();
    };
  }, [index]);
  
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

const ServicesSection: React.FC = () => {
  const services = [
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
  ];

  return (
    <section className="py-24 md:py-32 px-6 md:px-10 bg-secondary/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <span className="text-sm font-medium text-primary/70 block mb-4">Services</span>
          <h2 className="text-3xl md:text-4xl font-display font-light tracking-tight mb-6 text-reveal">
            Bringing your ideas to <span className="relative inline-block">
              life
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
            </span>
          </h2>
          <p className="text-muted-foreground text-reveal">
            We offer a range of services to help you create memorable digital experiences that engage and inspire.
          </p>
        </div>

        <div className="space-y-8 md:space-y-16">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              index={index}
              title={service.title}
              description={service.description}
              link={service.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
