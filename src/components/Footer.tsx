import { useState } from 'react';
import { Instagram, Mail, Heart, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
    // You could add a toast notification here
  };

  return (
    <footer className="bg-gradient-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-3xl font-bold text-primary mb-4 block">
              Claynova
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Handcrafted polymer clay keychains made with love in India. 
              Each piece is unique and tells its own story.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://instagram.com/claynova"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-muted-foreground hover:text-lilac transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span>@claynova</span>
              </a>
              <a
                href="mailto:hello@claynova.com"
                className="flex items-center space-x-2 text-muted-foreground hover:text-lilac transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>hello@claynova.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-lilac transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-muted-foreground hover:text-lilac transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-lilac transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-lilac transition-colors">
                  Custom Orders
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Subscribe to get updates on new collections and special offers
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-full border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-lilac focus:border-transparent transition-all"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bg-lilac hover:bg-lilac-dark text-white p-2 rounded-full transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 text-muted-foreground mb-4 md:mb-0">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm">Made with love in India</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Claynova. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};