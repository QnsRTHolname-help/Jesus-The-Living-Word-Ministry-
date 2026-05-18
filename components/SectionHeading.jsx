import Reveal from "@/components/Reveal";

export default function SectionHeading({ kicker, title, description, align = "left" }) {
  return (
    <Reveal
      className={
        align === "center"
          ? "mx-auto max-w-3xl text-center px-0 sm:px-2"
          : "max-w-3xl px-0 sm:pr-4"
      }
    >
      <p className="section-kicker">{kicker}</p>
      <h2 className="heading-section mt-3 font-[var(--font-playfair)] font-semibold text-balance sm:mt-4">
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 max-w-prose text-base leading-relaxed text-white/62 sm:mt-5 sm:text-lg sm:leading-8 ${align === "center" ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
