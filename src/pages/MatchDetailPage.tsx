import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, Calendar, MapPin, Users } from 'lucide-react'
import { useMatch } from '../hooks/useMatches'
import { useMatchPrediction, useSavePrediction, useMatchPredictions } from '../hooks/usePredictions'
import { useMatchPlayers } from '../hooks/usePlayers'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { formatDate, phaseLabel, isMatchLocked, getFlagEmoji } from '../lib/utils'

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

  const [homeScore, setHomeScore] = useState(myPrediction?.home_score ?? 0)
  const [awayScore, setAwayScore] = useState(myPrediction?.away_score ?? 0)
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(
    new Set(myPrediction?.prediction_goalscorers?.map((g: any) => g.player_id) ?? [])
  )
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Sync local state when prediction loads
  if (myPrediction && homeScore === 0 && awayScore === 0 && !saved) {
    setHomeScore(myPrediction.home_score)
    setAwayScore(myPrediction.away_score)
    setSelectedPlayers(new Set(myPrediction.prediction_goalscorers?.map((g: any) => g.player_id) ?? []))
  }

  function togglePlayer(playerId: string) {
    setSelectedPlayers((prev) => {
      const next = new Set(prev)
      if (next.has(playerId)) next.delete(playerId)
      else next.add(playerId)
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
        playerIds: Array.from(selectedPlayers),
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
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-blue-400 font-medium">{phaseLabel(match.phase)}</span>
          <div className="flex items-center gap-2">
            {locked && <Lock className="w-4 h-4 text-slate-500" />}
            {match.status === 'live' && <Badge variant="live">● Ao Vivo</Badge>}
            {match.status === 'finished' && <Badge>Encerrado</Badge>}
            {match.status === 'scheduled' && <Badge variant="info">Agendado</Badge>}
          </div>
        </div>

        <div className="flex items-center justify-around gap-4 my-6">
          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-5xl">{getFlagEmoji(match.home_team?.code ?? '')}</span>
            <span className="font-bold text-white text-center">{match.home_team?.name ?? 'A definir'}</span>
            {match.home_team?.code && <span className="text-xs text-slate-400">{match.home_team.code}</span>}
          </div>

          <div className="flex flex-col items-center gap-2">
            {match.status !== 'scheduled' ? (
              <>
                <div className="text-4xl font-bold text-white">
                  {match.home_score ?? 0} – {match.away_score ?? 0}
                </div>
                {(match.home_score_penalties != null) && (
                  <div className="text-xs text-slate-400">
                    ({match.home_score_penalties} – {match.away_score_penalties} pens.)
                  </div>
                )}
                <span className="text-xs text-slate-500">Resultado oficial</span>
              </>
            ) : (
              <div className="text-2xl text-slate-500 font-mono">vs</div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-5xl">{getFlagEmoji(match.away_team?.code ?? '')}</span>
            <span className="font-bold text-white text-center">{match.away_team?.name ?? 'A definir'}</span>
            {match.away_team?.code && <span className="text-xs text-slate-400">{match.away_team.code}</span>}
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(match.match_date)}
          </div>
          {match.city && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {match.venue ? `${match.venue}, ` : ''}{match.city}
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
      <Card className="p-6">
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
                    <button onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                      className="w-8 h-8 bg-slate-700 rounded-lg text-white font-bold hover:bg-slate-600">−</button>
                  )}
                  <span className="text-3xl font-bold text-white w-10 text-center">{homeScore}</span>
                  {!locked && (
                    <button onClick={() => setHomeScore(homeScore + 1)}
                      className="w-8 h-8 bg-slate-700 rounded-lg text-white font-bold hover:bg-slate-600">+</button>
                  )}
                </div>
              </div>

              <span className="text-slate-500 text-xl font-bold">×</span>

              <div className="flex flex-col items-center gap-2">
                <span className="text-sm text-slate-400">{match.away_team?.name ?? 'Fora'}</span>
                <div className="flex items-center gap-2">
                  {!locked && (
                    <button onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
                      className="w-8 h-8 bg-slate-700 rounded-lg text-white font-bold hover:bg-slate-600">−</button>
                  )}
                  <span className="text-3xl font-bold text-white w-10 text-center">{awayScore}</span>
                  {!locked && (
                    <button onClick={() => setAwayScore(awayScore + 1)}
                      className="w-8 h-8 bg-slate-700 rounded-lg text-white font-bold hover:bg-slate-600">+</button>
                  )}
                </div>
              </div>
            </div>

            {/* Goalscorer selection */}
            {players.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">
                    Quem vai marcar? <span className="text-slate-500 font-normal">(opcional)</span>
                  </span>
                </div>

                {homePlayers.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-slate-500 mb-2">{match.home_team?.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {homePlayers.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => !locked && togglePlayer(p.id)}
                          disabled={locked}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            selectedPlayers.has(p.id)
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          } disabled:cursor-default`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {awayPlayers.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">{match.away_team?.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {awayPlayers.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => !locked && togglePlayer(p.id)}
                          disabled={locked}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            selectedPlayers.has(p.id)
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          } disabled:cursor-default`}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
