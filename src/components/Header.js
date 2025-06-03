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
    <header className="bg-white shadow-sm z-10 sticky top-0">
      <div className="flex items-center justify-end p-4">

        <div className="flex items-center space-x-4">

          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                A
              </div>
              <span className="text-gray-700 hidden md:inline">
                {/* {user.role} */}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                <Link
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profil
                </Link>
                <Link
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Pengaturan
                </Link>
                <div className="border-t my-1"></div>

                <Link
                  href="#"
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />

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
