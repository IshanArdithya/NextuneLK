import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { CustomToaster } from "@/components/CustomToast";

export const metadata: Metadata = {
  title: "Nexora",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <html lang="en">
        <body className={`antialiased`}>
          <div>{children}</div>
          <CustomToaster />
        </body>
      </html>
    </ThemeProvider>
  );
}
