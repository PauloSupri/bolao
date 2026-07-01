import { Link } from 'react-router-dom'
import { Trophy, Star, BarChart3, Swords, TrendingUp, Clock, CheckCircle, AlertCircle, Calendar, MapPin, Lock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useMatches } from '../hooks/useMatches'
import { useMyPredictions } from '../hooks/usePredictions'
import { useMyRanking } from '../hooks/useRanking'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { MatchCard } from '../components/MatchCard'
import { FlagImage } from '../components/FlagImage'
import { isMatchLocked, formatDateShort, phaseLabel } from '../lib/utils'
import { isToday, parseISO } from 'date-fns'

export function DashboardPage() {
  const { profile } = useAuth()
  const { data: matches = [] } = useMatches()
  const { data: predictions = [] } = useMyPredictions()
  const { data: myRanking } = useMyRanking(profile?.id)

  const predictionMap = new Map(predictions.map((p) => [p.match_id, p]))

  // Jogos de hoje ordenados por horário
  const todayMatches = matches
    .filter((m) => isToday(parseISO(m.match_date)))
    .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime())

  // Próximos jogos sem palpite (excluindo hoje, pois já aparecem acima)
  const upcomingPending = matches
    .filter((m) => {
      const date = parseISO(m.match_date)
      return !isToday(date) && !isMatchLocked(m.match_date, m.is_locked) && !predictionMap.has(m.id)
    })
    .slice(0, 6)

  // Jogos ao vivo
  const liveMatches = matches.filter((m) => m.status === 'live')

  // Resultados recentes
  const recentFinished = matches
    .filter((m) => m.status === 'finished')
    .slice(-3)
    .reverse()

  const totalPoints = myRanking?.total_points ?? 0
  const exactScores = myRanking?.exact_scores ?? 0
  const correctResults = myRanking?.correct_results ?? 0

  return (
    <div className="space-y-8">
      {/* Saudação */}
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

      {/* Jogos Ao Vivo */}
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

      {/* Jogos de Hoje — DESTAQUE */}
      {todayMatches.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white">Jogos de Hoje</h2>
            <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full border border-yellow-500/30">
              {todayMatches.length} jogos
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {todayMatches.map((match) => {
              const locked = isMatchLocked(match.match_date, match.is_locked)
              const pred = predictionMap.get(match.id)
              const isLive = match.status === 'live'
              const isFinished = match.status === 'finished'

              return (
                <Link to={`/jogos/${match.id}`} key={match.id}>
                  <div className={`
                    relative rounded-2xl border overflow-hidden transition-all duration-200 group
                    ${isLive
                      ? 'border-green-500/50 bg-gradient-to-r from-green-950/60 to-slate-800/80'
                      : isFinished
                        ? 'border-slate-600/50 bg-slate-800/60'
                        : 'border-blue-500/30 bg-gradient-to-r from-blue-950/40 to-slate-800/70 hover:border-blue-400/50'
                    }
                  `}>
                    {/* Linha de cor no topo */}
                    <div className={`h-1 w-full ${isLive ? 'bg-green-500' : isFinished ? 'bg-slate-600' : 'bg-blue-600'}`} />

                    <div className="p-3 sm:p-5">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <span className="text-xs text-blue-400 font-medium truncate pr-2">{phaseLabel(match.phase)}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          {locked && !isFinished && !isLive && <Lock className="w-3 h-3 text-slate-500" />}
                          {isLive && <Badge variant="live">● Ao Vivo</Badge>}
                          {isFinished && <Badge>Encerrado</Badge>}
                          {!isLive && !isFinished && <Badge variant="info">Agendado</Badge>}
                        </div>
                      </div>

                      {/* Times e placar */}
                      <div className="flex items-start justify-between gap-1 sm:gap-4">
                        {/* Time da casa */}
                        <div className="flex flex-col items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                          <FlagImage code={match.home_team?.code ?? ''} size="lg" className="sm:w-20 sm:h-14" />
                          <div className="min-w-0 text-center">
                            <p className="font-bold text-white text-sm sm:text-lg leading-tight line-clamp-2">
                              {match.home_team?.name ?? 'A definir'}
                            </p>
                            <p className="text-xs text-slate-400">{match.home_team?.code}</p>
                          </div>
                        </div>

                        {/* Placar / horário */}
                        <div className="flex flex-col items-center shrink-0 px-1 pt-1 sm:pt-2">
                          {isFinished || isLive ? (
                            <div className="flex items-center gap-1.5 sm:gap-3">
                              <span className="text-2xl sm:text-4xl font-black text-white tabular-nums">
                                {match.home_score ?? 0}
                              </span>
                              <span className="text-slate-500 text-lg sm:text-xl font-bold">–</span>
                              <span className="text-2xl sm:text-4xl font-black text-white tabular-nums">
                                {match.away_score ?? 0}
                              </span>
                            </div>
                          ) : (
                            <div className="text-center">
                              <p className="text-xl sm:text-2xl font-black text-white">
                                {formatDateShort(match.match_date).split(' ')[1]}
                              </p>
                              <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 whitespace-nowrap">Brasília</p>
                            </div>
                          )}

                          {/* Palpite do usuário */}
                          {pred && (
                            <div className="mt-2 text-center">
                              <span className="text-[10px] sm:text-xs text-slate-400 block">
                                Palpite: <span className="text-white font-mono font-semibold">{pred.home_score}–{pred.away_score}</span>
                              </span>
                              {pred.total_points > 0 && (
                                <div className="text-yellow-400 font-bold text-sm">+{pred.total_points} pts</div>
                              )}
                            </div>
                          )}

                          {!pred && !locked && (
                            <span className="mt-2 text-[10px] sm:text-xs text-blue-400 group-hover:underline font-medium whitespace-nowrap">
                              Palpitar →
                            </span>
                          )}
                          {!pred && locked && !isFinished && (
                            <span className="mt-2 text-[10px] sm:text-xs text-slate-500">Sem palpite</span>
                          )}
                        </div>

                        {/* Time visitante */}
                        <div className="flex flex-col items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                          <FlagImage code={match.away_team?.code ?? ''} size="lg" className="sm:w-20 sm:h-14" />
                          <div className="min-w-0 text-center">
                            <p className="font-bold text-white text-sm sm:text-lg leading-tight line-clamp-2">
                              {match.away_team?.name ?? 'A definir'}
                            </p>
                            <p className="text-xs text-slate-400">{match.away_team?.code}</p>
                          </div>
                        </div>
                      </div>

                      {/* Rodapé */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 sm:mt-4 pt-3 border-t border-slate-700/50 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 shrink-0" />
                          <span>{formatDateShort(match.match_date)}</span>
                        </div>
                        {match.city && (
                          <div className="flex items-center gap-1 min-w-0">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{match.venue ? `${match.venue}, ` : ''}{match.city}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Palpites pendentes (próximos dias) */}
      {upcomingPending.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              <h2 className="text-lg font-semibold text-white">Próximos Jogos sem Palpite</h2>
            </div>
            <Link to="/jogos" className="text-blue-400 text-sm hover:underline">Ver todos →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingPending.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {/* Resultados recentes */}
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
