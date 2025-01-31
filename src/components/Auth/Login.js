import React, { useState , useEffect} from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import loginImage from '../../images/login.png'; 
import gdgLogo from '../../images/gdg_logo.jpg';
import Swal from 'sweetalert2';   
import '../Poppins.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Notes Apps | Login"; 
    const link = document.querySelector("link[rel~='icon']"); 
    if (link) {
      link.href = gdgLogo;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: 'Silakan periksa kredensial Anda.',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); 
  };

  return (
    <div className="font-poppins max-sm:px-4">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="grid pt-6 md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full px-4 mx-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
          <div className="md:max-w-md w-full px-4 py-4 md:ml-12">
            <h1 className="text-gray-800 text-4xl font-extrabold mb-8 text-center">Notes Apps</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <h3 className="text-gray-800 text-3xl font-bold">Login</h3>
                <p className="text-sm mt-4 text-gray-800">
                  Don't have an account? 
                  <a href="/register" className="text-[#D268CC] hover:underline font-semibold  ml-1 whitespace-nowrap">Register here</a>
                </p>
              </div>

              <div>
                <label className="text-gray-800 text-s block mb-2 font-extrabold">Email</label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div className="mt-8">
                <label className="text-gray-800 text-s block mb-2 font-extrabold">Password</label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'} // Mengubah tipe input berdasarkan state
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                    placeholder="Enter password"
                  />
                  {showPassword ? (
                    <svg
                      onClick={togglePasswordVisibility} // Menambahkan fungsi toggle saat ikon diklik
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[18px] h-[18px] absolute right-2 cursor-pointer"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      onClick={togglePasswordVisibility} // Menambahkan fungsi toggle saat ikon diklik
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[18px] h-[18px] absolute right-2 cursor-pointer"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </div>
              </div>

              <div className="mt-12">
                <button type="submit" className="w-full shadow-xl py-2.5 px-4 mb-6 text-m font-extrabold tracking-wide rounded-md text-white focus:outline-none bg-[#E7A5E2] hover:bg-[#D268CC]">
                  Login
                </button>
              </div>
            </form>
          </div>

          <div className="hidden md:block w-full h-full flex items-center rounded-xl">
            <img src={loginImage} className="w-full aspect-[10/12] object-contain" alt="login-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
