import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "About TrinityByte";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage("Every great idea deserves exceptional execution.");
}
