// app/layout.js

import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/react'; // <-- 1. Tambahkan import ini

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Say Cheeze - Free Online Photobooth',
  description: 'Abadikan momen seru dengan photobooth online gratis!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        {children}
        <Analytics /> 
      </body>
    </html>
  );
}