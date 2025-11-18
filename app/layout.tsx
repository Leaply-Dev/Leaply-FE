import '@/app/globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DataInitializer } from '@/components/DataInitializer';

export const metadata = {
  title: 'Leaply - Your AI-Powered Study Abroad Companion',
  description: 'Discover universities, manage applications, and get personalized guidance for studying abroad with Leaply.',
  icons: {
    icon: '/icon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen flex flex-col">
        <DataInitializer />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}