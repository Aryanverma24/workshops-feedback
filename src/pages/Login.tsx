import  { useState, useRef } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import type { FormEvent } from 'react';

interface LoginProps {
  onLoginSuccess?: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      
      const userId = await signInWithEmailAndPassword(auth, email, password);
      const user = await getDoc(doc(db, "Users", userId.user.uid));

      if (!user.exists()) {
        throw new Error('User does not exist');
      }

      if (user.data().role !== 'admin') {
        navigate("/studentHomePage");
      } else {
        navigate('/admin/dashboard');
      }

      onLoginSuccess?.();
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center overflow-hidden" 
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat'
          }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/50"></div>
      <div className="relative flex items-center justify-center min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-800/10 ring-2 ring-blue-500/20"
      >
        <form onSubmit={handleLogin} className="space-y-6" onKeyDown={(e) => {
          if (e.key === 'Enter' && !isLoading) {
            handleLogin(e);
          }
        }}>
        <div className="text-center mb-8">
          <motion.div 
            className="flex items-center justify-center mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <FaGraduationCap className="text-4xl text-blue-500" />
          </motion.div>
          <motion.h2 
            className="text-3xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Welcome Back
          </motion.h2>
          <motion.p 
            className="text-gray-500 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Sign in to continue to your workspace
          </motion.p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="email"
              className="w-full px-12 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 outline-none text-gray-700 placeholder-gray-400 transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              ref={emailRef}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby="email-error"
            />
            {error && (
              <p id="email-error" className="mt-1 text-sm text-red-500">
                {error}
              </p>
            )}
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordRef}
                className="w-full px-12 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 outline-none text-gray-700 placeholder-gray-400 transition-all duration-200"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <FaEye className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            </div>

          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-blue-400 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="text-center text-sm text-gray-500 mt-8">
              <p className="flex items-center justify-center gap-2">
                <span>Don't have an account?</span>
                <a href="/register" className="text-blue-500 hover:text-blue-600 transition-colors font-medium">
                  Create Account
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </form>
    </motion.div>
  </div>
</div>
  )
}
