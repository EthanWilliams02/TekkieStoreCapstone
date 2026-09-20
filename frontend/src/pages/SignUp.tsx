import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { AuthContainer } from '../components/authentication/AuthContainer';
import { AuthField } from '../components/authentication/AuthField';
import { useAuth } from '../context/AuthContext';

export const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [role, setRole] = useState<'CUSTOMER' | 'ADMIN'>('CUSTOMER');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const fieldMap: Record<string, string> = {
      'signup-name': 'fullName',
      'signup-email': 'email',
      'signup-phone': 'phone',
      'signup-password': 'password',
      'signup-confirm-password': 'confirmPassword',
    };
    const key = fieldMap[id] || id;
    const sanitizedValue = key === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setForm((prev) => ({ ...prev, [key]: sanitizedValue }));
    if (error) setError(null);
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow control and navigation keys
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Tab' ||
      e.key === 'Escape' ||
      e.key === 'Enter' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'Home' ||
      e.key === 'End' ||
      ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase()))
    ) {
      return;
    }

    // Block non-numeric characters
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (role === 'ADMIN' && !form.email.trim().toLowerCase().endsWith('@tekkies.com')) {
      setError('Admin accounts must use an @tekkies.com email address');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const response = await signup({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role,
      });

      if (response?.role === 'ADMIN' || role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/catalogue');
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Create Account"
      subtitle="Join Sole Town and start shopping today"
      footerText="Already have an account?"
      footerLinkText="Log In"
      footerLinkTo="/login"
    >
      <form className="authForm" onSubmit={handleSubmit}>
        {error && (
          <div style={{ color: '#dc2626', fontSize: '0.875rem', textAlign: 'center', marginTop: '-0.25rem' }}>
            {error}
          </div>
        )}

        <div className="roleSelectorGroup">
          <label className="roleSelectorLabel">Account Type</label>
          <div className="roleToggleContainer" role="radiogroup" aria-label="Account Type">
            <button
              type="button"
              className={`roleToggleBtn ${role === 'CUSTOMER' ? 'active' : ''}`}
              onClick={() => {
                setRole('CUSTOMER');
                if (error) setError(null);
              }}
              role="radio"
              aria-checked={role === 'CUSTOMER'}
            >
              Customer
            </button>
            <button
              type="button"
              className={`roleToggleBtn ${role === 'ADMIN' ? 'active' : ''}`}
              onClick={() => {
                setRole('ADMIN');
                if (error) setError(null);
              }}
              role="radio"
              aria-checked={role === 'ADMIN'}
            >
              Admin
            </button>
          </div>
          {role === 'ADMIN' && (
            <span className="roleHint">Admin accounts require an @tekkies.com email address</span>
          )}
        </div>

        <AuthField
          id="signup-name"
          type="text"
          label="Full Name"
          icon={User}
          placeholder="John Doe"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <AuthField
          id="signup-email"
          type="email"
          label="Email Address"
          icon={Mail}
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <AuthField
          id="signup-phone"
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          label="Mobile Number"
          icon={Phone}
          placeholder="0825551234"
          value={form.phone}
          onChange={handleChange}
          onKeyDown={handlePhoneKeyDown}
          required
        />

        <AuthField
          id="signup-password"
          type="password"
          label="Password"
          icon={Lock}
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required
        />

        <AuthField
          id="signup-confirm-password"
          type="password"
          label="Confirm Password"
          icon={CheckCircle}
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="authSubmitBtn" disabled={loading}>
          <span>{loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}</span>
          <ArrowRight size={18} strokeWidth={2.25} />
        </button>
      </form>
    </AuthContainer>
  );
};
