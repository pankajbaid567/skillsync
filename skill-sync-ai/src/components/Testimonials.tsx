import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Jessica Park",
    role: "UX Designer → Learning Python",
    avatar: "JP",
    rating: 5,
    content: "Found my perfect coding mentor in minutes! The AI matching is incredibly accurate. I'm finally learning Python from someone who gets my design background.",
    gradient: "from-primary to-primary-glow",
  },
  {
    name: "David Chen",
    role: "Developer → Learning Design",
    avatar: "DC",
    rating: 5,
    content: "SkillSync connected me with an amazing designer who helped me improve my UI skills. Trading my React knowledge for design expertise was the best decision!",
    gradient: "from-secondary to-primary",
  },
  {
    name: "Maya Rodriguez",
    role: "Content Writer → Learning Marketing",
    avatar: "MR",
    rating: 5,
    content: "The community here is incredible. I've learned digital marketing while helping others improve their writing. Every swap feels like gaining a new friend.",
    gradient: "from-accent to-secondary",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl font-bold mb-4 md:text-5xl">
            What Our <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Community</span> Says
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of learners growing together through skill exchange
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.gradient} text-white font-semibold shadow-md`}>
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
