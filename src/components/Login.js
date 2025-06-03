"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { signIn } from "next-auth/react"

/**
 * RegisterForm component handles user registration.
 * It manages form inputs for name, email, and password,
 * shows error and success messages, and handles loading state.
 *
 * On successful registration, it redirects the user to the homepage.
 *
 * @component
 * @author wignn
 * @returns {JSX.Element} Registration form UI
 */

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
        callbackUrl: "/",
      });

      if (res?.error) {
        setError(res.error);
        setSuccess("");
      } else {
        setSuccess("Login berhasil!");
        setError("");
        window.location.href = "/";
      }
    } catch (error) {
      console.log("Error:", error);
      setError("Terjadi kesalahan, silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-6 py-8">
      <div className="max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl font-bold text-gray-800">Mayra</span>
            <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-4xl font-bold text-gray-800">D'Light</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

 
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg text-sm"
              >
                {success}
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-3">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Input your email"
                className="w-full px-5 py-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                required
              />
            </div>


            <div>
              <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-3">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Input your password"
                className="w-full px-5 py-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                By tapping "Login" you agree to our{" "}
                <Link href="/terms" className="text-gray-700 underline">
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-gray-700 underline">
                  Privacy Policy
                </Link>
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
                className="w-full bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white py-4 rounded-lg font-medium transition-colors duration-200"
           >
              {isLoading ? "Processing..." : "Login"}
            </motion.button>


            <div className="text-center mt-2 mb-10">
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
