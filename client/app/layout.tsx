import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chess Multiplayer",
  description: "Real-time multiplayer chess game with WebSocket",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
