import { ImageResponse } from "next/og";

export const alt = "feranmi.ai — ask me anything";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#000000",
          color: "#F7F4EE",
          fontFamily: "monospace",
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0, transparent 11px, rgba(255,255,255,0.04) 11px, rgba(255,255,255,0.04) 12px)",
        }}
      >
        {/* Dashed frame */}
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: "1.5px dashed #2F2E2B",
            borderRadius: 2,
            display: "flex",
          }}
        />

        {/* Left panel — chat bubbles */}
        <div
          style={{
            display: "flex",
            flex: 1,
            padding: "64px 56px 64px 64px",
            gap: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: 20,
              justifyContent: "center",
            }}
          >
            {/* Fake chat messages */}
            {/* User message */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  background: "#F7F4EE",
                  color: "#0a0a09",
                  borderRadius: "18px 18px 4px 18px",
                  padding: "14px 22px",
                  fontSize: 22,
                  maxWidth: 480,
                  display: "flex",
                  fontWeight: 600,
                }}
              >
                is feranmi open to work?
              </div>
            </div>

            {/* AI message */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: "#F7F4EE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "#000", fontSize: 18, display: "flex" }}>✦</span>
              </div>
              <div
                style={{
                  background: "#0d0d0c",
                  border: "1px solid #2F2E2B",
                  color: "#E8E4DB",
                  borderRadius: "4px 18px 18px 18px",
                  padding: "14px 22px",
                  fontSize: 22,
                  maxWidth: 480,
                  lineHeight: 1.5,
                  display: "flex",
                }}
              >
                yes — actively exploring senior roles in fintech & developer tools 🚀
              </div>
            </div>

            {/* User message 2 */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  background: "#F7F4EE",
                  color: "#0a0a09",
                  borderRadius: "18px 18px 4px 18px",
                  padding: "14px 22px",
                  fontSize: 22,
                  maxWidth: 480,
                  display: "flex",
                  fontWeight: 600,
                }}
              >
                what's his best project?
              </div>
            </div>

            {/* AI message 2 */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: "#F7F4EE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "#000", fontSize: 18, display: "flex" }}>✦</span>
              </div>
              <div
                style={{
                  background: "#0d0d0c",
                  border: "1px solid #2F2E2B",
                  color: "#E8E4DB",
                  borderRadius: "4px 18px 18px 18px",
                  padding: "14px 22px",
                  fontSize: 22,
                  maxWidth: 480,
                  lineHeight: 1.5,
                  display: "flex",
                }}
              >
                moniepoint's KYC system — 10M+ users, zero downtime 💪
              </div>
            </div>
          </div>

          {/* Right panel — CTA */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 24,
              width: 320,
              paddingLeft: 48,
              borderLeft: "1px dashed #2F2E2B",
            }}
          >
            {/* Spark icon + label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "#7A7469",
                fontSize: 18,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  background: "#F7F4EE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000",
                  fontSize: 16,
                }}
              >
                ✦
              </span>
              feranmi.ai
            </div>

            <div
              style={{
                fontSize: 38,
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: "#F7F4EE",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span style={{ display: "flex" }}>ask me</span>
              <span style={{ display: "flex", color: "#B8B2A7", fontStyle: "italic" }}>anything.</span>
            </div>

            <div
              style={{
                fontSize: 17,
                color: "#7A7469",
                lineHeight: 1.6,
                display: "flex",
              }}
            >
              grounded in feranmi's actual work, experience & opinions.
            </div>

            {/* Online indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 20px",
                border: "1px solid #2F2E2B",
                borderRadius: 999,
                fontSize: 16,
                color: "#E8E4DB",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "#4ade80",
                  display: "flex",
                }}
              />
              online now
            </div>

            <div style={{ color: "#3D3830", fontSize: 16, display: "flex" }}>
              devferanmi.xyz/llm
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
