"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't show header on certain pages if needed
  const hideHeader = pathname === "/login" || pathname=="/admin/*" || pathname === "/signup";
  
  if (hideHeader) return null;

  return (
    <header
      className={`fixed w-full top-0 z-100 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-xl shadow-md"
          : "bg-white/50 backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto  ">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center   cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image
              src="/logo.png"
              alt="HelpAI Logo"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="/#features"
              className="text-slate-700 hover:text-slate-900 transition font-medium"
            >
              Features
            </a>
            <a
              href="/#workflow"
              className="text-slate-700 hover:text-slate-900 transition font-medium"
            >
              Workflow
            </a>
            <a
              href="/#contact"
              className="text-slate-700 hover:text-slate-900 transition font-medium"
            >
              Contact
            </a>

            <Button
              onClick={() => router.push("/login")}
              variant="outline"
              className="shadow-sm hover:shadow-md transition"
            >
              Login
            </Button>
            <Button
              onClick={() => router.push("/chat")}
              className="shadow-md hover:shadow-lg transition"
            >
              Try Chat
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-700 hover:text-slate-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-4">
              <a
                href="/#features"
                className="text-slate-700 hover:text-slate-900 transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="/#workflow"
                className="text-slate-700 hover:text-slate-900 transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Workflow
              </a>
              <a
                href="/#contact"
                className="text-slate-700 hover:text-slate-900 transition font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <Button
                onClick={() => {
                  router.push("/login");
                  setMobileMenuOpen(false);
                }}
                variant="outline"
                className="w-full"
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  router.push("/chat");
                  setMobileMenuOpen(false);
                }}
                className="w-full"
              >
                Try Chat
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}