"use client";
import "@/cssFiles/homeanimations.css";
import axios from "axios";
import { useRef,useEffect } from "react";
import toast from "react-hot-toast";
import NavBar from "@/components/NavBar";

export default function Home() {
  useEffect(() => {
    // Your useEffect logic here for any JavaScript animations or functionality
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-700 text-white font-sans spacebg ">
      <NavBar />
      {/* Hero Section */}
      {
        <div className="fade-in">
           <section
          className="hero-section relative flex items-center justify-center h-screen bg-cover bg-center border-b-8 border-gray-900 mb-8"
          
        >
          <div className="absolute inset-0 bg-black opacity-25"></div>
          <div className="text-white text-center mx-auto px-6 ">
            <h2 className="text-6xl font-bold text-white typed-out">
              Welcome to Cobalt
            </h2>
            <p className="mt-4 text-lg font-bold text-white">
              A one-Stop Place For Coding Enthusiasts
            </p>
            <button className="mt-8 px-6 py-3 bg-white text-gray-800 font-semibold rounded-md transition fade-in duration-300 transform hover:scale-105 hover:bg-orange-500 hover:text-white">
              Get Started
            </button>
          </div>
        </section>
        </div>
       
      }

      {/* About Section */}
      {/* About Section */}
      <section className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="md:w-1/2 mb-8 pl-8 md:mb-0 mt-0">
            <h1 className="text-3xl font-semibold mb-4">About</h1>
            <p className="text-lg mb-6">
              Developers struggle with inefficient code navigation and
              management, hampering productivity. Our AI-powered web application
              revolutionizes this process by providing insightful code analyses,
              automatic explanations, and a secure Code Vault with intelligent
              search. By integrating AI and Machine Learning, we aim to empower
              developers and enhance productivity.
            </p>
            <a
              href="https://github.com/RishiKumarGade/Cobalt"
              target="_blank"
              className="inline-block bg-transparent border border-orange-500 text-orange-500 font-semibold px-8 py-4 rounded-full shadow-md hover:bg-orange-500 hover:text-white transition duration-300 transform hover:scale-105"
            >
              Learn More
            </a>
          </div>
          {/* Categories Section */}
          <div className="md:w-1/2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* AI-driven insights */}
              <div className="category bg-gray-800  p-8 rounded-3xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
                <h5 className="text-xl font-semibold mb-4 ">
                  AI-driven insights
                </h5>
                <span className="category_icon bg-primary p-4 rounded-full">
                  <i className="uil uil-bitcoin-circle"></i>
                </span>
                <p className="text-lg mt-4">
                  Effortlessly gain insights with AI technology.
                </p>
              </div>
              {/* efficient codebase utilization */}
              <div className="category bg-gray-800 p-8 rounded-3xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
                <h5 className="text-xl font-semibold mb-4">
                  Efficient codebase utilization
                </h5>
                <span className="category_icon bg-primary p-4 rounded-full">
                  <i className="uil uil-bitcoin-circle"></i>
                </span>
                <p className="text-lg mt-4">
                  Maximize the potential of your codebase with efficiency.
                </p>
              </div>
              {/* secure Code Vault */}
              <div className="category bg-gray-800 p-8 rounded-3xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
                <h5 className="text-xl font-semibold mb-4">
                  Secure Code Vault
                </h5>
                <span className="category_icon bg-primary p-4 rounded-full">
                  <i className="uil uil-bitcoin-circle"></i>
                </span>
                <p className="text-lg mt-4">
                  Protect your code with the highest level of security.
                </p>
              </div>
              {/* Intelligent Search Functionality */}
              <div className="category bg-gray-800 p-8 rounded-3xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
                <h5 className="text-xl font-semibold mb-4">
                  Intelligent Search Functionality
                </h5>
                <span className="category_icon bg-primary p-4 rounded-full">
                  <i className="uil uil-bitcoin-circle"></i>
                </span>
                <p className="text-lg mt-4">
                  Find what you need quickly and effortlessly with intelligent
                  search.
                </p>
              </div>
              {/* Comprehensive AI and Machine Learning Integration */}
              <div className="category bg-gray-800 p-8 rounded-3xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
                <h5 className="text-xl font-semibold mb-4">
                  Comprehensive AI and Machine Learning Integration
                </h5>
                <span className="category_icon bg-primary p-4 rounded-full">
                  <i className="uil uil-bitcoin-circle"></i>
                </span>
                <p className="text-lg mt-4">
                  Seamlessly integrate AI and ML into your workflow for enhanced
                  capabilities.
                </p>
              </div>
              {/* Boosted Developer Productivity */}
              <div className="category bg-gray-800 p-8 rounded-3xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
                <h5 className="text-xl font-semibold mb-4">
                  Boosted Developer Productivity
                </h5>
                <span className="category_icon bg-primary p-4 rounded-full">
                  <i className="uil uil-bitcoin-circle"></i>
                </span>
                <p className="text-lg mt-4">
                  Increase productivity with advanced tools and features.
                </p>
              </div>
            </div>
          </div>
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
