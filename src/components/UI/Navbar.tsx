"use client";

import { useState } from "react";
import Link from "next/link";
import { LuMenu, LuX, LuSend, LuLayers } from "react-icons/lu";
import { useTheme } from "@/context/ThemeContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { themeConfig: T } = useTheme();

  const navLinks = [
    { name: "Usługi", href: "#services" },
    { name: "Realizacje", href: "#projects" },
    { name: "Proces", href: "#process" },
    { name: "O mnie", href: "#about" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b border-white/5 backdrop-blur-md transition-colors duration-300 ${T.page}/80`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg bg-opacity-10 transition-colors ${T.accentText} bg-current`}
            >
              <LuLayers size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              pm<span className={T.accentText.split(" ")[0]}>dev</span>
            </span>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors opacity-70 ${T.link}`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="#contact"
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white transition-all active:scale-95 ${T.accentGrad}`}
              >
                <LuSend size={14} /> Kontakt
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 opacity-70 hover:opacity-100 focus:outline-none">
              {isOpen ? <LuX size={24} /> : <LuMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden border-t border-white/5 p-4 space-y-4 ${T.page}`}>
          {navLinks.map(link => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block text-lg font-medium ${T.link}`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={() => setIsOpen(false)}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-white font-bold ${T.accentGrad}`}
          >
            <LuSend /> Kontakt
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
