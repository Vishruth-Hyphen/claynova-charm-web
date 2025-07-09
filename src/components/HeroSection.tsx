import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-lilac-light/20 to-sky-blue-light/20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Brand Name */}
          <div className="mb-6">
            <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-lilac" />
              <span className="text-sm font-medium text-foreground">Handcrafted with Love</span>
            </div>
            <div className="flex flex-col items-center mb-4 animate-fade-in">
              <img 
                src="/lovable-uploads/d296c438-03af-4df4-ae2b-b485b3f87b15.png" 
                alt="Claynova" 
                className="h-20 lg:h-28 w-auto mb-4"
              />
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground">
                Clay<span className="text-lilac">nova</span>
              </h1>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Handcrafted charm, one keychain at a time
          </p>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-10 max-w-3xl mx-auto animate-fade-in">
            Discover our collection of unique polymer clay keychains, each lovingly handcrafted 
            with attention to detail. From personalized initials to whimsical patterns, 
            every piece tells a story.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 bg-lilac hover:bg-lilac-dark text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-hover hover:scale-105"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-foreground px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-soft border border-white/30"
            >
              <span>Get Custom Made</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-lilac-light/20 rounded-full animate-float" />
      <div className="absolute bottom-1/4 right-10 w-16 h-16 bg-sky-blue-light/20 rounded-full animate-bounce-gentle" />
      <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-beige/30 rounded-full animate-float" />
    </section>
  );
};