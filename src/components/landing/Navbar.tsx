import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { Logo } from '../common/Logo';
import { Button } from '../common/Button';

interface NavbarProps {
  onScrollToSection: (sectionId: string) => void;
}

export function Navbar({ onScrollToSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Features', id: 'features' },
    { name: 'How It Works', id: 'how-it-works' },
    { name: 'Testimonials', id: 'testimonials' },
    { name: 'FAQ', id: 'faq' },
  ];

  const handleLinkClick = (id: string) => {
    setIsOpen(false);
    onScrollToSection(id);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Brand */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo size="md" />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="text-sm font-medium text-slate-600 hover:text-brand-primary-500 dark:text-slate-300 dark:hover:text-brand-primary-500 transition-colors duration-200 cursor-pointer"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Dual Action Login/Signup Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-brand-primary-500 dark:text-slate-350 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar/Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-all duration-200">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="block w-full text-left px-3 py-2 text-base font-medium rounded-xl text-slate-700 hover:bg-slate-50 hover:text-brand-primary-500 dark:text-slate-300 dark:hover:bg-slate-850 dark:hover:text-brand-primary-500 transition-all duration-200"
              >
                {link.name}
              </button>
            ))}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex flex-col space-y-2 px-3">
              <Link to="/login" className="w-full">
                <Button variant="ghost" size="md" className="w-full justify-center">
                  Log In
                </Button>
              </Link>
              <Link to="/signup" className="w-full">
                <Button variant="primary" size="md" className="w-full justify-center">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
