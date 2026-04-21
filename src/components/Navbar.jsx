// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { auth, signOut } from "../firebase";
import AuthModal from "./AuthModal";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => setOpen(!open);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setProfileOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getAvatar = () => {
    if (user?.photoURL) return user.photoURL;
    const name = user?.displayName || user?.email || "User";
    return `https://ui-avatars.com/api/?name=${name}&background=3b82f6&color=fff`;
  };

  return (
    <>
      <nav className="bg-gray-900 text-white px-6 py-4 shadow-md sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo / Brand */}
          <div className="text-2xl font-bold tracking-wide">
            VERIFY<span className="text-blue-500">News</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 text-lg items-center">
            <a href="/" className="hover:text-blue-400 transition">Home</a>
            <a href="/submit-news" className="hover:text-blue-400 transition">Submit News</a>
            <a href="/fact-check" className="hover:text-blue-400 transition">Fact Check</a>
            <a href="/about" className="hover:text-blue-400 transition">About</a>
            
            {/* Authentication Section (Desktop) */}
            {user ? (
              <div className="relative">
                <img 
                  src={getAvatar()} 
                  alt="Profile" 
                  onClick={toggleProfile}
                  className="w-10 h-10 rounded-full border-2 border-blue-500 cursor-pointer hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] transition" 
                />
                
                {/* Profile Dialog */}
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white text-gray-900 rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <p className="text-sm font-bold truncate">{user.displayName || "User"}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <a href="/News-Page" className="block px-4 py-2 text-sm hover:bg-gray-100 transition">My Submissions</a>
                      <a href="/settings" className="block px-4 py-2 text-sm hover:bg-gray-100 transition">Settings</a>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition font-semibold">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-md text-sm font-semibold transition">
                Login / Sign Up
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            {user && (
               <img src={getAvatar()} alt="Profile" onClick={toggleProfile} className="w-8 h-8 rounded-full border border-blue-500 cursor-pointer" />
            )}
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
            <a href="/community-voting" className="hover:text-blue-400 transition">Community Voting</a>
            <a href="/about" className="hover:text-blue-400 transition">About</a>
            
            {user ? (
              <div className="border-t border-gray-600 pt-4 mt-2">
                <p className="text-sm text-gray-300 mb-1">Signed in as <span className="text-white font-semibold">{user.email}</span></p>
                <a href="/News-Page" className="block text-blue-400 hover:text-blue-300 transition mb-2">My Submissions</a>
                <a href="/settings" className="block text-blue-400 hover:text-blue-300 transition mb-3">Settings</a>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 w-full py-2 rounded-md font-semibold transition">Logout</button>
              </div>
            ) : (
              <button onClick={() => { setShowAuthModal(true); setOpen(false); }} className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded-md font-semibold transition mt-2">
                Login / Sign Up
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Clean, Modular Component Import */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}

export default Navbar;