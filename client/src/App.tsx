import { Route,Routes } from "react-router-dom"
import { QueryClientProvider,QueryClient } from "@tanstack/react-query"
import { useState,useEffect } from "react"
import { getUser } from "./api/authService"
import { Toaster } from 'sonner';
import type { User } from "./types/User"

import AuthPage from "./pages/AuthPage"
import ProtectedRoute from "./components/ProtectedRoute"
import RoomPage from "./pages/RoomPage"
import WatchRoomPage from "./pages/WatchRoomPage"
import NotFound from "./pages/NotFound"
import AuthCallback from "./pages/AuthCallback"

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient =new QueryClient();

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
    <QueryClientProvider client={queryClient}>
       <Toaster 
        position="top-center"
        theme="dark"
        expand={false}
        richColors
        closeButton
        toastOptions={{
          style: {
            background: 'rgb(17 24 39)',
            border: '1px solid rgb(55 65 81)',
            color: '#fff',
          },
        }}
      />
      <Routes>
        {/*Public Route*/}
        <Route path="/login" element={<AuthPage />}/>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<NotFound />}/>
        {/*Protected Routes*/}
        <Route path="/room" element={<ProtectedRoute user={user!} loading={loading}><RoomPage user={user!}/></ProtectedRoute>}/>
        <Route path="/room/:roomId" element={<ProtectedRoute user={user!} loading={loading}><WatchRoomPage user={user!}/></ProtectedRoute>}/>
      </Routes>
    </QueryClientProvider>
  )
}

export default App
