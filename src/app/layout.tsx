// app/layout.tsx
"use client"
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Layout from "@/modules/admin/common/views/layout";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo-client";

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"], // Specify the font subsets you need
  variable: "--font-plus-jakarta-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApolloProvider client = {client}>
      <html lang="en">
        <body className={`${plusJakartaSans.variable}`}>
          <Layout>
            {children}
          </Layout>
        </body>
      </html>
    </ApolloProvider>
  );
}
