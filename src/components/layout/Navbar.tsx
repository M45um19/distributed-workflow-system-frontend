"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Activity, Menu, X, ArrowRight, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "How It Works", href: "/integrations" },
    { name: "About", href: "/about" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "border-b border-card-border bg-bg-dark/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 group-hover:border-primary transition-all duration-300">
              <Activity className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold tracking-wider text-white group-hover:text-primary transition-colors duration-300">
              FLOW<span className="text-primary">SYNC</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold tracking-wide transition-all duration-300 px-4 py-2 rounded-lg border ${isActive
                      ? "text-primary bg-primary/10 border-primary/20 shadow-[0_0_15px_rgba(255,1,79,0.15)]"
                      : "text-zinc-400 border-transparent hover:text-white hover:bg-white/5"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className={`text-sm font-semibold tracking-wide transition-all duration-300 px-4 py-2 rounded-lg border ${pathname === "/dashboard"
                    ? "text-primary bg-primary/10 border-primary/20 shadow-[0_0_15px_rgba(255,1,79,0.15)]"
                    : "text-zinc-400 border-transparent hover:text-white hover:bg-white/5"
                  }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 group-hover:border-primary transition-colors duration-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                      alt={user?.full_name || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors duration-300">
                    {user?.full_name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-red-400 text-sm font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isLoggingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors duration-300 px-4 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="relative group flex items-center gap-1 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,1,79,0.4)]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-20 bg-bg-dark/95 border-b border-card-border backdrop-blur-lg transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-3 sm:px-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-base font-medium transition-colors ${isActive
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : "text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
          {isAuthenticated && (
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2.5 rounded-md text-base font-medium transition-colors ${pathname === "/dashboard"
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
                }`}
            >
              Dashboard
            </Link>
          )}
          <div className="pt-4 border-t border-zinc-800/80 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                      alt={user?.full_name || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-semibold text-zinc-300">
                    {user?.full_name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full text-center bg-zinc-900 text-zinc-400 hover:text-red-400 border border-zinc-800 text-sm font-semibold py-3 rounded-lg hover:bg-red-500/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoggingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center text-sm font-semibold text-zinc-400 hover:text-white transition-colors duration-300 py-2.5"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-primary text-white text-sm font-semibold py-3 rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
