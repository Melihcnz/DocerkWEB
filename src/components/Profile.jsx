import { useEffect, useState } from 'react';

export default function Profile({ token }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch('http://213.142.151.189:3000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data && (data.email || (data.user && data.user.email))) {
          setUser(data.user ? data.user : data);
        } else {
          setError('Kullanıcı bilgisi alınamadı.');
        }
      })
      .catch(() => setError('Bir hata oluştu.'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="text-gray-400 text-center">Yükleniyor...</div>;
  if (error) return <div className="text-red-400 text-center">{error}</div>;
  if (!user) return null;

  return (
    <div className="bg-[#23232b] rounded-xl shadow-lg p-6 flex flex-col items-center gap-2 border border-[#33334d] w-full max-w-sm mx-auto mb-8">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-3xl font-bold text-white mb-2">
        {user.email?.[0]?.toUpperCase() || '?'}
      </div>
      <div className="text-lg font-semibold text-white">{user.email}</div>
      <div className="text-gray-400 text-sm">ID: {user.id}</div>
      {/* Diğer kullanıcı bilgileri eklenebilir */}
    </div>
  );
} 