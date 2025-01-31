import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import loginImage from '../../images/register.png';
import gdgLogo from '../../images/gdg_logo.jpg';
import Swal from 'sweetalert2';
import '../Poppins.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false); // State for password confirmation visibility
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Notes Apps | Register"; 
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = gdgLogo;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors

    // Validasi panjang password
    if (password.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Password must be at least 8 characters!',
      });
      return;
    }

    // Validasi konfirmasi password
    if (password !== passwordConfirmation) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Password doesn`t match!',
      });
      return;
    }

    try {
      await register({ name, email, password, password_confirmation: passwordConfirmation });
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'You have successfully registered!',
      });
      navigate('/login');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed!',
        text: error.message,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirmationVisibility = () => {
    setShowPasswordConfirmation(!showPasswordConfirmation);
  };

  return (
    <div className="font-poppins my-5 max-sm:px-4 sm:my-0 ">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="grid pt-6 md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full px-4 mx-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
          <div className="hidden md:block w-full h-full flex items-center rounded-xl">
            <img src={loginImage} className="w-full aspect-[10/12] object-contain" alt="login-image" />
          </div>
          <div className="md:max-w-md w-full px-4 py-4 md:ml-6">
            <h1 className="text-gray-800 text-4xl font-extrabold mb-8 text-center">Notes Apps</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <h3 className="text-gray-800 text-3xl font-bold">Register</h3>
                <p className="text-sm mt-4 text-gray-800">
                  Already have an account?
                  <a href="/login" className="text-[#D268CC] hover:underline font-semibold ml-1 whitespace-nowrap" onClick={() => navigate('/login')}>Login here</a>
                </p>
              </div>

              <div>
                <label className="text-gray-800 text-s block mb-2 font-extrabold">Name</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    id="name"
                    className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-gray-800 text-s block mb-2 font-extrabold">Email</label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    id="email"
                    className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-gray-800 text-s block mb-2 font-extrabold">Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'} // Toggle password visibility
                    id="password"
                    className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <svg
                    onClick={togglePasswordVisibility} // Toggle function for password visibility
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[18px] h-[18px] absolute right-2 cursor-pointer"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {showPassword ? (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    ) : (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    )}
                  </svg>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-gray-800 text-s block mb-2 font-extrabold">Password Confirmation</label>
                <div className="relative flex items-center">
                  <input
                    type={showPasswordConfirmation ? 'text' : 'password'} // Toggle password confirmation visibility
                    id="password_confirmation"
                    className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                    placeholder="Password Confirmation"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                  />
                  <svg
                    onClick={togglePasswordConfirmationVisibility} // Toggle function for password confirmation visibility
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[18px] h-[18px] absolute right-2 cursor-pointer"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {showPasswordConfirmation ? (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    ) : (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    )}
                  </svg>
                  {errors.password_confirmation && <p className="text-red-500 text-xs italic mt-2">{errors.password_confirmation}</p>}
                </div>
              </div>

              <div className="mt-12">
                <button type="submit" className="w-full shadow-xl py-2.5 px-4 mb-6 text-m font-extrabold tracking-wide rounded-md text-white focus:outline-none bg-[#E7A5E2] hover:bg-[#D268CC]">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
