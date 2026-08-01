import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="container-page py-16 sm:py-24">
      <p className="eyebrow mb-5">Contact</p>
      <h1 className="font-display text-5xl sm:text-6xl mb-12 max-w-2xl">
        Get in touch.
      </h1>
      <ContactForm />
    </div>
  );
}
