import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { MatchesPage } from './pages/MatchesPage'
import { MatchDetailPage } from './pages/MatchDetailPage'
import { MyPredictionsPage } from './pages/MyPredictionsPage'
import { RankingPage } from './pages/RankingPage'
import { AdminPage } from './pages/AdminPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000, retry: 1 },
  },
})

function LayoutRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />
            <Route path="/dashboard" element={<LayoutRoute><DashboardPage /></LayoutRoute>} />
            <Route path="/jogos" element={<LayoutRoute><MatchesPage /></LayoutRoute>} />
            <Route path="/jogos/:id" element={<LayoutRoute><MatchDetailPage /></LayoutRoute>} />
            <Route path="/meus-palpites" element={<LayoutRoute><MyPredictionsPage /></LayoutRoute>} />
            <Route path="/ranking" element={<LayoutRoute><RankingPage /></LayoutRoute>} />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <Layout><AdminPage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
