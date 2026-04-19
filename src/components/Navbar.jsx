import { useState } from "react";
import { Menu, X } from "lucide-react"; // install lucide-react for icons: npm install lucide-react

function Navbar() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(!open);
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Brand */}
        <div className="text-2xl font-bold tracking-wide">
          VERIFY<span className="text-blue-500">News</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-lg">
          <a href="/" className="hover:text-blue-400 transition">Home</a>
          <a href="/submit-news" className="hover:text-blue-400 transition">Submit News</a>
          <a href="/fact-check" className="hover:text-blue-400 transition">Fact Check</a>
          <a href="/about" className="hover:text-blue-400 transition">About</a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          {open ? (
            <X className="w-7 h-7 cursor-pointer" onClick={toggleMenu} />
          ) : (
            <Menu className="w-7 h-7 cursor-pointer" onClick={toggleMenu} />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col space-y-4 mt-4 bg-gray-800 p-4 rounded-lg shadow-lg">
          <a href="/" className="hover:text-blue-400 transition">Home</a>
          <a href="/submit-news" className="hover:text-blue-400 transition">Submit News</a>
          <a href="/fact-check" className="hover:text-blue-400 transition">Fact Check</a>
          <a href="/community-voting" className="hover:text-blue-400 transition">Community voting</a>
          <a href="/about" className="hover:text-blue-400 transition">About</a>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
