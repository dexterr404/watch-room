import { Route,Routes } from "react-router-dom"
import { useState,useEffect } from "react"
import type { User } from "./types/User"
import AuthPage from "./pages/AuthPage"
import ProtectedRoute from "./components/ProtectedRoute"
import LobbyPage from "./pages/RoomPage"
import RoomPage from "./pages/WatchRoomPage"
import NotFound from "./pages/NotFound"
import AuthCallback from "./pages/AuthCallback"
import { getUser } from "./api/authService"

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser();
        setUser(res.profile);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Routes>
        {/*Public Route*/}
        <Route path="/login" element={<AuthPage />}/>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<NotFound />}/>
        {/*Protected Routes*/}
        <Route path="/room" element={<ProtectedRoute user={user!} loading={loading}><LobbyPage /></ProtectedRoute>}/>
        <Route path="/room/:roomId" element={<RoomPage />}/>
      </Routes>
    </>
  )
}

export default App
