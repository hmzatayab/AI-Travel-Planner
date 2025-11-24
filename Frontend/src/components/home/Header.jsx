import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { getUser, removeUser } from "@/utils/storage";

const navLinks = [
  { name: "Home", href: "/", hasDropdown: false },
  { name: "Pricing", href: "/pricing", hasDropdown: false },
  { name: "About", href: "/about", hasDropdown: false },
  { name: "Contact", href: "/contact", hasDropdown: false },
];

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const userData = getUser()?.user || "";

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const LogOut = () => {
    removeUser();
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    toast("Logout successful");
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#150f1e]/10 backdrop-blur-xl border border-[#271e37] rounded-full shadow-sm sticky top-4 mx-[10%] px-4 lg:px-7 py-3">
      <div className="flex items-center justify-between">
        <div className="hidden lg:flex items-center space-x-1 select-none">
          <span className="text-3xl font-extrabold tracking-tight text-slate-300">
            Travel
          </span>
        </div>

        <div className="flex lg:hidden items-center justify-between w-full">
          <div className="flex items-center space-x-3 order-1">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-slate-800 p-2 focus-visible:ring-offset-slate-900"
                >
                  <Menu size={24} />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-64 sm:w-72 md:w-80 p-6 bg-slate-900/90 backdrop-blur-lg border-r border-slate-700 text-white flex flex-col"
              >
                <SheetHeader className="pb-6 border-b border-slate-800">
                  <SheetTitle className="text-2xl font-bold text-white">
                    Menu
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col space-y-4 mt-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
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

          <div className="flex items-center space-x-1 select-none order-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-300">
              Travel
            </span>
          </div>

          <div className="flex items-center space-x-3 order-3">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarFallback>
                      <AvatarFallback>
                        {userData.name.split(/\s+/).length > 1
                          ? userData.name
                              .split(/\s+/)[0]
                              .charAt(0)
                              .toUpperCase() +
                            userData.name
                              .split(/\s+/)[1]
                              .charAt(0)
                              .toUpperCase()
                          : userData.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link to={"/profile"}>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={LogOut} className="cursor-pointer">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

        <div className="hidden lg:flex items-center space-x-6">
          <nav className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href || "#"}
                className="flex items-center text-sm font-medium text-slate-300 hover:text-slate-500 transition"
              >
                {link.name}
                {link.hasDropdown && (
                  <ChevronDown className="h-4 w-4 ml-1 text-neutral-400" />
                )}
              </Link>
            ))}
          </nav>
          <div className="w-0.5 h-5 bg-slate-500"></div>

          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarFallback>
                      {userData.name.split(/\s+/).length > 1
                        ? userData.name
                            .split(/\s+/)[0]
                            .charAt(0)
                            .toUpperCase() +
                          userData.name.split(/\s+/)[1].charAt(0).toUpperCase()
                        : userData.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link to={"/profile"}>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={LogOut} className="cursor-pointer">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
      </div>
    </header>
  );
}
