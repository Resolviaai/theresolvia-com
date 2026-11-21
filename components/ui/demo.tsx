"use client";

import LiquidText from "@/components/ui/liquid-text";

export default function LiquidTextDemo() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0B0F17] px-8">
      <LiquidText
        text="Resolvia"
        tone="dark"
        fontSize={160}
        color="#ffffff"
        accentColor="#2F86F7"
        className="w-full max-w-4xl"
      />
    </div>
  );
}

export { LiquidTextDemo };
