import { useState } from 'react';

const API_URL = 'https://api.melihcanaz.com';

export default function PostForm({ token, onPostSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Post oluşturulamadı');
      setSuccess('Post başarıyla oluşturuldu!');
      setTitle('');
      setContent('');
      if (onPostSuccess) onPostSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg bg-[#23232b] rounded-xl shadow-lg p-8 border border-[#33334d] flex flex-col gap-5 mb-8">
      <h3 className="text-xl font-bold text-white mb-2">Yeni Post Oluştur</h3>
      {error && <div className="bg-red-900/60 text-red-300 px-4 py-2 rounded text-center text-sm">{error}</div>}
      {success && <div className="bg-green-900/60 text-green-300 px-4 py-2 rounded text-center text-sm">{success}</div>}
      <div className="flex flex-col gap-2">
        <label className="text-gray-300 font-medium">Başlık</label>
        <input
          type="text"
          className="w-full px-4 py-3 bg-[#18181b] border border-[#33334d] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          placeholder="Post başlığı"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-gray-300 font-medium">İçerik</label>
        <textarea
          className="w-full px-4 py-3 bg-[#18181b] border border-[#33334d] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition min-h-[100px]"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          placeholder="Post içeriği"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg shadow-lg transition-colors duration-200 disabled:opacity-50 text-lg tracking-wide"
        disabled={loading}
      >
        {loading ? 'Oluşturuluyor...' : 'Post Oluştur'}
      </button>
    </form>
  );
} 