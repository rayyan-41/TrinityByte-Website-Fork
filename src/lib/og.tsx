import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/data/site";

/** Shared 1200x630 social card. Each route passes its own headline. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export async function renderOgImage(headline: string) {
  const [mark, display] = await Promise.all([
    readFile(join(process.cwd(), "public/brand/TB_logo_no_bg.png")),
    // Satori cannot read woff2 ("Unsupported OpenType signature wOF2"), so this
    // is the same Inter Display cut decompressed to ttf. Regenerate with
    // `wawoff2` if the brand font ever changes.
    readFile(join(process.cwd(), "assets/InterDisplay-SemiBold.ttf")),
  ]);

  // Long headlines need to step down a size or they overflow the card.
  const fontSize = headline.length > 46 ? 68 : 82;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#050505",
          backgroundImage:
            "radial-gradient(closest-side at 78% 18%, rgba(200,171,114,0.20), transparent)",
          fontFamily: "InterDisplay",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${mark.toString("base64")}`}
            width={54}
            height={53}
            alt=""
          />
          <div
            style={{ fontSize: 26, letterSpacing: "0.16em", color: "rgba(242,239,233,0.55)" }}
          >
            TRINITYBYTE
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize,
            lineHeight: 1.04,
            letterSpacing: "-0.035em",
            color: "#f2efe9",
            maxWidth: 960,
          }}
        >
          {headline}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(242,239,233,0.14)",
            paddingTop: 26,
          }}
        >
          <div style={{ display: "flex", fontSize: 26, color: "#c8ab72" }}>{site.tagline}</div>
          <div style={{ display: "flex", fontSize: 24, color: "rgba(242,239,233,0.45)" }}>
            trinitybyte.org
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: [{ name: "InterDisplay", data: display, weight: 600, style: "normal" }] }
  );
}
