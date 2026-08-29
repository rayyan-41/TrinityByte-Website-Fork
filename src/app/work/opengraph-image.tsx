import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "TrinityByte Work";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage("Selected builds.");
}
