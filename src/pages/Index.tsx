import React, { useEffect, useRef } from 'react';
import ScrollSequence from '@/components/ScrollSequence';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServicesSection from '@/components/ServicesSection';
import AnimatedText from '@/components/AnimatedText';
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react';

const Index: React.FC = () => {
  const aboutRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = document.querySelectorAll('.text-reveal');
    elements.forEach((el) => observer.observe(el));
    
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
  
  // Services data
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
  
  // Custom animation configuration for services
  const serviceAnimationConfig = {
    startRotation: 5,
    endRotation: 0,
    startOpacity: 0.7,
    endOpacity: 1,
    scrubAmount: 0.5,
    duration: 0.8,
    ease: "power2.out",
    startTrigger: "top 80%",
    endTrigger: "top 60%"
  };
  
  return (
    <div className="relative">
      <Navbar />
      
      {/* Hero Section with Scroll Sequence */}
      <ScrollSequence 
        totalFrames={99} 
        scrollHeight={300}
        smoothness={1.5}
        speed={1.2}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="max-w-7xl w-full mx-auto px-6 md:px-10">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2 opacity-0 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium tracking-wide">
                  Introducing Sequence
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-light tracking-tight mb-6 opacity-0 animate-slide-up" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
                Experience design in <span className="font-medium relative">
                  motion
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg opacity-0 animate-slide-up" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
                A minimal approach to visual storytelling through seamless scroll-based animations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-slide-up" style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>
                <a 
                  href="#about"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-all duration-300 text-center sm:text-left hover:translate-y-[-2px] hover:shadow-lg"
                >
                  Explore
                </a>
                <a 
                  href="#features"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-3 rounded-md font-medium transition-all duration-300 flex items-center justify-center sm:justify-start gap-2 group hover:translate-y-[-2px] hover:shadow-lg"
                >
                  Learn more 
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center opacity-0 animate-fade-in" style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}>
          <span className="text-sm font-medium text-primary/70 block mb-2">Scroll to explore</span>
          <div className="animate-bounce">
            <ArrowDown size={20} className="text-primary/70 mx-auto" />
          </div>
        </div>
      </ScrollSequence>

      {/* Second Sequence Example */}
      <ScrollSequence 
        totalFrames={99} 
        scrollHeight={200}
        baseUrl="/sequence"
        framePrefix="frame-"
        frameExtension=".jpg"
        smoothness={2}
        speed={0.8}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 to-black/30 backdrop-blur-sm">
          <div className="text-center text-white max-w-2xl px-6">
            <h2 className="text-3xl md:text-5xl font-display font-light mb-6 opacity-0 text-reveal">
              Customizable <span className="relative inline-block">
                Parameters
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-white/30 rounded-full"></span>
              </span>
            </h2>
            <p className="text-lg opacity-80 mb-8 max-w-xl mx-auto text-reveal">
              This second sequence demonstrates how you can reuse the component with custom 
              settings for source path, speed, smoothness, and more.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-reveal">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="font-medium mb-1">Base URL</div>
                <div className="opacity-80">/sequence</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="font-medium mb-1">Speed</div>
                <div className="opacity-80">0.8x</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="font-medium mb-1">Smoothness</div>
                <div className="opacity-80">2</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="font-medium mb-1">Height</div>
                <div className="opacity-80">200vh</div>
              </div>
            </div>
          </div>
        </div>
      </ScrollSequence>
      
      {/* About Section */}
      <section 
        id="about" 
        ref={aboutRef}
        className="py-24 md:py-32 px-6 md:px-10 bg-background"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div>
              <span className="text-sm font-medium text-primary/70 block mb-4">About</span>
              <h2 className="text-3xl md:text-4xl font-display font-light tracking-tight mb-6">
                <AnimatedText 
                  text="The perfect blend of motion and design"
                  highlightedText="motion"
                  startOpacity={0.7}
                  endOpacity={1}
                  startTrigger="top 85%"
                  endTrigger="top 65%"
                  scrubAmount={0.4}
                />
              </h2>
              <AnimatedText
                text="Inspired by minimalist design principles, Sequence creates an immersive visual journey that engages users through subtle animations and thoughtful interaction."
                element="p"
                className="text-muted-foreground mb-6"
                startOpacity={0.7}
                endOpacity={1}
                startTrigger="top 80%"
                endTrigger="top 60%"
                scrubAmount={0.3}
              />
              <AnimatedText
                text="We believe in the power of simplicity and focus on creating experiences that are both beautiful and functional."
                element="p"
                className="text-muted-foreground"
                startOpacity={0.7}
                endOpacity={1}
                startTrigger="top 80%"
                endTrigger="top 60%"
                scrubAmount={0.3}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-secondary rounded-2xl p-8 text-reveal transform transition-transform duration-500 hover:translate-y-[-5px] hover:shadow-lg">
                <span className="text-4xl font-display font-light">01</span>
                <h3 className="text-lg font-medium mt-4 mb-2">Minimalism</h3>
                <p className="text-sm text-muted-foreground">Embracing simplicity in every aspect of design.</p>
              </div>
              
              <div className="bg-secondary rounded-2xl p-8 text-reveal transform transition-transform duration-500 hover:translate-y-[-5px] hover:shadow-lg" style={{ transitionDelay: "0.1s" }}>
                <span className="text-4xl font-display font-light">02</span>
                <h3 className="text-lg font-medium mt-4 mb-2">Animation</h3>
                <p className="text-sm text-muted-foreground">Subtle motion that enhances rather than distracts.</p>
              </div>
              
              <div className="bg-secondary rounded-2xl p-8 text-reveal transform transition-transform duration-500 hover:translate-y-[-5px] hover:shadow-lg" style={{ transitionDelay: "0.2s" }}>
                <span className="text-4xl font-display font-light">03</span>
                <h3 className="text-lg font-medium mt-4 mb-2">Precision</h3>
                <p className="text-sm text-muted-foreground">Attention to detail in every pixel and interaction.</p>
              </div>
              
              <div className="bg-secondary rounded-2xl p-8 text-reveal transform transition-transform duration-500 hover:translate-y-[-5px] hover:shadow-lg" style={{ transitionDelay: "0.3s" }}>
                <span className="text-4xl font-display font-light">04</span>
                <h3 className="text-lg font-medium mt-4 mb-2">Usability</h3>
                <p className="text-sm text-muted-foreground">Intuitive experiences that feel natural and effortless.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <div ref={servicesRef}>
        <ServicesSection 
          services={services}
          animationConfig={serviceAnimationConfig}
        />
      </div>
      
      {/* Features Section */}
      <section 
        id="features" 
        ref={featuresRef}
        className="py-24 md:py-32 px-6 md:px-10 bg-secondary"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-medium text-primary/70 block mb-4">Features</span>
            <h2 className="text-3xl md:text-4xl font-display font-light tracking-tight mb-6 text-reveal">
              Crafted with attention to <span className="relative inline-block">
                every detail
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
              </span>
            </h2>
            <p className="text-muted-foreground text-reveal">
              Our approach combines technical excellence with design precision, creating experiences that stand out while maintaining focus on simplicity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-2xl p-8 text-reveal transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary font-medium">01</span>
              </div>
              <h3 className="text-xl font-medium mb-4">Scroll-Based Animation</h3>
              <p className="text-muted-foreground">
                Precisely timed image sequences that transition based on scroll position, creating a cinematic experience.
              </p>
            </div>
            
            <div className="bg-background rounded-2xl p-8 text-reveal transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-lg" style={{ transitionDelay: "0.1s" }}>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary font-medium">02</span>
              </div>
              <h3 className="text-xl font-medium mb-4">Responsive Design</h3>
              <p className="text-muted-foreground">
                Perfectly optimized for all screen sizes, ensuring a consistent experience across devices.
              </p>
            </div>
            
            <div className="bg-background rounded-2xl p-8 text-reveal transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-lg" style={{ transitionDelay: "0.2s" }}>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary font-medium">03</span>
              </div>
              <h3 className="text-xl font-medium mb-4">Performance Focused</h3>
              <p className="text-muted-foreground">
                Optimized for smooth performance, with efficient image loading and rendering techniques.
              </p>
            </div>
            
            <div className="bg-background rounded-2xl p-8 text-reveal transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-lg" style={{ transitionDelay: "0.3s" }}>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary font-medium">04</span>
              </div>
              <h3 className="text-xl font-medium mb-4">Subtle Transitions</h3>
              <p className="text-muted-foreground">
                Elegant text and element animations that enhance the storytelling without overwhelming the user.
              </p>
            </div>
            
            <div className="bg-background rounded-2xl p-8 text-reveal transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-lg" style={{ transitionDelay: "0.4s" }}>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary font-medium">05</span>
              </div>
              <h3 className="text-xl font-medium mb-4">Typographic Excellence</h3>
              <p className="text-muted-foreground">
                Carefully selected fonts and text treatments that complement the visual experience.
              </p>
            </div>
            
            <div className="bg-background rounded-2xl p-8 text-reveal transform transition-all duration-500 hover:translate-y-[-5px] hover:shadow-lg" style={{ transitionDelay: "0.5s" }}>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary font-medium">06</span>
              </div>
              <h3 className="text-xl font-medium mb-4">Intuitive Navigation</h3>
              <p className="text-muted-foreground">
                Clear, simple navigation that guides users through the experience seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Gallery Section */}
      <section 
        id="gallery" 
        ref={galleryRef}
        className="py-24 md:py-32 px-6 md:px-10 bg-background"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-medium text-primary/70 block mb-4">Gallery</span>
            <h2 className="text-3xl md:text-4xl font-display font-light tracking-tight mb-6 text-reveal">
              Moments captured in <span className="relative inline-block">
                sequence
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
              </span>
            </h2>
            <p className="text-muted-foreground text-reveal">
              A collection of still frames from our animation sequence, showcasing the beauty of each individual moment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-reveal">
            {[1, 10, 20, 30, 40, 50].map((frame, index) => (
              <div 
                key={frame} 
                className="overflow-hidden rounded-lg group"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <img 
                  src={`/sequence/frame-${frame}.jpg`}
                  alt={`Frame ${frame}`}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section 
        id="contact" 
        ref={contactRef}
        className="py-24 md:py-32 px-6 md:px-10 bg-primary text-primary-foreground"
      >
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-sm font-medium text-primary-foreground/70 block mb-4">Contact</span>
          <h2 className="text-3xl md:text-4xl font-display font-light tracking-tight mb-6 text-reveal">
            Let's create something <span className="relative inline-block">
              amazing
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-white/30 rounded-full"></span>
            </span> together
          </h2>
          <p className="text-primary-foreground/80 mb-10 text-reveal">
            Interested in bringing your own scroll sequence to life? We'd love to hear from you and discuss how we can help with your project.
          </p>
          <a 
            href="#"
            className="inline-flex items-center gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-6 py-3 rounded-md font-medium transition-all duration-300 text-reveal hover:translate-y-[-2px] hover:shadow-lg"
          >
            Get in touch <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
