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
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:mt-16">
          {testimonials.map((item, index) => (
            <MotionReveal
              key={item.id}
              className="min-w-0"
              delay={index * 0.08}
            >
              <CardTestimoni
                quote={item.content}
                name={item.name}
                role={item.brand}
                initials={getInitials(item.name)}
                rating={item.rating}
              />
            </MotionReveal>
          ))}
        </div>

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
