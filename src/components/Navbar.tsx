
import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-10",
        isScrolled ? "py-4 nav-blur" : "py-6"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="text-2xl font-display font-medium">
          <span className="text-primary">Sequence</span>
        </a>
        
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-10">
            <li>
              <a 
                href="#about" 
                className="text-primary/80 hover:text-primary transition-colors duration-300 text-sm font-medium"
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#features" 
                className="text-primary/80 hover:text-primary transition-colors duration-300 text-sm font-medium"
              >
                Features
              </a>
            </li>
            <li>
              <a 
                href="#gallery" 
                className="text-primary/80 hover:text-primary transition-colors duration-300 text-sm font-medium"
              >
                Gallery
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className="text-primary/80 hover:text-primary transition-colors duration-300 text-sm font-medium"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
        
        <button
          className="block md:hidden text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-background pt-20 px-6 transition-opacity duration-300 md:hidden",
          isMobileMenuOpen ? "opacity-100 z-40" : "opacity-0 pointer-events-none"
        )}
      >
        <nav>
          <ul className="flex flex-col space-y-6">
            <li>
              <a 
                href="#about" 
                className="text-primary text-xl font-medium block py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#features" 
                className="text-primary text-xl font-medium block py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
            </li>
            <li>
              <a 
                href="#gallery" 
                className="text-primary text-xl font-medium block py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Gallery
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className="text-primary text-xl font-medium block py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
