import { Mail, MapPin, Phone } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { getSiteSettings } from "@/lib/data";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact"
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="container-shell page-shell">
      <SectionHeading kicker="Contact" title={settings.contactHeading} description="Reach out for retreat registration, speaking invitations, prayer, or partnership." />
      <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] w-full max-w-full overflow-hidden">
        <div className="glass-panel rounded-[28px] p-4 sm:p-7 w-full max-w-full overflow-hidden">
          <ContactForm />
        </div>
        <div className="grid gap-5 w-full max-w-full">
          {[
            [Mail, settings.contactEmail],
            [Phone, settings.contactPhone],
            [MapPin, settings.address]
          ].map(([Icon, value]) => (
            <div key={value} className="rounded-[24px] border border-white/10 bg-white/[0.045] p-6">
              <Icon className="text-yellow-200" size={22} />
              <p className="mt-4 text-white/72">{value}</p>
            </div>
          ))}
          <div
            className="min-h-[260px] rounded-[24px] border border-white/10 bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(135deg,rgba(216,184,106,0.18),rgba(125,38,61,0.28)),url('${settings.contactImage}')` }}
          />
        </div>
      </div>
    </div>
  );
}
