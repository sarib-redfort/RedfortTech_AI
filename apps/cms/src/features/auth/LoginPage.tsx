/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import { authService } from '../../services';

// Validation Schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginPageProps {
  onLoginSuccess?: (user: { id?: string; name: string; email: string; role: string }) => void;
  onNavigateToDashboard?: () => void;
}
export default function LoginPage({ onLoginSuccess, onNavigateToDashboard }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await authService.login(data.email, data.password);
      const normalizedUser = {
        id: result.user?.id,
        name: result.user?.name || 'Admin User',
        email: result.user?.email || data.email,
        role: result.user?.role || 'Admin',
      };

      toast.success('Successfully signed in!', {
        id: 'login-toast',
        duration: 3000,
      });
      if (onLoginSuccess) {
        onLoginSuccess(normalizedUser);
      }
      if (onNavigateToDashboard) {
        onNavigateToDashboard();
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed', {
        id: 'login-error-toast',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#FCFCFC] relative overflow-hidden select-none px-4 py-8">
      
      {/* Upper Area / Logo and Centered Box */}
      <div className="flex-1 flex flex-col items-center justify-center z-10">
        
        {/* RedForAI CMS Logo */}
        <div className="flex items-center gap-3 mb-8">
          {/* Custom Stylized Logo Emblem */}
          <div className="w-10 h-10 bg-primary-red rounded-xl flex items-center justify-center shadow-md shadow-red-200">
            <svg 
              className="w-5 h-5 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m3 21 9-18 9 18H3Z" />
              <path d="M9 14h6" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-text-dark">
            RedForAI
          </span>
          <span className="bg-primary-red text-white text-xs font-semibold px-2 py-1 rounded-md tracking-wider">
            CMS
          </span>
        </div>

        {/* Card Panel */}
        <div className="w-full max-w-[440px] bg-white border border-border-gray rounded-2xl shadow-xl shadow-gray-100/40 p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-[22px] font-bold text-text-dark tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-text-gray mt-1.5">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <Input
              placeholder="Email Address"
              type="text"
              icon={<Mail className="w-[18px] h-[18px]" />}
              error={errors.email?.message}
              {...register('email')}
              disabled={isLoading}
            />

            {/* Password Input */}
            <Input
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              icon={<Lock className="w-[18px] h-[18px]" />}
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-text-gray hover:text-text-dark transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-[18px] h-[18px]" />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" />
                  )}
                </button>
              }
              {...register('password')}
              disabled={isLoading}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-text-gray select-none">
                <input
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded border-border-gray text-primary-red focus:ring-primary-red transition duration-200 cursor-pointer"
                  {...register('rememberMe')}
                  disabled={isLoading}
                />
                Remember me
              </label>
              
              {/* There is no self-service reset flow, so point people to an
                  administrator. This previously displayed the admin email and
                  password to anyone who clicked it. */}
              <button
                type="button"
                onClick={() => toast('Ask an administrator to reset your password.')}
                className="text-primary-red hover:text-primary-red-hover font-semibold transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="py-3 mt-2"
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>

      {/* Wave Grid Mesh Background Decoration at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-44 opacity-20 pointer-events-none select-none z-0">
        <svg className="w-full h-full" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path 
            d="M0 80C120 120 240 160 360 160C480 160 600 120 720 100C840 80 960 40 1080 30C1200 20 1320 40 1440 60V200H0V80Z" 
            fill="url(#wave-gradient)"
          />
          <path 
            d="M0 120C150 140 300 100 450 110C600 120 750 180 900 160C1050 140 1200 60 1350 50C1400 45 1420 48 1440 50V200H0V120Z" 
            fill="url(#wave-gradient-secondary)" 
            opacity="0.6"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="720" y1="0" x2="720" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#DC2626" stopOpacity="0.12" />
              <stop offset="1" stopColor="#DC2626" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="wave-gradient-secondary" x1="720" y1="0" x2="720" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#DC2626" stopOpacity="0.08" />
              <stop offset="1" stopColor="#DC2626" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-text-gray tracking-wide z-10 pt-6 mt-4">
        © 2024 RedForAI. All rights reserved.
      </div>
    </div>
  );
}
