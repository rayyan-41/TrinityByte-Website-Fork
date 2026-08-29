import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "TrinityByte — Custom Software, Web, Mobile & AI Development";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage("We build digital products that deliver results.");
}
