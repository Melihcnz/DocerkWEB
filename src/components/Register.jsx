import { useState } from 'react';

export default function Register({ onRegister, children }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!username || !email || !password || !password2) {
      setError('Tüm alanlar gereklidir!');
      return;
    }
    if (password !== password2) {
      setError('Şifreler eşleşmiyor!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://213.142.151.189:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Kayıt başarısız');
      setSuccess('Kayıt başarılı! Giriş yapabilirsiniz.');
      setError('');
      if (onRegister) onRegister();
    } catch (err) {
      setError(err.message);
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#23232b] rounded-2xl shadow-2xl p-10 border border-[#23232b] flex flex-col gap-7"
      >
        <h2 className="text-3xl font-extrabold text-center text-white mb-2 tracking-tight">Kayıt Ol</h2>
        {error && <div className="bg-red-900/60 text-red-300 px-4 py-2 rounded text-center text-sm">{error}</div>}
        {success && <div className="bg-green-900/60 text-green-300 px-4 py-2 rounded text-center text-sm">{success}</div>}
        <div className="flex flex-col gap-2">
          <label className="text-gray-300 font-medium">Kullanıcı Adı</label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-[#18181b] border border-[#33334d] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoComplete="username"
            placeholder="Kullanıcı adınız"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-gray-300 font-medium">E-posta</label>
          <input
            type="email"
            className="w-full px-4 py-3 bg-[#18181b] border border-[#33334d] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="mail@ornek.com"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-gray-300 font-medium">Şifre</label>
          <input
            type="password"
            className="w-full px-4 py-3 bg-[#18181b] border border-[#33334d] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Şifreniz"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-gray-300 font-medium">Şifre Tekrar</label>
          <input
            type="password"
            className="w-full px-4 py-3 bg-[#18181b] border border-[#33334d] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition"
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Şifrenizi tekrar girin"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg shadow-lg transition-colors duration-200 disabled:opacity-50 text-lg tracking-wide"
          disabled={loading}
        >
          {loading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
        </button>
        {children}
      </form>
    </div>
  );
} 