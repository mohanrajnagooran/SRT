import React from "react";
import { Menu } from "lucide-react";

function Header() {
  return (
    <header className="fixed left-64 right-0 top-0 h-16 bg-white shadow flex items-center px-6">
      <button className="mr-4">
        <Menu size={20} />
      </button>
      <h1 className="font-semibold text-lg">SRT Transport Dashboard</h1>
    </header>
  );
}

export default Header;