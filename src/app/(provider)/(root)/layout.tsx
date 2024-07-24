// src/app/(provider)/(root)/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/header';
import '@/app/globals.css';
import Footer from '@/components/ footer';
import QueryProvider from '../Provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '코듀(CodeU)',
  description: 'Generated by create next app'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <Header />
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
