import { Link } from 'react-router-dom'
import { Trophy, Star, BarChart3, Swords, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useMatches } from '../hooks/useMatches'
import { useMyPredictions } from '../hooks/usePredictions'
import { useMyRanking } from '../hooks/useRanking'
import { Card } from '../components/ui/Card'
import { MatchCard } from '../components/MatchCard'
import { isMatchLocked, isMatchUpcoming } from '../lib/utils'

export function DashboardPage() {
  const { profile } = useAuth()
  const { data: matches = [] } = useMatches()
  const { data: predictions = [] } = useMyPredictions()
  const { data: myRanking } = useMyRanking(profile?.id)

  const predictionMap = new Map(predictions.map((p) => [p.match_id, p]))

  const upcomingMatches = matches.filter((m) => isMatchUpcoming(m.match_date) && !isMatchLocked(m.match_date, m.is_locked))
  const pendingMatches = upcomingMatches.filter((m) => !predictionMap.has(m.id))
  const recentFinished = matches.filter((m) => m.status === 'finished').slice(-3).reverse()
  const liveMatches = matches.filter((m) => m.status === 'live')

  const totalPoints = myRanking?.total_points ?? 0
  const exactScores = myRanking?.exact_scores ?? 0
  const correctResults = myRanking?.correct_results ?? 0

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Olá, {profile?.full_name?.split(' ')[0] || 'Participante'} 👋
        </h1>
        <p className="text-slate-400 mt-1">Copa do Mundo 2026 — EUA, Canadá e México</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Trophy} label="Pontuação" value={totalPoints} color="yellow" />
        <StatCard icon={Star} label="Placar exato" value={exactScores} color="blue" />
        <StatCard icon={CheckCircle} label="Resultado certo" value={correctResults} color="green" />
        <StatCard icon={TrendingUp} label="Palpites feitos" value={predictions.length} color="purple" />
      </div>

      {/* Live matches */}
      {liveMatches.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h2 className="text-lg font-semibold text-white">Ao Vivo Agora</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveMatches.map((m) => (
              <MatchCard key={m.id} match={m} prediction={predictionMap.get(m.id)} showPrediction />
            ))}
          </div>
        </section>
      )}

      {/* Pending predictions */}
      {pendingMatches.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-semibold text-white">Palpites Pendentes</h2>
              <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full border border-yellow-500/30">
                {pendingMatches.length}
              </span>
            </div>
            <Link to="/jogos" className="text-blue-400 text-sm hover:underline">Ver todos →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingMatches.slice(0, 6).map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {/* Recent finished */}
      {recentFinished.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              <h2 className="text-lg font-semibold text-white">Resultados Recentes</h2>
            </div>
            <Link to="/meus-palpites" className="text-blue-400 text-sm hover:underline">Ver meus pontos →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentFinished.map((m) => (
              <MatchCard key={m.id} match={m} prediction={predictionMap.get(m.id)} showPrediction />
            ))}
          </div>
        </section>
      )}

      {matches.length === 0 && (
        <Card className="p-12 text-center">
          <Swords className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Os jogos serão cadastrados em breve pelo administrador.</p>
        </Card>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    yellow: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    green: 'text-green-400 bg-green-400/10 border-green-400/20',
    purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  }

  return (
    <Card className="p-4">
      <div className={`inline-flex p-2 rounded-lg border ${colors[color]} mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </Card>
  )
}
