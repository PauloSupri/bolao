import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, Calendar, MapPin, Users } from 'lucide-react'
import { useMatch } from '../hooks/useMatches'
import { useMatchPrediction, useSavePrediction, useMatchPredictions } from '../hooks/usePredictions'
import { useMatchPlayers } from '../hooks/usePlayers'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { formatDate, phaseLabel, isMatchLocked } from '../lib/utils'
import { FlagImage } from '../components/FlagImage'

export function MatchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: match, isLoading } = useMatch(id!)
  const { data: myPrediction } = useMatchPrediction(id!)
  const { data: players = [] } = useMatchPlayers(id!)
  const savePrediction = useSavePrediction()

  const locked = match ? isMatchLocked(match.match_date, match.is_locked) : true
  const isFinishedOrLive = match?.status === 'finished' || match?.status === 'live'
  const { data: allPredictions = [] } = useMatchPredictions(id!, isFinishedOrLive)

  const [homeScore, setHomeScoreRaw] = useState(myPrediction?.home_score ?? 0)
  const [awayScore, setAwayScoreRaw] = useState(myPrediction?.away_score ?? 0)
  const [goalMap, setGoalMap] = useState<Map<string, number>>(() => {
    const m = new Map<string, number>()
    myPrediction?.prediction_goalscorers?.forEach((g: any) => m.set(g.player_id, g.goals ?? 1))
    return m
  })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Sync local state when prediction loads
  if (myPrediction && homeScore === 0 && awayScore === 0 && !saved) {
    setHomeScoreRaw(myPrediction.home_score)
    setAwayScoreRaw(myPrediction.away_score)
    const m = new Map<string, number>()
    myPrediction.prediction_goalscorers?.forEach((g: any) => m.set(g.player_id, g.goals ?? 1))
    if (goalMap.size === 0) setGoalMap(m)
  }

  // Trim goalMap when a team's score decreases below their assigned goals total
  function trimGoals(map: Map<string, number>, teamPlayerIds: string[], maxGoals: number): Map<string, number> {
    let total = teamPlayerIds.reduce((s, id) => s + (map.get(id) ?? 0), 0)
    if (total <= maxGoals) return map
    const next = new Map(map)
    // Remove goals from last players first until within limit
    for (const id of [...teamPlayerIds].reverse()) {
      if (total <= maxGoals) break
      const cur = next.get(id) ?? 0
      const remove = Math.min(cur, total - maxGoals)
      const val = cur - remove
      if (val === 0) next.delete(id)
      else next.set(id, val)
      total -= remove
    }
    return next
  }

  function changeScore(team: 'home' | 'away', delta: number) {
    if (team === 'home') {
      const next = Math.max(0, homeScore + delta)
      setHomeScoreRaw(next)
      if (delta < 0) {
        setGoalMap((prev) => trimGoals(prev, homePlayers.map((p) => p.id), next))
      }
    } else {
      const next = Math.max(0, awayScore + delta)
      setAwayScoreRaw(next)
      if (delta < 0) {
        setGoalMap((prev) => trimGoals(prev, awayPlayers.map((p) => p.id), next))
      }
    }
  }

  function setPlayerGoals(playerId: string, delta: number, teamPlayerIds: string[], teamScore: number) {
    setGoalMap((prev) => {
      const next = new Map(prev)
      const cur = next.get(playerId) ?? 0
      const teamTotal = teamPlayerIds.reduce((s, id) => s + (next.get(id) ?? 0), 0)
      const val = Math.max(0, cur + delta)
      // Can't exceed team score total
      if (delta > 0 && teamTotal >= teamScore) return prev
      if (val === 0) next.delete(playerId)
      else next.set(playerId, val)
      return next
    })
  }

  async function handleSave() {
    if (!match) return
    setError('')
    try {
      await savePrediction.mutateAsync({
        matchId: match.id,
        homeScore,
        awayScore,
        goalscorers: Array.from(goalMap.entries()).map(([player_id, goals]) => ({ player_id, goals })),
        existingId: myPrediction?.id,
      })
      setSaved(true)
    } catch (e: any) {
      setError(e.message || 'Erro ao salvar palpite')
    }
  }

  const homePlayers = players.filter((p) => p.team_id === match?.home_team_id)
  const awayPlayers = players.filter((p) => p.team_id === match?.away_team_id)

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!match) return (
    <div className="text-center py-20 text-slate-400">Jogo não encontrado.</div>
  )

  const officialGoalscorers = match.match_goalscorers?.filter((g: any) => !g.is_penalty) ?? []

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      {/* Match header */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-blue-400 font-medium truncate pr-2">{phaseLabel(match.phase)}</span>
          <div className="flex items-center gap-2 shrink-0">
            {locked && <Lock className="w-4 h-4 text-slate-500" />}
            {match.status === 'live' && <Badge variant="live">● Ao Vivo</Badge>}
            {match.status === 'finished' && <Badge>Encerrado</Badge>}
            {match.status === 'scheduled' && <Badge variant="info">Agendado</Badge>}
          </div>
        </div>

        <div className="flex items-start justify-around gap-2 sm:gap-4 my-6">
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <FlagImage code={match.home_team?.code ?? ''} size="lg" className="sm:w-20 sm:h-14" />
            <span className="font-bold text-white text-center text-sm sm:text-base leading-tight line-clamp-2">{match.home_team?.name ?? 'A definir'}</span>
            {match.home_team?.code && <span className="text-xs text-slate-400">{match.home_team.code}</span>}
          </div>

          <div className="flex flex-col items-center gap-2 shrink-0 pt-2">
            {match.status !== 'scheduled' ? (
              <>
                <div className="text-3xl sm:text-4xl font-bold text-white whitespace-nowrap">
                  {match.home_score ?? 0} – {match.away_score ?? 0}
                </div>
                {(match.home_score_penalties != null) && (
                  <div className="text-xs text-slate-400 whitespace-nowrap">
                    ({match.home_score_penalties} – {match.away_score_penalties} pens.)
                  </div>
                )}
                <span className="text-xs text-slate-500">Resultado oficial</span>
              </>
            ) : (
              <div className="text-2xl text-slate-500 font-mono">vs</div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <FlagImage code={match.away_team?.code ?? ''} size="lg" className="sm:w-20 sm:h-14" />
            <span className="font-bold text-white text-center text-sm sm:text-base leading-tight line-clamp-2">{match.away_team?.name ?? 'A definir'}</span>
            {match.away_team?.code && <span className="text-xs text-slate-400">{match.away_team.code}</span>}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 shrink-0" />
            {formatDate(match.match_date)}
          </div>
          {match.city && (
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{match.venue ? `${match.venue}, ` : ''}{match.city}</span>
            </div>
          )}
        </div>

        {/* Official goalscorers */}
        {officialGoalscorers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-400 mb-2">⚽ Gols oficiais</p>
            <div className="flex flex-wrap gap-2">
              {officialGoalscorers.map((g: any) => (
                <span key={g.id} className="text-xs bg-slate-700 text-white px-2 py-1 rounded">
                  {g.player?.name} ({g.goals}g)
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Prediction form */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          {locked ? 'Meu palpite' : myPrediction ? 'Editar palpite' : 'Fazer palpite'}
        </h2>

        {locked && !myPrediction && (
          <div className="text-center py-8 text-slate-400">
            <Lock className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p>Palpites encerrados para este jogo.</p>
          </div>
        )}

        {(!locked || myPrediction) && (
          <>
            {/* Score input */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm text-slate-400">{match.home_team?.name ?? 'Casa'}</span>
                <div className="flex items-center gap-2">
                  {!locked && (
                    <button onClick={() => changeScore('home', -1)}
                      className="w-8 h-8 bg-slate-700 rounded-lg text-white font-bold hover:bg-slate-600">−</button>
                  )}
                  <span className="text-3xl font-bold text-white w-10 text-center">{homeScore}</span>
                  {!locked && (
                    <button onClick={() => changeScore('home', 1)}
                      className="w-8 h-8 bg-slate-700 rounded-lg text-white font-bold hover:bg-slate-600">+</button>
                  )}
                </div>
              </div>

              <span className="text-slate-500 text-xl font-bold">×</span>

              <div className="flex flex-col items-center gap-2">
                <span className="text-sm text-slate-400">{match.away_team?.name ?? 'Fora'}</span>
                <div className="flex items-center gap-2">
                  {!locked && (
                    <button onClick={() => changeScore('away', -1)}
                      className="w-8 h-8 bg-slate-700 rounded-lg text-white font-bold hover:bg-slate-600">−</button>
                  )}
                  <span className="text-3xl font-bold text-white w-10 text-center">{awayScore}</span>
                  {!locked && (
                    <button onClick={() => changeScore('away', 1)}
                      className="w-8 h-8 bg-slate-700 rounded-lg text-white font-bold hover:bg-slate-600">+</button>
                  )}
                </div>
              </div>
            </div>

            {/* Goalscorer selection */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">
                  Quem vai marcar? <span className="text-slate-500 font-normal">(opcional, +1 pt por goleador)</span>
                </span>
              </div>

              {players.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Jogadores ainda não cadastrados para este jogo.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {/* Home team */}
                  {(() => {
                    const homeIds = homePlayers.map((p) => p.id)
                    const homeUsed = homeIds.reduce((s, id) => s + (goalMap.get(id) ?? 0), 0)
                    const homeRemaining = homeScore - homeUsed
                    return (
                      <div>
                        <div className="flex flex-col gap-1 mb-2 pb-2 border-b border-slate-700">
                          <div className="flex items-center gap-2 min-w-0">
                            <FlagImage code={match.home_team?.code ?? ''} size="sm" className="shrink-0" />
                            <span className="text-xs font-semibold text-slate-300 truncate">{match.home_team?.name}</span>
                          </div>
                          {!locked && homeScore > 0 && (
                            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded self-start ${homeRemaining > 0 ? 'text-yellow-400 bg-yellow-400/10' : 'text-green-400 bg-green-400/10'}`}>
                              {homeRemaining > 0 ? `faltam ${homeRemaining}` : '✓ ok'}
                            </span>
                          )}
                          {!locked && homeScore === 0 && (
                            <span className="text-xs text-slate-600 self-start">0 gols</span>
                          )}
                        </div>
                        <div className="space-y-1">
                          {homePlayers.map((p) => {
                            const goals = goalMap.get(p.id) ?? 0
                            const canAdd = homeRemaining > 0
                            return (
                              <div key={p.id} className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg transition-colors ${goals > 0 ? 'bg-blue-600/20 border border-blue-500/40' : 'hover:bg-slate-700/50'}`}>
                                <span className={`text-xs truncate flex-1 ${goals > 0 ? 'text-blue-300 font-medium' : 'text-slate-300'}`}>
                                  {p.shirt_number ? <span className="text-slate-500 mr-1">#{p.shirt_number}</span> : null}
                                  {p.name}
                                </span>
                                {!locked ? (
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      onClick={() => setPlayerGoals(p.id, -1, homeIds, homeScore)}
                                      disabled={goals === 0}
                                      className="w-5 h-5 rounded bg-slate-600 hover:bg-slate-500 text-white text-xs font-bold flex items-center justify-center disabled:opacity-30 disabled:cursor-default"
                                    >−</button>
                                    <span className={`w-4 text-center text-xs font-bold tabular-nums ${goals > 0 ? 'text-blue-400' : 'text-slate-500'}`}>{goals}</span>
                                    <button
                                      onClick={() => setPlayerGoals(p.id, 1, homeIds, homeScore)}
                                      disabled={!canAdd}
                                      className="w-5 h-5 rounded bg-slate-600 hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center disabled:opacity-30 disabled:cursor-default"
                                    >+</button>
                                  </div>
                                ) : (
                                  goals > 0 && <span className="text-xs font-bold text-blue-400 shrink-0">{goals} gol{goals > 1 ? 's' : ''}</span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })()}

                  {/* Away team */}
                  {(() => {
                    const awayIds = awayPlayers.map((p) => p.id)
                    const awayUsed = awayIds.reduce((s, id) => s + (goalMap.get(id) ?? 0), 0)
                    const awayRemaining = awayScore - awayUsed
                    return (
                      <div>
                        <div className="flex flex-col gap-1 mb-2 pb-2 border-b border-slate-700">
                          <div className="flex items-center gap-2 min-w-0">
                            <FlagImage code={match.away_team?.code ?? ''} size="sm" className="shrink-0" />
                            <span className="text-xs font-semibold text-slate-300 truncate">{match.away_team?.name}</span>
                          </div>
                          {!locked && awayScore > 0 && (
                            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded self-start ${awayRemaining > 0 ? 'text-yellow-400 bg-yellow-400/10' : 'text-green-400 bg-green-400/10'}`}>
                              {awayRemaining > 0 ? `faltam ${awayRemaining}` : '✓ ok'}
                            </span>
                          )}
                          {!locked && awayScore === 0 && (
                            <span className="text-xs text-slate-600 self-start">0 gols</span>
                          )}
                        </div>
                        <div className="space-y-1">
                          {awayPlayers.map((p) => {
                            const goals = goalMap.get(p.id) ?? 0
                            const canAdd = awayRemaining > 0
                            return (
                              <div key={p.id} className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg transition-colors ${goals > 0 ? 'bg-blue-600/20 border border-blue-500/40' : 'hover:bg-slate-700/50'}`}>
                                <span className={`text-xs truncate flex-1 ${goals > 0 ? 'text-blue-300 font-medium' : 'text-slate-300'}`}>
                                  {p.shirt_number ? <span className="text-slate-500 mr-1">#{p.shirt_number}</span> : null}
                                  {p.name}
                                </span>
                                {!locked ? (
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      onClick={() => setPlayerGoals(p.id, -1, awayIds, awayScore)}
                                      disabled={goals === 0}
                                      className="w-5 h-5 rounded bg-slate-600 hover:bg-slate-500 text-white text-xs font-bold flex items-center justify-center disabled:opacity-30 disabled:cursor-default"
                                    >−</button>
                                    <span className={`w-4 text-center text-xs font-bold tabular-nums ${goals > 0 ? 'text-blue-400' : 'text-slate-500'}`}>{goals}</span>
                                    <button
                                      onClick={() => setPlayerGoals(p.id, 1, awayIds, awayScore)}
                                      disabled={!canAdd}
                                      className="w-5 h-5 rounded bg-slate-600 hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center disabled:opacity-30 disabled:cursor-default"
                                    >+</button>
                                  </div>
                                ) : (
                                  goals > 0 && <span className="text-xs font-bold text-blue-400 shrink-0">{goals} gol{goals > 1 ? 's' : ''}</span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>

            {/* Points breakdown if finished */}
            {myPrediction && match.status === 'finished' && (
              <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
                <p className="text-xs text-slate-400 mb-2">Pontuação obtida:</p>
                <div className="flex gap-4 text-sm">
                  {myPrediction.exact_score && <span className="text-green-400">✓ Placar exato (+10)</span>}
                  {!myPrediction.exact_score && myPrediction.correct_result && (
                    <span className="text-yellow-400">✓ Resultado certo (+5)</span>
                  )}
                  {myPrediction.goalscorer_points > 0 && (
                    <span className="text-blue-400">⚽ Goleadores (+{myPrediction.goalscorer_points})</span>
                  )}
                  <span className="text-white font-bold ml-auto">Total: {myPrediction.total_points} pts</span>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-3 bg-red-900/30 border border-red-700/50 rounded-lg p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {saved && (
              <div className="mt-3 bg-green-900/30 border border-green-700/50 rounded-lg p-3 text-sm text-green-400">
                ✓ Palpite salvo com sucesso!
              </div>
            )}

            {!locked && (
              <Button
                className="w-full mt-4"
                onClick={handleSave}
                loading={savePrediction.isPending}
              >
                {myPrediction ? 'Atualizar palpite' : 'Salvar palpite'}
              </Button>
            )}
          </>
        )}
      </Card>

      {/* Other predictions (shown after match starts) */}
      {isFinishedOrLive && allPredictions.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Palpites dos participantes</h2>
          <div className="space-y-2">
            {allPredictions.map((pred: any) => (
              <div key={pred.id} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-blue-600/30 rounded-full flex items-center justify-center text-xs text-blue-400">
                    {pred.profile?.full_name?.[0] ?? '?'}
                  </div>
                  <span className="text-sm text-slate-300">{pred.profile?.full_name ?? 'Anônimo'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-white">{pred.home_score}×{pred.away_score}</span>
                  {pred.total_points > 0 && (
                    <span className="text-xs text-yellow-400 font-bold">+{pred.total_points} pts</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
