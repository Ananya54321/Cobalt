'use client'
import GetUser from "@/helpers/GetUser"
import { useEffect, useState } from "react";
import LogoutButton from "@/components/logout/LogoutButton"

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
    <header className="fixed top-0 left-0 w-full p-4 bg-black z-50">
      <nav className="container mx-auto flex items-center justify-between">
        <a href="#" className="text-white text-2xl font-semibold">
          Cobalt<span className="text-orange-500">.</span>
        </a>
        <button id="hamburger-btn" className="text-white md:hidden">
          menu
        </button>
        <ul className="hidden md:flex items-center space-x-8 text-white">
          <li>
            <a href="#" className="hover:text-orange-500">
              Home
            </a>
          </li>
          <li>
            <a href="/guide" className="hover:text-orange-500">
              Guide
            </a>
          </li>
          {/* <li>
            <a href="/snippet" className="hover:text-orange-500">
              Add Snippet
            </a>
          </li> */}
         
          <li>
            <a href="#" className="hover:text-orange-500">
              About Us
            </a>
          </li>
          {user==null ? <> 
            <li>
            <a href="/signup" className="hover:text-orange-500">
            Signup
            </a>
          </li>
          <li>

            <a href="/login" className="hover:text-orange-500">
              Login
            </a>
          </li>
          </>:  <> 
          <li>
            <a href="/mysnippets" className="hover:text-orange-500">
              Snippets
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-orange-500">
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