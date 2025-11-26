import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import api from "@/api/axios";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // LOGIN API
        const res = await api.post("account/auth/login", {
          email,
          password,
        });

        localStorage.setItem("token", res.data.token);
        window.location.href = "/project";
      } else {
        // SIGNUP API
        const res = await api.post("account/auth/signup", {
          fullName,
          email,
          password,
        });

        alert("Account created. You can login now!");
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      alert(err || "Something went wrong");
    }
  };

  return (
    <div className="flex h-screen flex-col md:flex-row bg-black">
      {/* Left Section - Form */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Logo/Branding */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">B</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                BackStack
              </span>
            </div>
            <p className="text-zinc-400 text-sm">
              Backend infrastructure made simple
            </p>
          </div>

          {/* Form Container */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                {isLogin ? "Welcome Back" : "Get Started"}
              </h1>
              <p className="text-zinc-400 text-base">
                {isLogin
                  ? "Sign in to access your dashboard"
                  : "Create your developer account in seconds"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all duration-200"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 bg-zinc-900 border border-zinc-800 rounded cursor-pointer accent-white"
                    />
                    <span className="text-sm text-zinc-400">Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="text-sm text-white hover:text-zinc-300 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-white text-black rounded-lg font-semibold tracking-wide hover:bg-zinc-100 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
              >
                {isLogin ? "Sign In" : "Create Account"}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </form>

            {/* Toggle */}
            <div className="text-center">
              <p className="text-zinc-400 text-sm">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-white font-semibold hover:text-zinc-300 transition-colors"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 text-center">
                © {new Date().getFullYear()} BackStack. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Premium Testimonial */}
      <div className="flex-1 hidden md:flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-black p-12 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="max-w-md text-center space-y-8 relative z-10">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
              Trusted by Developers
            </h2>
            <p className="text-lg text-zinc-300 leading-relaxed italic">
              "BackStack transformed our backend workflow. We built a secure,
              multi-tenant SaaS system in days instead of weeks. The
              plug-and-play APIs saved us countless development hours."
            </p>
          </div>

          {/* User Card */}
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-xl p-6 space-y-4">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Rahul Mehta"
              className="w-16 h-16 rounded-full border-2 border-white mx-auto"
            />
            <div>
              <p className="font-semibold text-white text-lg">Rahul Mehta</p>
              <p className="text-sm text-zinc-400">CTO, DevPro Labs</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">10K+</p>
              <p className="text-xs text-zinc-400">Developers</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">99.9%</p>
              <p className="text-xs text-zinc-400">Uptime</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">50ms</p>
              <p className="text-xs text-zinc-400">Latency</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
