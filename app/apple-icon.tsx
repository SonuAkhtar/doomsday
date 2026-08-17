import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #12101a 0%, #050507 100%)",
        }}
      >
        <div style={{ display: "flex", gap: 12, transform: "skewX(-12deg)" }}>
          <div style={{ width: 26, height: 92, borderRadius: 6, background: "#e01a2b" }} />
          <div style={{ width: 26, height: 92, borderRadius: 6, background: "#cf9b52" }} />
        </div>
      </div>
    ),
    size,
  );
}
