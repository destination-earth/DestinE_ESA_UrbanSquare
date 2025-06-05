// src/app/layout.tsx
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { ReactNode } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MonitoringInitializer from './components/MonitoringInitializer';

export const metadata = {
  title: 'Urban Square',
  description: 'A map application using Next.js and Leaflet',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const basePath = process.env.BASEPATH || '';
  
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href={basePath + "/desp_logo.svg"} />
      </head>
      <body>
        <MonitoringInitializer />
        <div className="flex flex-col h-screen w-screen overflow-hidden">
          <Header />
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}