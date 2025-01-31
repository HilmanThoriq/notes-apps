import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-white text-lg font-bold">Notes App</h1>
        <div>
          <Link to="/" className="text-white px-4">Login</Link>
          <Link to="/register" className="text-white px-4">Register</Link>
          <Link to="/dashboard" className="text-white px-4">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;