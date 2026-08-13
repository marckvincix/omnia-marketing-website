import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Omnia Marketing — Agenzia Web, Branding e Social a Napoli";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 96, fontWeight: 900, letterSpacing: -3 }}>
          OMNIA MARKETING
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#999999", marginTop: 24 }}>
          Agenzia Web, Branding e Social a Napoli
        </div>
        <div
          style={{
            display: "flex",
            width: 140,
            height: 6,
            backgroundColor: "#2e9bd6",
            marginTop: 44,
            borderRadius: 999,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
