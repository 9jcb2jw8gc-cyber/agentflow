import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentFlow — Visual canvas for Claude Agent SDK",
  description:
    "Build multi-agent AI systems visually. Drag, drop, connect. Export portable YAML. No configuration code required.",
  openGraph: {
    title: "AgentFlow",
    description: "Visual canvas for building Claude AI agents",
    images: ["/og-image.png"],
    url: "https://agentflow.ai",
    siteName: "AgentFlow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentFlow",
    description: "Visual canvas for building Claude AI agents",
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://agentflow.ai"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
