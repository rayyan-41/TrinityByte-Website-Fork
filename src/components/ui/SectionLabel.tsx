import { Reveal } from "@/components/anim/Reveal";

type Props = {
  primary: string;
  secondary?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
};

/** Editorial section eyebrow: © LABEL + mono secondary line. */
export function SectionLabel({ primary, secondary, tone = "dark", align = "left" }: Props) {
  const muted = tone === "dark" ? "text-muted-dark" : "text-muted-light";
  const strong = tone === "dark" ? "text-ivory" : "text-ink";
  return (
    <Reveal y={22} className={align === "center" ? "text-center" : ""}>
      <p className={`label-mono ${muted}`}>
        <span className="text-gold">©</span> {primary}
      </p>
      {secondary ? (
        <p className={`label-mono mt-1.5 ${strong}`}>{secondary}</p>
      ) : null}
    </Reveal>
  );
}
