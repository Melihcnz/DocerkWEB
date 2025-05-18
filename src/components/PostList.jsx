import { useEffect, useState } from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

const API_URL = 'https://api.melihcanaz.com';

function getUserDisplayName(user, username, user_id) {
  return user?.email || username || (user_id ? `Kullanıcı #${user_id}` : 'Bilinmeyen');
}

function relativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff} sn önce`;
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} sa önce`;
  return date.toLocaleString();
}

export default function PostList({ token, refresh }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentRefresh, setCommentRefresh] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [refreshPosts, setRefreshPosts] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/posts`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPosts(data);
        else if (Array.isArray(data.posts)) setPosts(data.posts);
        else setError('Postlar alınamadı.');
      })
      .catch(() => setError('Bir hata oluştu.'))
      .finally(() => setLoading(false));
  }, [token, refresh, refreshPosts]);

  const handleCommentSuccess = (postId) => {
    setCommentRefresh(r => ({ ...r, [postId]: (r[postId] || 0) + 1 }));
  };

  const handleDelete = async (id) => {
    setDeleteLoading(id);
    try {
      await fetch(`${API_URL}/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setRefreshPosts(r => r + 1);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleEditSave = async (id) => {
    setEditLoading(true);
    await fetch(`${API_URL}/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editTitle, content: editContent })
    });
    setEditLoading(false);
    setEditingId(null);
    setRefreshPosts(r => r + 1);
  };

  if (loading) return <div className="text-gray-400 text-center">Postlar yükleniyor...</div>;
  if (error) return <div className="text-red-400 text-center">{error}</div>;

  // Kullanıcı id'sini token'dan decode etmek yerine, post.user_id ile karşılaştırıyoruz
  const getIsMine = (post) => {
    const saved = localStorage.getItem('user');
    if (!saved) return false;
    try {
      const u = JSON.parse(saved);
      return post.user_id === u.user?.id || post.user_id === u.id;
    } catch {
      return false;
    }
  };

  return (
    <div className="w-full max-w-2xl flex flex-col gap-8">
      {posts.length === 0 && <div className="text-gray-400 text-center">Henüz hiç post yok.</div>}
      {posts.map(post => {
        const isMine = getIsMine(post);
        const displayName = getUserDisplayName(post.user, post.username, post.user_id);
        const avatarLetter = (post.user?.email?.[0] || post.username?.[0] || (post.user_id ? String(post.user_id)[0] : '?')).toUpperCase();
        return (
          <div key={post.id} className="relative bg-[#23232b] rounded-2xl shadow-xl p-6 border border-[#33334d] hover:scale-[1.01] hover:shadow-2xl transition-all duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-xl font-bold text-white">
                {avatarLetter}
              </div>
              <div>
                <div className="text-white font-semibold">{displayName}</div>
                <div className="text-gray-500 text-xs">{relativeTime(post.created_at || post.createdAt)}</div>
              </div>
              {isMine && (
                <div className="ml-auto flex gap-2">
                  <button
                    className="bg-red-700 hover:bg-red-800 text-white rounded-full px-3 py-1 text-xs font-bold shadow transition"
                    onClick={() => handleDelete(post.id)}
                    disabled={deleteLoading === post.id}
                  >
                    {deleteLoading === post.id ? 'Siliniyor...' : 'Sil'}
                  </button>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-full px-3 py-1 text-xs font-bold shadow transition"
                    onClick={() => handleEdit(post)}
                  >
                    Düzenle
                  </button>
                </div>
              )}
            </div>
            {editingId === post.id ? (
              <div className="flex flex-col gap-2 mb-4">
                <input
                  className="px-4 py-2 rounded bg-[#18181b] border border-[#33334d] text-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  placeholder="Başlık"
                />
                <textarea
                  className="px-4 py-2 rounded bg-[#18181b] border border-[#33334d] text-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  placeholder="İçerik"
                />
                <div className="flex gap-2 mt-1">
                  <button
                    className="bg-blue-700 hover:bg-blue-800 text-white rounded px-4 py-1 font-bold shadow"
                    onClick={() => handleEditSave(post.id)}
                    disabled={editLoading}
                  >
                    {editLoading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                  <button
                    className="bg-gray-600 hover:bg-gray-700 text-white rounded px-4 py-1 font-bold shadow"
                    onClick={() => setEditingId(null)}
                  >
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-extrabold text-white mb-2">{post.title}</div>
                <div className="text-gray-300 mb-4">{post.content}</div>
              </>
            )}
            <CommentList postId={post.id} key={commentRefresh[post.id] || 0} />
            <CommentForm postId={post.id} token={token} onCommentSuccess={() => handleCommentSuccess(post.id)} />
          </div>
        );
      })}
    </div>
  );
} 