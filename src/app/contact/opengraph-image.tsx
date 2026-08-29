import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Start a Project with TrinityByte";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage("Have an idea? Let’s build something extraordinary.");
}
