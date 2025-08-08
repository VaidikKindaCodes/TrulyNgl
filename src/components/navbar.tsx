"use client";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function NavbarComp() {
  const { data: session } = useSession();
  const user: User = session?.user as unknown as User;
  const handleSignOut = () => {
    signOut();
  };
  return (
    <nav className="flex w-full items-center justify-between bg-black border-b border-gray-800 px-4 py-3 shadow-sm flex-wrap">
      <Link href="/"><div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-700" />
      <h1 className="text-base font-bold md:text-2xl text-white whitespace-nowrap">
      Truely NGL
      </h1>
      </div></Link>
      
      <div className="flex items-center gap-2 ml-auto">
      {session ? (
      <>
      <span className="hidden md:inline mr-2 text-sm md:text-lg text-white truncate max-w-[100px] md:max-w-none">
        Welcome {user?.username || user?.email}
      </span>
      <Link
        href="/sign-in"
        className="w-20 md:w-28 rounded-lg bg-gray-400 px-3 md:px-6 py-2 font-medium text-black transition-all duration-300 hover:bg-gray-200 text-sm md:text-base text-center"
        onClick={handleSignOut}
      >
        Sign Out
      </Link>
      </>
      ) : (
      <Link
      href="/sign-in"
      className="w-20 md:w-24 rounded-lg bg-gray-400 px-3 md:px-6 py-2 font-medium text-black transition-all duration-300 hover:bg-gray-200 text-sm md:text-base text-center"
      >
      Login
      </Link>
      )}
      </div>
      <style jsx global>{`
      @media (max-width: 640px) {
      .xs\:inline {
      display: inline !important;
      }
      }
      @media (max-width: 400px) {
      nav {
      flex-direction: row !important;
      gap: 0.5rem;
      align-items: center !important;
      }
      }
      `}</style>
    </nav>
  );
}
