"use client";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function NavbarComp() {
  const {data: session} = useSession();
  const user: User = session?.user as unknown as User;
  const handleSignOut = ()=>{
    signOut();
  }
  return (
    <nav className="flex w-full items-center justify-between bg-black border-b border-gray-800 px-4 py-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-700" />
        <h1 className="text-base font-bold md:text-2xl text-white">Truely NGL</h1>
      </div>
      {session ? 
      (
      <>
      <span className="mr-4 text-2xl text-white">Welcome {user?.username ||user?.email}</span>
      <Link
        href="/sign-in"
        className="w-28 rounded-lg bg-gray-400 px-6 py-2 font-medium text-black transition-all duration-300 hover:bg-gray-200"
        onClick={()=>handleSignOut()}
      >
        Sign Out
      </Link>
      </>

      ) : 
      (
      <>
      <Link
        href="/sign-in"
        className="w-24 rounded-lg bg-gray-400 px-6 py-2 font-medium text-black transition-all duration-300 hover:bg-gray-200"
      >
        Login
      </Link>
      </>
      )}
      
    </nav>
  );
}
