import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Careers at TrinityByte";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage("Build the company, not just the product.");
}
