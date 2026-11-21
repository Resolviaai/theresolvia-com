export type BjorkTone = "light" | "dark" | "stone" | "zinc";

export interface TonePalette {
  text: string;
  background: string;
  accent: string;
  muted: string;
}

export const BJORK_PALETTE: Record<BjorkTone, TonePalette> = {
  dark: {
    text: "#ffffff",
    background: "#0b0f17",
    accent: "#2f86f7",
    muted: "#8a91a6",
  },
  light: {
    text: "#0b0f17",
    background: "#ffffff",
    accent: "#2f86f7",
    muted: "#64748b",
  },
  stone: {
    text: "#f5f5f4",
    background: "#1c1917",
    accent: "#38bdf8",
    muted: "#a8a29e",
  },
  zinc: {
    text: "#f4f4f5",
    background: "#09090b",
    accent: "#60a5fa",
    muted: "#71717a",
  },
};
