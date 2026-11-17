
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  loginSchema,
  validateSingleField,
} from '../../utils/authValidation';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AlertCircle } from 'lucide-react';

import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle changes to the email and password fields
  const handleChange = (field, value) => {
    const updatedData = {
      ...formData,
      [field]: value,
    };

    setFormData(updatedData);
    setServerError('');

    if (touched[field]) {
      const errors = validateSingleField(
        loginSchema,
        updatedData,
        field
      );

      setFieldErrors((prev) => ({
        ...prev,
        [field]: errors,
      }));
    }
  };

  // Validate a field when the user leaves it
  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    const errors = validateSingleField(
      loginSchema,
      formData,
      field
    );

    setFieldErrors((prev) => ({
      ...prev,
      [field]: errors,
    }));
  };

  // Validate the entire form and log the user in
  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError('');

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (!formattedErrors[field]) {
          formattedErrors[field] = [];
        }

        formattedErrors[field].push(issue.message);
      });

      setFieldErrors(formattedErrors);
      setTouched({
        email: true,
        password: true,
      });

      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(
        err?.message ||
          'Failed to sign in. Please check your credentials and make sure json-server is running on port 5000.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* Left side: Branding */}
      <div className="hidden md:flex flex-col justify-center items-center bg-indigo-600 text-white p-12">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to JobTrail
          </h1>

          <p className="text-lg text-indigo-100 leading-relaxed">
            Your next career opportunity starts here.
            Sign in to explore jobs, manage applications,
            and move your career forward.
          </p>

          <div className="mt-8 space-y-3 text-sm text-indigo-100">
            <p>✓ Discover opportunities that match your skills</p>
            <p>✓ Track your job applications</p>
            <p>✓ Keep your career journey organized</p>
          </div>
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Sign in
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Enter your credentials to access your account.
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div
              role="alert"
              className="flex items-start gap-2 mb-5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
            >
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <p>{serverError}</p>
            </div>
          )}

          <form onSubmit={handleLogin} noValidate>
            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  handleChange('email', e.target.value)
                }
                onBlur={() => handleBlur('email')}
                aria-invalid={Boolean(
                  fieldErrors.email?.length
                )}
                className={`w-full border rounded-lg p-3 text-sm outline-none transition focus:ring-2 focus:ring-indigo-200 ${
                  fieldErrors.email?.length
                    ? 'border-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:border-indigo-500'
                }`}
              />

              {fieldErrors.email?.length > 0 && (
                <p className="text-xs text-rose-600 mt-1 font-medium">
                  {fieldErrors.email[0]}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    handleChange('password', e.target.value)
                  }
                  onBlur={() => handleBlur('password')}
                  aria-invalid={Boolean(
                    fieldErrors.password?.length
                  )}
                  className={`w-full border rounded-lg p-3 pr-12 text-sm outline-none transition focus:ring-2 focus:ring-indigo-200 ${
                    fieldErrors.password?.length
                      ? 'border-rose-500 bg-rose-50/20'
                      : 'border-slate-300 focus:border-indigo-500'
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 flex items-center justify-center"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </button>
              </div>

              <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                Password must be at least 8 characters and
                include an uppercase letter, a lowercase
                letter, a number, and a special character.
              </p>

              {fieldErrors.password?.length > 0 && (
                <ul className="mt-2 space-y-1 text-xs text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100">
                  {fieldErrors.password.map(
                    (errMsg, idx) => (
                      <li key={idx}>{errMsg}</li>
                    )
                  )}
                </ul>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Verifying...' : 'Sign in'}
            </button>
          </form>

          {/* Registration link */}
          <p className="text-sm text-center text-gray-600 mt-6">
            New here?{' '}
            <Link
              to="/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
