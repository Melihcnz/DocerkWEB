import { useState } from 'react';

const API_URL = 'https://api.melihcanaz.com';

export default function Login({ onLogin, children }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Giriş başarısız');
      setSuccess('Giriş başarılı!');
      setError('');
      if (onLogin) onLogin(data);
    } catch (err) {
      setError(err.message);
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b]">
      <form onSubmit={handleSubmit} className="bg-[#23232b] p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">Giriş Yap</h2>
        {error && <div className="bg-red-900/60 text-red-300 px-4 py-2 rounded text-center text-sm">{error}</div>}
        {success && <div className="bg-green-900/60 text-green-300 px-4 py-2 rounded text-center text-sm">{success}</div>}
        <div>
          <label className="block text-gray-300 mb-1">E-posta</label>
          <input
            type="email"
            className="w-full px-12 py-3 bg-[#18181b] border border-[#33334d] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="mail@ornek.com"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></span>
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Şifre</label>
          <input
            type="password"
            className="w-full px-12 py-3 bg-[#18181b] border border-[#33334d] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="Şifreniz"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></span>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg shadow-lg transition-colors duration-200 disabled:opacity-50 text-lg tracking-wide"
          disabled={loading}
        >
          {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </button>
        {children}
      </form>
    </div>
  );
} 