import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, Building2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    pincode: '',
    address: '',
    role: 'donor',
    bloodGroup: 'O+',
    bloodBankName: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const user = await register(formData);
      if (user.role === 'donor') navigate('/donor/dashboard');
      else if (user.role === 'recipient') navigate('/recipient/dashboard');
      else if (user.role === 'bloodbank') navigate('/bloodbank/dashboard');
      else navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#DDF4F0] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 overflow-hidden border border-teal-100">
        
        {/* Left Side Branding */}
        <div className="md:col-span-4 bg-gradient-to-br from-[#E2F7F2] to-[#BEEBE0] p-8 flex flex-col justify-between items-center text-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white shadow-md flex items-center justify-center text-red-500">
              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-[#115E59]">HealthTech</h2>
          </div>

          <div className="my-8 flex flex-col items-center">
            <h3 className="text-xl font-bold text-slate-800">Create Your Account</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
              Join our community and make a real difference
            </p>

            <div className="w-28 h-28 my-6 rounded-2xl bg-white/70 shadow-md flex items-center justify-center border border-teal-100">
              <div className="w-16 h-16 rounded-xl bg-red-500 text-white flex items-center justify-center shadow">
                <Heart className="w-8 h-8 fill-white" />
              </div>
            </div>

            <p className="text-lg font-bold text-slate-800">Together</p>
            <p className="text-xl font-extrabold text-red-600 flex items-center gap-1.5">
              <span>We Save Lives</span>
              <span className="text-xs font-normal text-slate-400">ﮩ٨ـﮩﮩʌـ</span>
            </p>
          </div>

          <div className="text-xs text-teal-800">
            Final-Year Capstone System
          </div>
        </div>

        {/* Right Side Registration Form */}
        <div className="md:col-span-8 p-8 md:p-10 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Sign Up</h2>
            <div className="text-xs text-slate-500">
              <span>Already have an account? </span>
              <Link to="/login" className="text-teal-700 font-bold hover:underline">
                Login
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter phone number"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter password"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm password"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  placeholder="Enter pincode"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter address"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
              />
            </div>

            {/* Role Selection matching screenshot */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                Select Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('donor')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition ${
                    formData.role === 'donor'
                      ? 'border-red-500 bg-red-50 text-red-600 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Donor</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('recipient')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition ${
                    formData.role === 'recipient'
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Recipient</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('bloodbank')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition ${
                    formData.role === 'bloodbank'
                      ? 'border-teal-600 bg-teal-50 text-teal-700 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Blood Bank</span>
                </button>
              </div>
            </div>

            {formData.role === 'donor' && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            )}

            {formData.role === 'bloodbank' && (
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">
                  Blood Bank Center Name
                </label>
                <input
                  type="text"
                  name="bloodBankName"
                  value={formData.bloodBankName}
                  onChange={handleChange}
                  placeholder="e.g. Surat City Blood Bank"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#115E59] hover:bg-[#0F766E] text-white rounded-xl font-bold text-sm shadow-md shadow-teal-900/20 transition active:scale-98"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Register;
