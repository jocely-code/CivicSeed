import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CivicSeed — From student concerns to real-world solutions",
  description:
    "A congressional app challenge prototype: guides high school students from a school or community problem to an evidence-based, editable policy brief, with a real 0–100 Policy Readiness Check.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
