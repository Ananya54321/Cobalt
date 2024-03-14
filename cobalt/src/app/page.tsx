"use client";
import "@/cssFiles/homeanimations.css";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";





export default function Home() {


  const onLogout = ()=>{
    try {
      axios.get('/api/users/logout').then(()=>{
        toast.success('logout successfully')
      })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
     <div className=" w-full border " >
      <button onClick={e=>{onLogout()}} type="submit" className="border" >logout</button>
    </div>
    </>
  );
}
