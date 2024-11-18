"use client";

import Navbar from "@/components/NavBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <body>
          <Navbar />
          {children}
        </body>
      </html>
    </QueryClientProvider>
  );
}
