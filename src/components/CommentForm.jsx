import { useState } from 'react';

const API_URL = 'https://api.melihcanaz.com';

export default function CommentForm({ postId, token, onCommentSuccess }) {
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
      const res = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, content })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Yorum eklenemedi');
      setSuccess('Yorum başarıyla eklendi!');
      setContent('');
      if (onCommentSuccess) onCommentSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
      {error && <div className="bg-red-900/60 text-red-300 px-2 py-1 rounded text-xs">{error}</div>}
      {success && <div className="bg-green-900/60 text-green-300 px-2 py-1 rounded text-xs">{success}</div>}
      <textarea
        className="w-full px-3 py-2 bg-[#18181b] border border-[#33334d] rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition min-h-[60px]"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
        placeholder="Yorumunuzu yazın..."
      />
      <button
        type="submit"
        className="self-end bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded shadow transition-colors duration-200 disabled:opacity-50 text-sm"
        disabled={loading}
      >
        {loading ? 'Ekleniyor...' : 'Yorum Ekle'}
      </button>
    </form>
  );
} 