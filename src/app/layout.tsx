import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar'; // Import the new Navbar

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}