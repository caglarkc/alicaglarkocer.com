import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ACK Techs — Birlikte Üretiyoruz',
  description:
    'ACK Techs ekibi, ürünleri, hedefleri ve birlikte çalışma kültürü.',
  keywords: [
    'ACK Techs',
    'teknoloji ekibi',
    'ürün geliştirme',
    'yapay zekâ',
    'tasarım',
  ],
  openGraph: {
    title: 'ACK Techs — Birlikte Üretiyoruz',
    description:
      'Fikirden çalışan ürüne. Ekibimizi, üretimlerimizi ve çalışma kültürümüzü keşfedin.',
    type: 'website',
    locale: 'tr_TR',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'ACK Techs — Birlikte Üretiyoruz',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ACK Techs — Birlikte Üretiyoruz',
    description:
      'Fikirden çalışan ürüne. Ekibimizi ve üretimlerimizi keşfedin.',
    images: ['/og.png'],
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
