'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store';
import { verifyOTP } from '@/actions/auth';
import { maskPhone } from '@/lib/utils';

export default function VerifyOTPPage() {
  const router = useRouter();
  const { phone, setUser, setToken, setOtpSent } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setIsLoading(true);

    const result = await verifyOTP(phone, otpCode);

    if (!result.success) {
      setError(result.error || 'Failed to verify OTP');
      setIsLoading(false);
      return;
    }

    // Store token and user
    if (result.data) {
      setToken(result.data.token);
      setUser(result.data.user);
      setOtpSent(false);
      router.push('/');
    }
  };

  const handleResend = async () => {
    setResendTimer(30);
    // Call sendOTP again
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-200">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-900" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Verify OTP</h1>
          <p className="text-sm text-gray-500">Enter the code sent to {maskPhone(phone)}</p>
        </div>
      </div>

      {/* OTP Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-xs">
          <div className="flex gap-3 justify-center mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-sm text-red-500 mb-4">{error}</p>
          )}

          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            disabled={otp.join('').length !== 6 || isLoading}
            className="mb-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </Button>

          {resendTimer > 0 ? (
            <p className="text-center text-sm text-gray-500">
              Resend OTP in {resendTimer}s
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="w-full text-center text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              Resend OTP
            </button>
          )}
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Didn't receive the code?</p>
          <button className="text-orange-500 hover:text-orange-600 font-medium mt-2">
            Edit phone number
          </button>
        </div>
      </div>
    </div>
  );
}
