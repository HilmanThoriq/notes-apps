import React, {  useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import gdgLogo from '../../images/gdg_logo.jpg';

const Collaboration = () => {
  
  useEffect(() => {
    document.title = "Notes Apps | Collaboration"; 
    const link = document.querySelector("link[rel~='icon']"); 
    if (link) {
      link.href = gdgLogo;
    }
  }, []);
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Kolaborasi</h2>
      <p>Fitur kolaborasi akan ditambahkan di sini.</p>
    </div>
  );
};

export default Collaboration;