import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Knowledge Portal
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Recent
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              Favorites
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}