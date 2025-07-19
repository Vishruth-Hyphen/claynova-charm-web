import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    comment: "I ordered a custom keychain with my daughter's initial and it's absolutely beautiful! The attention to detail is incredible and the quality is premium. Highly recommended!",
  },
  {
    id: '2',
    name: 'Arjun Patel',
    location: 'Delhi',
    rating: 5,
    comment: "Got these as gifts for my team and everyone loved them! The packaging was so elegant and each keychain felt unique. Will definitely order again.",
  },
  {
    id: '3',
    name: 'Meera Nair',
    location: 'Bangalore',
    rating: 5,
    comment: "The floral design keychain exceeded my expectations. It's so delicate and pretty, exactly what I was looking for. Thank you for this beautiful piece!",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real reviews from people who love our handcrafted keychains
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-2xl p-6 shadow-card hover:shadow-hover transition-all duration-300 hover:scale-105"
            >
              {/* Quote Icon */}
              <div className="flex items-center justify-between mb-4">
                <Quote className="w-8 h-8 text-lilac opacity-50" />
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.comment}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-foreground">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-lilac-light/20 rounded-full px-6 py-3">
            <Star className="w-5 h-5 text-lilac" />
            <span className="text-foreground font-medium">
              Join 500+ happy customers
            </span>
            <Star className="w-5 h-5 text-lilac" />
          </div>
        </div>
      </div>
    </section>
  );
};