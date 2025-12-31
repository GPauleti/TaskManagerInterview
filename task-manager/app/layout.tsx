import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "Task Manager",
  description: "Simple task manager using Next.js and tRPC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
