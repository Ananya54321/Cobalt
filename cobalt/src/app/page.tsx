"use client";
import "@/cssFiles/homeanimations.css";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import NavBar from "@/components/NavBar"

export default function Home() {
  useEffect(() => {
    // Your useEffect logic here for any JavaScript animations or functionality
  }, []);

  return (

    <div className="bg-gradient-to-b from-gray-900 to-gray-700 text-white font-sans">
      <NavBar/>
      {/* Hero Section */}
      <section
        className="hero-section relative flex items-center justify-center h-screen bg-cover bg-center border-b-8 border-gray-900 mb-8"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
          backgroundColor: "#f2f4f8",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-25"></div>
        <div className="text-white text-center mx-auto px-6">
          <h2 className="text-6xl font-bold animate-pulse">Welcome to Cobalt</h2>
          <p className="mt-4 text-lg font-light text-white animate-bounce">
            A one-Stop Place For Coding Enthusiasts
          </p>
          <button className="mt-8 px-6 py-3 bg-white text-gray-800 font-semibold rounded-md transition duration-300 transform hover:scale-105 hover:bg-orange-500 hover:text-white">
            Get Started
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="md:w-1/2 mb-8 pl-8 md:mb-0">
            <h1 className="text-3xl font-semibold mb-4">About</h1>
            <p className="text-lg mb-6">
              Our Neighborhood Security Hub is dedicated to fostering a safer
              environment for all residents. Through our platform, you can
              quickly report any suspicious activities or security incidents in
              your neighborhood, receive safety alerts, and participate in
              community discussions to address security concerns
              collaboratively.
            </p>
            <a
              href="#"
              className="inline-block bg-transparent border border-orange-500 text-orange-500 font-semibold px-8 py-4 rounded-full shadow-md hover:bg-orange-500 hover:text-white transition duration-300 transform hover:scale-105"
            >
              Learn More
            </a>
          </div>
          <div className="md:w-1/2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Categories Section */}
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="category bg-gray-800 p-8 rounded-3xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="category_icon bg-primary p-4 rounded-full">
                    <i className="uil uil-bitcoin-circle"></i>
                  </span>
                  <h5 className="text-xl font-semibold mb-4">Category</h5>
                  <p className="text-lg">Description of category {index + 1}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Repositories */}
      <section className="container mx-auto py-8">
        <h2 className="text-3xl font-semibold mb-4">Trending Repositories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add trending repositories here */}
          <div className="repository bg-white p-6 rounded-xl shadow-md transition duration-300 transform hover:scale-105">
            <h3 className="text-lg font-semibold mb-2">Repository Name</h3>
            <p className="text-gray-700">Description of the repository.</p>
            <div className="flex items-center mt-4">
              <span className="bg-blue-500 text-white py-1 px-2 rounded">
                JavaScript
              </span>
              <span className="ml-2 bg-yellow-500 text-white py-1 px-2 rounded">
                React
              </span>
            </div>
          </div>
          {/* Add more repositories here */}
        </div>
      </section>

      {/* User Activity Feeds */}
      <section className="container mx-auto py-8">
        <h2 className="text-3xl font-semibold mb-4">User Activity Feeds</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add user activity feeds here */}
          <div className="activity bg-white p-6 rounded-xl shadow-md transition duration-300 transform hover:scale-105">
            <p className="text-gray-700">
              User John Doe pushed changes to repository "Project X".
            </p>
          </div>
          {/* Add more activity feeds here */}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="container mx-auto py-8">
        <h2 className="text-3xl font-semibold mb-4">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add featured projects here */}
          <div className="project bg-white p-6 rounded-xl shadow-md transition duration-300 transform hover:scale-105">
            <h3 className="text-lg font-semibold mb-2">Project Name</h3>
            <p className="text-gray-700">Description of the project.</p>
            <div className="flex items-center mt-4">
              <span className="bg-blue-500 text-white py-1 px-2 rounded">
                Node.js
              </span>
              <span className="ml-2 bg-yellow-500 text-white py-1 px-2 rounded">
                MongoDB
              </span>
            </div>
          </div>
          {/* Add more featured projects here */}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Cobalt. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

