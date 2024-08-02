// src/app/layout.tsx
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { ReactNode } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata = {
  title: 'Urban Square',
  description: 'A map application using Next.js and Leaflet',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
      <div className="flex flex-col h-screen w-screen overflow-hidden">
          <Header />
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
