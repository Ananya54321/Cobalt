export default function NavBar(){


  

    return (
        <div>
    <header className="fixed top-0 left-0 w-full p-4 bg-black bg-opacity-70 z-50">
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
          <li>
            <a href="/snippet" className="hover:text-orange-500">
              Add Snippet
            </a>
          </li>
          <li>
            <a href="/snippet" className="hover:text-orange-500">
              View Snippet
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-orange-500">
              About us
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-orange-500">
              Logout
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-orange-500">
              Login/Signup
            </a>
          </li>
        </ul>
      </nav>
    </header></div>)
}