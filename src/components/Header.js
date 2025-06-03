"use client";
import {  ChevronDown, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Header({
  user,
  showUserDropdown,
  setShowUserDropdown,
}) {
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <header className="bg-yellow-50 shadow-sm border-b-2 border-yellow-500 z-10 sticky top-0">
      <div className="flex items-center justify-end p-4">

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-3 focus:outline-none"
            >
              <div className="w-9 h-9 rounded-full bg-yellow-700 flex items-center justify-center text-white font-semibold shadow-md">
                A
              </div>
              <span className="text-brown-700 hidden md:inline text-sm font-medium">
                {/* {user.role} */}
              </span>
              <ChevronDown className="w-4 h-4 text-yellow-700" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg py-2 z-20 border border-yellow-200">
                <Link
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-amber-200 transition-all"
                >
                  Profil
                </Link>
                <Link
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-amber-200 transition-all"
                >
                  Pengaturan
                </Link>
                <div className="border-t my-1 border-yellow-400"></div>

                <Link
                  href="#"
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-100 transition-all"
                >
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full font-semibold"
                  >
                    <LogOut className="w-4 h-4 mr-2 text-red-500" />
                    <span>Keluar</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
