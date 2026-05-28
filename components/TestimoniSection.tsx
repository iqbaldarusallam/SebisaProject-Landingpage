import CardTestimoni from "./CardTestimoni";
import ContactForm from "./ContactForm";
import MotionReveal from "./MotionReveal";

type Testimonial = {
  id: number;
  name: string;
  brand: string;
  content: string;
  rating: number;
};

interface TestimoniSectionProps {
  testimonials: Testimonial[];
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

export default function TestimoniSection({
  testimonials,
}: TestimoniSectionProps) {
  return (
    <section className="bg-[#ECECEC] px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Badge */}
        <MotionReveal className="flex justify-center">
          <div className="rounded-lg bg-[#173472] px-6 py-2 text-sm font-bold text-white">
            TESTIMONI KLIEN
          </div>
        </MotionReveal>

        {/* Heading */}
        <MotionReveal
          delay={0.06}
          className="mt-6 text-center text-3xl font-extrabold leading-tight text-gray-800 sm:text-4xl md:text-5xl"
        >
          Ini kata mereka tentang{" "}
          <span className="text-[#173472]">Sebisa Project</span>
        </MotionReveal>

        {/* Cards */}
        {testimonials.length > 0 && (
          <MotionReveal delay={0.08} className="mt-10 lg:mt-16">
            <div className="relative overflow-hidden py-2">
              <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-linear-to-r from-[#ECECEC] to-transparent sm:w-24" />
              <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-linear-to-l from-[#ECECEC] to-transparent sm:w-24" />

              <div className="marquee flex w-max gap-4 hover:[animation-play-state:paused] sm:gap-6">
                {[...Array(2)].map((_, loopIndex) => (
                  <div key={loopIndex} className="flex gap-4 sm:gap-6">
                    {testimonials.map((item) => (
                      <div
                        key={`${loopIndex}-${item.id}`}
                        className="w-72 shrink-0 sm:w-80 md:w-96"
                      >
                        <CardTestimoni
                          quote={item.content}
                          name={item.name}
                          role={item.brand}
                          initials={getInitials(item.name)}
                          rating={item.rating}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </MotionReveal>
        )}

        {/* Contact Heading */}
        <MotionReveal
          className="mt-16 text-center text-3xl font-extrabold leading-tight text-gray-800 sm:mt-24 sm:text-5xl md:text-6xl"
        >
          Siap untuk <span className="text-[#173472]">Kita Bantu?</span>
        </MotionReveal>

        {/* Form */}
        <MotionReveal delay={0.08}>
          <ContactForm />
        </MotionReveal>
      </div>
    </section>
  );
}
