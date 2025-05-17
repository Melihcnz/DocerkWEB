import { useEffect, useState } from 'react';

function getUserDisplayName(user, username, user_id) {
  return user?.email || username || (user_id ? `Kullanıcı #${user_id}` : 'Bilinmeyen');
}

export default function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`http://213.142.151.189:3000/api/comments/post/${postId}`)
      .then(res => res.json())
      .then(data => {
        console.log('Comment API yanıtı:', data);
        if (Array.isArray(data)) setComments(data);
        else if (Array.isArray(data.comments)) setComments(data.comments);
        else setError('Yorumlar alınamadı.');
      })
      .catch(() => setError('Bir hata oluştu.'))
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading) return <div className="text-gray-400 text-sm">Yorumlar yükleniyor...</div>;
  if (error) return <div className="text-red-400 text-sm">{error}</div>;

  return (
    <div className="flex flex-col gap-2 mt-2">
      {comments.length === 0 && <div className="text-gray-500 text-xs">Henüz yorum yok.</div>}
      {comments.map(comment => {
        const displayName = getUserDisplayName(comment.user, comment.username, comment.user_id);
        const avatarLetter = (comment.user?.email?.[0] || comment.username?.[0] || (comment.user_id ? String(comment.user_id)[0] : '?')).toUpperCase();
        return (
          <div key={comment.id} className="bg-[#18181b] rounded p-3 border border-[#33334d]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-xs font-bold text-white">
                {avatarLetter}
              </div>
              <div className="text-white text-sm font-semibold">{displayName}</div>
              <div className="text-gray-500 text-xs ml-auto">{new Date(comment.createdAt || comment.created_at).toLocaleString()}</div>
            </div>
            <div className="text-gray-300 text-sm">{comment.content}</div>
          </div>
        );
      })}
    </div>
  );
} 