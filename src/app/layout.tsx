import '../styles/globals.css';
import Navbar from '../app/components/Navbar';

export const metadata = {
  title: 'Library App',
  description: 'A simple library app with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-800">
        <Navbar />
        <main id='root' className="container mx-auto mt-6">{children}</main>
      </body>
    </html>
  );
}
