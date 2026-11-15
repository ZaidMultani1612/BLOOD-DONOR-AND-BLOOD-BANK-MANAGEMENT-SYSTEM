import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Heart, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('admin@bloodbank.com');
  const [password, setPassword] = useState('adminpassword123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'donor') navigate('/donor/dashboard');
      else if (user.role === 'recipient') navigate('/recipient/dashboard');
      else if (user.role === 'bloodbank') navigate('/bloodbank/dashboard');
      else if (user.role === 'hospital') navigate('/hospital/dashboard');
      else navigate('/admin/dashboard');
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to backend server. Render free tier takes ~30-50s to wake up if inactive. Please wait 30 seconds and try again.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Quick switch credentials helper
  const setDemoUser = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-[#DDF4F0] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-teal-100">
        
        {/* Left Side: HealthTech Branding */}
        <div className="bg-gradient-to-br from-[#E2F7F2] to-[#BEEBE0] p-10 flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center text-red-500">
              <Heart className="w-6 h-6 fill-red-500 text-red-500" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-extrabold text-[#115E59]">HealthTech</h2>
              <p className="text-xs text-[#134E4A] font-medium leading-tight">
                Blood Donor & Blood Bank<br />Management System
              </p>
            </div>
          </div>

          {/* Central graphic */}
          <div className="my-8 flex flex-col items-center">
            <p className="text-xl font-bold text-slate-800 mb-1">Donate Blood</p>
            <p className="text-2xl font-extrabold text-red-600 tracking-wide flex items-center gap-2">
              <span>Save Lives</span>
              <span className="text-sm font-normal text-slate-400">ﮩ٨ـﮩﮩʌـ</span>
            </p>
            <div className="w-32 h-32 mt-6 rounded-2xl bg-white/70 shadow-lg border border-teal-100 flex items-center justify-center">
              <div className="w-20 h-20 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-md animate-pulse">
                <Heart className="w-10 h-10 fill-white" />
              </div>
            </div>
          </div>

          {/* Fast demo role switch buttons */}
          <div className="w-full bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-teal-200/60 text-left">
            <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1.5 text-center">
              Quick Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setDemoUser('admin@bloodbank.com', 'adminpassword123')}
                className="px-2 py-1 bg-teal-100 hover:bg-teal-200 text-teal-900 rounded font-medium text-[11px] transition"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setDemoUser('suratcity@bloodbank.com', 'bankpassword123')}
                className="px-2 py-1 bg-teal-100 hover:bg-teal-200 text-teal-900 rounded font-medium text-[11px] transition"
              >
                Blood Bank
              </button>
              <button
                type="button"
                onClick={() => setDemoUser('amit@donor.com', 'donorpassword123')}
                className="px-2 py-1 bg-teal-100 hover:bg-teal-200 text-teal-900 rounded font-medium text-[11px] transition"
              >
                Donor
              </button>
              <button
                type="button"
                onClick={() => setDemoUser('john@recipient.com', 'recipientpassword123')}
                className="px-2 py-1 bg-teal-100 hover:bg-teal-200 text-teal-900 rounded font-medium text-[11px] transition"
              >
                Recipient
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Welcome Back!
            </h2>
            <p className="text-sm text-slate-500 mt-1">Login to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-teal-600 focus:ring-teal-500" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-teal-700 font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#115E59] hover:bg-[#0F766E] text-white rounded-xl font-bold text-sm shadow-md shadow-teal-900/20 transition active:scale-98"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-teal-700 font-bold hover:underline">
              Register Here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
