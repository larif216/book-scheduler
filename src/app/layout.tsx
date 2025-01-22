import '../styles/globals.css';

export const metadata = {
  title: 'Library App',
  description: 'A simple library app with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-800">
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-lg font-bold">Library App</h1>
          </div>
        </header>
        <main className="container mx-auto mt-6">{children}</main>
      </body>
    </html>
  );
}
