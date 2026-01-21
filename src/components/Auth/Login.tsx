import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const { clientX, clientY } = event;
        containerRef.current.style.setProperty('--mouse-x', `${clientX}px`);
        containerRef.current.style.setProperty('--mouse-y', `${clientY}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden"
    >
      <svg className="fixed inset-0 w-full h-full" style={{ display: 'none' }}>
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div className="gradient-container fixed inset-0 pointer-events-none">
        <div className="gradient-circle absolute w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#6366f1' }} />
        <div className="gradient-circle absolute w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#8b5cf6' }} />
        <div className="gradient-circle absolute w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#ec4899' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="rounded-lg shadow-lg p-8" style={{ backgroundColor: '#224059' }}>
          <div className="flex items-center justify-center mb-8">
            <img
              src="https://ketsuronmedia.com/media/ketsuron-logo-color.webp"
              alt="Ketsuron Logo"
              className="h-16 object-contain"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 text-small">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-small font-medium text-white mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 text-small bg-white text-text-primary border-0"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-small font-medium text-white mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 text-small bg-white text-text-primary border-0"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2 text-small disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
