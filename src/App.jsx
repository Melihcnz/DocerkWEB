import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import PostForm from './components/PostForm'
import PostList from './components/PostList'

function App() {
  const [user, setUser] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [refreshPosts, setRefreshPosts] = useState(0)

  // localStorage'dan kullanıcıyı yükle
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
  }, [])

  // Kullanıcı değişince localStorage'a kaydet
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user])

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (!user) {
    return (
      <>
        {showRegister ? (
          <Register onRegister={() => setShowRegister(false)}>
            <div className="text-center mt-4">
              <button className="text-blue-400 hover:underline" onClick={() => setShowRegister(false)}>
                Zaten hesabın var mı? Giriş yap
              </button>
            </div>
          </Register>
        ) : (
          <Login onLogin={setUser}>
            <div className="text-center mt-4">
              <button className="text-blue-400 hover:underline" onClick={() => setShowRegister(true)}>
                Hesabın yok mu? Kayıt ol
              </button>
            </div>
          </Login>
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#18181b] px-2 relative">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-700 hover:bg-red-800 text-white font-bold px-4 py-2 rounded-lg shadow transition-all z-10"
      >
        Çıkış Yap
      </button>
      <Profile token={user.token} />
      <PostForm token={user.token} onPostSuccess={() => setRefreshPosts(r => r + 1)} />
      <PostList token={user.token} refresh={refreshPosts} />
    </div>
  )
}

export default App
