import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Andrezi, the memory that governs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Og() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#14171c",
          backgroundImage:
            "radial-gradient(120% 80% at 30% 20%, rgba(217,138,75,0.12), transparent 60%)",
          color: "#e9eaed",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", color: "#d98a4b", letterSpacing: 8, fontSize: 22, textTransform: "uppercase" }}>
          project 01 · open source · MIT
        </div>
        <div style={{ display: "flex", fontSize: 150, fontWeight: 800, letterSpacing: -4, marginTop: 18 }}>
          ANDREZI
        </div>
        <div style={{ display: "flex", color: "#d98a4b", fontSize: 44, marginTop: 8 }}>
          the memory that governs
        </div>
        <div style={{ display: "flex", color: "#8a94a1", fontSize: 26, marginTop: 40, maxWidth: 900 }}>
          a local-first memory governance layer for Claude Code agents
        </div>
        <div style={{ display: "flex", color: "#626c79", fontSize: 22, marginTop: 48, letterSpacing: 2 }}>
          andrewaltair.ge / projects / andrezi
        </div>
      </div>
    ),
    { ...size }
  );
}
