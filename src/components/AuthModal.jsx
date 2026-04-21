// src/components/AuthModal.jsx
import { useState } from "react";
import { X } from "lucide-react";
import { auth, provider, signInWithPopup } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

function AuthModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Don't render anything if the modal is closed
  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    try {
      setAuthError("");
      await signInWithPopup(auth, provider);
      onClose(); // Close modal on success
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose(); // Close modal on success
      setEmail("");
      setPassword("");
    } catch (error) {
      setAuthError("Failed: " + error.message.replace("Firebase: ", ""));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white text-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>
        
        {authError && <div className="bg-red-100 text-red-600 text-sm p-3 rounded-md mb-4 text-center">{authError}</div>}

        <form onSubmit={handleEmailAuth} className="flex flex-col space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="px-4 text-gray-400 text-sm font-semibold">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button onClick={handleGoogleAuth} className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition flex items-center justify-center gap-3">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5"/>
          Continue with Google
        </button>

        <p className="text-sm text-center mt-6 text-gray-600">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button onClick={() => { setIsSignUp(!isSignUp); setAuthError(""); }} className="text-blue-600 font-bold ml-2 hover:underline">
            {isSignUp ? "Log in here" : "Sign up here"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;