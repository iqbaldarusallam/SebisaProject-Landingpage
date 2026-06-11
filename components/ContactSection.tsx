import ContactForm from "./ContactForm";
import MotionReveal from "./MotionReveal";

export default function ContactSection() {
  return (
    <section id="kontak" className="bg-[#ECECEC] px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <MotionReveal className="text-center text-3xl font-extrabold leading-tight text-gray-800 sm:text-5xl md:text-6xl">
          Siap untuk <span className="text-[#173472]">Kita Bantu?</span>
        </MotionReveal>

        <MotionReveal delay={0.08}>
          <ContactForm />
        </MotionReveal>
      </div>
    </section>
  );
}
