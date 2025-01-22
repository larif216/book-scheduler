// components/Navbar.tsx
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold text-white">Library App</h1>
        <div className="space-x-4">
          <Link
            href="/"
            className="text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition duration-200"
          >
            Home
          </Link>
          <Link
            href="/pickup-schedule"
            className="text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition duration-200"
          >
            Pickup Schedule
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;