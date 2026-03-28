import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drop a pin — PlanDrop",
  description:
    "Enter your city or neighborhood to see plans designed for your area.",
};

export default function DropLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
