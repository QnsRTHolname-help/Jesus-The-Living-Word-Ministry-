import { Facebook, Instagram, Link2, Linkedin, Mail, MessageCircle, Twitter, Youtube } from "lucide-react";

function TikTokIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
    </svg>
  );
}

const icons = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  mail: Mail,
  twitter: Twitter,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
  tiktok: TikTokIcon,
  link: Link2
};

export const footerIconOptions = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "Twitter / X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "mail", label: "Email" },
  { value: "link", label: "Generic link" }
];

const labelIconMap = [
  ["instagram", "instagram"],
  ["youtube", "youtube"],
  ["facebook", "facebook"],
  ["whatsapp", "whatsapp"],
  ["tiktok", "tiktok"],
  ["twitter", "twitter"],
  ["linkedin", "linkedin"],
  ["email", "mail"],
  ["mail", "mail"]
];

export function inferFooterIcon(link) {
  if (link?.icon && link.icon !== "link") return link.icon;
  const label = String(link?.label || "").toLowerCase();
  for (const [needle, icon] of labelIconMap) {
    if (label.includes(needle)) return icon;
  }
  return link?.icon || "link";
}

export function normalizeFooterLinks(links = []) {
  return links.map((link) => ({ ...link, icon: inferFooterIcon(link) }));
}

export default function FooterSocialIcon({ name, size = 18 }) {
  const Icon = icons[name] || Link2;
  return <Icon size={size} />;
}

export function resolveFooterHref(link, contactEmail) {
  const url = String(link?.url || "").trim();
  if (url) return url;
  if (link?.icon === "mail" && contactEmail) return `mailto:${contactEmail}`;
  return "#";
}
