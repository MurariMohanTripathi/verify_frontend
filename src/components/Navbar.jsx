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
      <nav className="sticky top-0 z-40 border-b px-6 py-4 shadow-md backdrop-blur-md" style={{ background: "var(--app-surface)", borderColor: "var(--app-border)", color: "var(--app-text)" }}>
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo / Brand */}
          <div className="text-2xl font-bold tracking-wide">
            VERIFY<span style={{ color: "var(--app-accent)" }}>News</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 text-lg items-center">
            <a href="/" className="transition hover:opacity-80">Home</a>
            <a href="/submit-news" className="transition hover:opacity-80">Submit News</a>
            <a href="/community-voting" className="transition hover:opacity-80">Community Voting</a>
            <a href="/fact-check" className="transition hover:opacity-80">Fact Check</a>
            <a href="/about" className="transition hover:opacity-80">About</a>
            
            {/* Authentication Section (Desktop) */}
            {user ? (
              <div className="relative">
                <img 
                  src={getAvatar()} 
                  alt="Profile" 
                  onClick={toggleProfile}
                  className="w-10 h-10 rounded-full border-2 cursor-pointer transition" 
                  style={{ borderColor: "var(--app-accent)" }}
                />
                
                {/* Profile Dialog */}
                {profileOpen && (
                  <div className="app-card absolute right-0 mt-3 w-56 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b" style={{ borderColor: "var(--app-border)" }}>
                      <p className="text-sm font-bold truncate">{user.displayName || "User"}</p>
                      <p className="app-muted text-xs truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <a href="/my-submissions" className="block px-4 py-2 text-sm transition hover:opacity-80">My Submissions</a>
                      <a href="/settings" className="block px-4 py-2 text-sm transition hover:opacity-80">Settings</a>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-500 transition font-semibold hover:opacity-80">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="app-button px-4 py-1.5 text-sm">
                Login / Sign Up
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            {user && (
               <img src={getAvatar()} alt="Profile" onClick={toggleProfile} className="w-8 h-8 rounded-full border cursor-pointer" style={{ borderColor: "var(--app-accent)" }} />
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
          <div className="app-card md:hidden flex flex-col space-y-4 mt-4 p-4">
            <a href="/" className="transition hover:opacity-80">Home</a>
            <a href="/submit-news" className="transition hover:opacity-80">Submit News</a>
            <a href="/fact-check" className="transition hover:opacity-80">Fact Check</a>
            <a href="/community-voting" className="transition hover:opacity-80">Community Voting</a>
            <a href="/about" className="transition hover:opacity-80">About</a>
            
            {user ? (
              <div className="border-t pt-4 mt-2" style={{ borderColor: "var(--app-border)" }}>
                <p className="app-muted text-sm mb-1">Signed in as <span className="font-semibold" style={{ color: "var(--app-text)" }}>{user.email}</span></p>
                <a href="/my-submissions" className="block transition hover:opacity-80 mb-2" style={{ color: "var(--app-accent)" }}>My Submissions</a>
                <a href="/settings" className="block transition hover:opacity-80 mb-3" style={{ color: "var(--app-accent)" }}>Settings</a>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 w-full py-2 rounded-md font-semibold transition">Logout</button>
              </div>
            ) : (
              <button onClick={() => { setShowAuthModal(true); setOpen(false); }} className="app-button w-full py-2 mt-2">
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
