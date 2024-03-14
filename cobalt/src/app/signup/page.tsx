"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import "@/cssFiles/homeanimations.css";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input"


export default function SignupPage() {
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      await axios.post("api/users/login", user).then((response) => {
        if (response.data.success == false) {
          toast.error(response.data.message, { icon: "👏" });
        } else {
          toast.success("Login Successful");
          location.reload();
          router.push("/");
        }
      });
    } catch (error: any) {
      console.log("login failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSignup = async () => {
    if (user.email == "" || user.password == "" || user.username == "") {
      toast.error("please fill all the fields");
      return;
    }
    try {
      const t = toast.loading("please wait...");
      setLoading(true);
      axios.post("api/users/signup", user).then(() => {
        toast.dismiss(t);
        toast.success("user successfully created");
        onLogin();
      });
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.username.length > 0 &&
      user.password.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <>
      <h1 className="text-3xl mt-5 font-semibold">
        {loading ? "processing" : "Create new Account"}
      </h1>
      <form className="mt-6 text-left">
        <div className="mb-2">
          <label className="block text-sm font-semibold ">
            UserName
          </label>
          <Input
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            type="text"
            className="w-40"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-semibold ">
            Email
          </label>
          <Input
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            type="email"
            className="w-40"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-semibold ">
            Password
          </label>
          <Input
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            type="password"
            className="w-40"
          />
        </div>
        <p className="">
          <Link
            href="/forgotpassword"
            className=" font-semibold hover:underline mr-4"
          >
            Forgot password?
          </Link>
          <label htmlFor="remember" className=" font-semibold">
            <input type="checkbox" id="remember" className="mr-1" />
            Remember me
          </label>
        </p>
        <div className="mt-6">
          <Button
            variant="codeeditor"
            onClick={(e) => {
              e.preventDefault();
              onSignup();
            }}
          >
            {buttonDisabled ? "Fill the details" : "signup"}
          </Button>
        </div>
      </form>
      <p>
        {" "}
        Already have an account?{" "}
        <Link
          href="/login"
          className='" font-semibold hover:underline'
        >
          Login!
        </Link>
      </p>

    </>
  );
}
