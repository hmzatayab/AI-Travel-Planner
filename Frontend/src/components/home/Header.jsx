import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "../ui/avatar";

const navLinks = [
  { name: "Home", href: "/", hasDropdown: false }, // Href added for mobile Link
  { name: "Destinations", href: "/destinations", hasDropdown: true }, // Href added for mobile Link
  { name: "About", href: "/about", hasDropdown: false }, // Href added for mobile Link
  { name: "Contact", href: "/contact", hasDropdown: false }, // Href added for mobile Link
];

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#150f1e]/10 backdrop-blur-xl border border-[#271e37] rounded-full shadow-sm sticky top-4 mx-[10%] px-7 py-3">
      <div className="flex items-center justify-between">
        {/* --- Logo (Desktop) --- */}
        {/* Desktop mein Logo left pe hi rahega */}
        <div className="hidden lg:flex items-center space-x-1 select-none">
          <span className="text-3xl font-extrabold tracking-tight text-slate-300">
            Travel
          </span>
        </div>

        {/* --- Mobile View Container: Left (Menu), Center (Logo), Right (Buttons) --- */}
        <div className="flex lg:hidden items-center justify-between w-full">
          {/* Mobile Left: Menu Hamburger */}
          <div className="flex items-center space-x-3 order-1">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                {/* Menu Icon: Dark mode style */}
                <Button
                  variant="ghost"
                  className="text-white hover:bg-slate-800 p-2 focus-visible:ring-offset-slate-900"
                >
                  <Menu size={24} />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left" // Mobile Menu ko right se left kar diya, takay right side mein profile icon clear rahe.
                className="w-64 sm:w-72 md:w-80 p-6 bg-slate-900/90 backdrop-blur-lg border-r border-slate-700 text-white flex flex-col"
              >
                {/* Header Section */}
                <SheetHeader className="pb-6 border-b border-slate-800">
                  <SheetTitle className="text-2xl font-bold text-white">
                    Menu
                  </SheetTitle>
                </SheetHeader>

                {/* Navigation Links */}
                <nav className="flex flex-col space-y-4 mt-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      // ** NOTE: Aapke navLinks array mein href nahi tha, mobile menu ke liye Link use karne ke liye href chahiye **
                      // Maine Upar navLinks array mein dummy hrefs add kiye hain.
                      to={link.href || "#"} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-slate-200 font-medium text-lg hover:text-blue-400 transition-colors duration-200 py-1"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Center: Logo */}
          <div className="flex items-center space-x-1 select-none order-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-300">
              Travel
            </span>
          </div>

          {/* Mobile Right: Profile Icon / Login Button */}
          <div className="flex items-center space-x-3 order-3">
            {isLoggedIn ? (
              <Link to="/profile">
                <Avatar className="cursor-pointer">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Button
                variant="ghost"
                className="text-slate-100 bg-slate-800 hover:bg-slate-900 hover:text-white cursor-pointer px-4 py-2"
              >
                <Link to="/login">Log in</Link>
              </Button>
            )}
          </div>
        </div>
        {/* --- End Mobile View Container --- */}


        {/* Desktop Menu + Buttons (Yeh pehle ki tarah hi rahega) */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Navigation links */}
          <nav className="flex items-center space-x-6">
            {navLinks.map((link) => (
              // Desktop mein abhi bhi 'a' tag use ho raha hai, agar Link use karna hai toh change kar dein
              <a
                key={link.name}
                href="#"
                className="flex items-center text-sm font-medium text-slate-300 hover:text-slate-500 transition"
              >
                {link.name}
                {link.hasDropdown && (
                  <ChevronDown className="h-4 w-4 ml-1 text-neutral-400" />
                )}
              </a>
            ))}
          </nav>
          <div className="w-0.5 h-5 bg-slate-500"></div>

          {/* Buttons */}
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <Link to="/profile">
                <Avatar className="cursor-pointer">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Button
                variant="ghost"
                className="text-slate-100 bg-slate-800 hover:bg-slate-900 hover:text-white cursor-pointer px-4 py-2"
              >
                <Link to="/login">Log in</Link>
              </Button>
            )}
          </div>
        </div>
        {/* *** Aapka purana Mobile Hamburger section yahan se remove kar diya gaya hai *** */}
        
      </div>
    </header>
  );
}