"use client";
import GetUser from "@/helpers/GetUser";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/logout/LogoutButton"
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavBar(){

  const [user,setUser] = useState(null);
  useEffect(()=>{
    GetUserDetails();
  },[])


  async function GetUserDetails(){
    await GetUser().then(res=>{
      setUser(res)
    }) 

  }

    return (
        <div className="mb-16">
    <header className="fixed top-0 left-0 w-full p-4  z-50">
      <nav className="container mx-auto flex items-center justify-between">
        <a href="#" className="text-white text-2xl font-semibold">
          Cobalt<span className="text-orange-500">.</span>
        </a>
        <button id="hamburger-btn" className="text-white md:hidden">
          menu
        </button>
        <ul className="hidden md:flex items-center space-x-8 text-white">
          <li>
            <a href="/" className={`${ usePathname() == '/' ? 'text-blue-500' :' '} hover:text-blue-500`}>
              Home
            </a>
          </li>
          <li>
            <Link href="/guide" className={`${ usePathname() == '/guide' ? "text-blue-500" :" "} hover:text-blue-500`}>
              Guide
            </Link>
          </li>
          <li>
            <a href="/about" className={`${ usePathname() == '/about' && 'text-blue-500'} hover:text-blue-500`}>
              About Us
            </a>
          </li>
          {user==null ? <> 
            <li>
            <a href="/signup" className={`${ usePathname() == '/signup' && 'text-blue-500'} hover:text-blue-500`}>
            Signup
            </a>
          </li>
          <li>

            <a href="/login" className={`${ usePathname() == '/login' && 'text-blue-500'} hover:text-blue-500`}>
              Login
            </a>
          </li>
          </>:  <> 
          <li>
            <a href="/mysnippets" className={`${ usePathname() == '/mysnippets' && 'text-blue-500'} hover:text-blue-500`}>
              Snippets
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-500">
              {user.username}
            </a>
          </li>
          <li>
              <LogoutButton/>
          </li>
          </>}
          
        </ul>
      </nav>
    </header></div>)
}