import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "TrinityByte Services";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage("Five services. One accountable team.");
}
