import React from "react";

const Footer = () => {
  return (
      <footer className="bg-black/40 text-gray-400 py-6 text-center">
        © {new Date().getFullYear()} VeriFy | Built with ❤️ to fight misinformation
      </footer>
  );
};

export default Footer;