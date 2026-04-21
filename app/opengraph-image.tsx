import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo/config";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          color: "#F7F4EE",
          padding: "64px",
          fontFamily: "monospace",
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0, transparent 11px, rgba(255,255,255,0.04) 11px, rgba(255,255,255,0.04) 12px)",
        }}
      >
        {/* Dashed frame inset */}
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: "1.5px dashed #2F2E2B",
            borderRadius: 2,
            display: "flex",
          }}
        />

        {/* Top row — terminal prompt */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 22,
            color: "#B8B2A7",
            letterSpacing: 1,
          }}
        >
          <span>devferanmi.xyz</span>
          <span style={{ color: "#4ade80" }}>~</span>
          <span style={{ color: "#7A7469" }}>$</span>
          <span style={{ color: "#E8E4DB" }}>whoami</span>
        </div>

        {/* Center — name + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: "#F7F4EE",
              display: "flex",
            }}
          >
            oluwaferanmi
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: "#B8B2A7",
              fontStyle: "italic",
              display: "flex",
            }}
          >
            adeniji.
          </div>

          <div
            style={{
              marginTop: 24,
              fontSize: 28,
              color: "#E8E4DB",
              lineHeight: 1.4,
              maxWidth: 900,
              display: "flex",
            }}
          >
            senior software engineer · lagos, nigeria
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#B8B2A7",
              lineHeight: 1.5,
              maxWidth: 980,
              display: "flex",
            }}
          >
            fintech · developer tools · AI. 10M+ users at moniepoint. open-source: connectic, monie utils.
          </div>
        </div>

        {/* Bottom row — open to work pill + url */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 22px",
              border: "1px solid #2F2E2B",
              borderRadius: 999,
              color: "#E8E4DB",
              letterSpacing: 2,
              textTransform: "uppercase",
              fontSize: 18,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#4ade80",
                display: "flex",
              }}
            />
            open to work
          </div>
          <div style={{ color: "#7A7469", display: "flex" }}>devferanmi.xyz</div>
        </div>
      </div>
    ),
    size
  );
}
