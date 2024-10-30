// components/Navbar.js
import Link from 'next/link';
import { File } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-green-600 border-b border-white sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-green-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <File className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-white-600 to-green-500 bg-clip-text text-white">
             Digital Twin Factory Tool
            </span>
          </Link>
          {/* <div className="flex items-center space-x-6">
            <NavLink href="/" active>Home</NavLink>
            <NavLink href="/recent">Recent</NavLink>
            <NavLink href="/favorites">Favorites</NavLink>
          </div> */}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children, active }) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors hover:text-green-600 ${
        active ? 'text-green-600' : 'text-gray-600'
      }`}
    >
      {children}
    </Link>
  );
}
