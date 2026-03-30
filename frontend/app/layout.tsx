import type { ReactNode } from "react";
import "leaflet/dist/leaflet.css"
import "./globals.css";
import AppLayout from "@/components/AppLayout";
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <AppLayout>{children}</AppLayout>
        <Toaster />
      </body>
    </html>
  );
}