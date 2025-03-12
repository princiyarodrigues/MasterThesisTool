// src/app/layout.js
import localFont from "next/font/local";
import { Navbar } from '@/components/Navbar';
import Providers from '../components/Providers';
import './globals.css';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Digital Twin Factory Tool",
  description: "Knowledge management portal for digital twin factory",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen bg-white">
        <Providers>
          <Navbar />
          <main className="m-8 px-8 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}