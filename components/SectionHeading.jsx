import Reveal from "@/components/Reveal";

export default function SectionHeading({ kicker, title, description, align = "left" }) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="section-kicker">{kicker}</p>
      <h2 className="mt-4 font-[var(--font-playfair)] text-4xl font-semibold leading-tight text-balance md:text-5xl">
        {title}
      </h2>
      {description && <p className="mt-5 text-base leading-8 text-white/62 md:text-lg">{description}</p>}
    </Reveal>
  );
}
