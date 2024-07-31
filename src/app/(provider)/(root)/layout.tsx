// src/app/(provider)/(root)/layout.tsx
import type { Metadata } from 'next';
import Header from '@/components/header';
import '@/app/globals.css';
import Footer from '@/components/ footer';
import QueryProvider from '../Provider';

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
    <html lang="ko">
      <body style={{ fontFamily: 'SUIT Variable, sans-serif' }}>
        <QueryProvider>
          <Header />
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
