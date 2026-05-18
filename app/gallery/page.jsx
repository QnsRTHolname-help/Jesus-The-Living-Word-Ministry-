import GalleryGrid from "@/components/GalleryGrid";
import SectionHeading from "@/components/SectionHeading";
import { getSiteSettings } from "@/lib/data";

export const metadata = {
  title: "Gallery | Aurora Ministry"
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const settings = await getSiteSettings();

  return (
    <div className="container-shell pt-36">
      <SectionHeading
        kicker="Gallery"
        title="A visual archive of retreat life."
        description="Click any image for a focused preview."
      />
      <div className="mt-12">
        <GalleryGrid images={settings.galleryImages} />
      </div>
    </div>
  );
}
