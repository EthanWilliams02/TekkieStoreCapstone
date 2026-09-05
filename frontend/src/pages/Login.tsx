import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { AuthContainer } from '../components/authentication/AuthContainer';
import { AuthField } from '../components/authentication/AuthField';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id === 'login-email' ? 'email' : 'password']: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/catalogue');
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || 'Invalid email or password. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
      footerText="Don't have an account?"
      footerLinkText="Sign Up"
      footerLinkTo="/signup"
    >
      <form className="authForm" onSubmit={handleSubmit}>
        {error && (
          <div style={{ color: '#dc2626', fontSize: '0.875rem', textAlign: 'center', marginTop: '-0.25rem' }}>
            {error}
          </div>
        )}

        <AuthField
          id="login-email"
          type="email"
          label="Email Address"
          icon={Mail}
          placeholder="john.doe@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <AuthField
          id="login-password"
          type="password"
          label="Password"
          icon={Lock}
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required
        />

        <div className="forgotPasswordRow">
          <Link to="/forgot-password" className="forgotPasswordLink">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" className="authSubmitBtn" disabled={loading}>
          {loading ? 'SIGNING IN...' : 'LOGIN'}
        </button>
      </form>
    </AuthContainer>
  );
};
