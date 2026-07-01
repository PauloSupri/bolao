import { Link } from 'react-router-dom'
import { useMyPredictions } from '../hooks/usePredictions'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { formatDateShort, phaseLabel, getFlagEmoji } from '../lib/utils'
import { Star, Trophy } from 'lucide-react'

export function MyPredictionsPage() {
  const { data: predictions = [], isLoading } = useMyPredictions()

  const totalPoints = predictions.reduce((sum, p) => sum + (p.total_points ?? 0), 0)
  const exactScores = predictions.filter((p) => p.exact_score).length
  const correctResults = predictions.filter((p) => p.correct_result && !p.exact_score).length
  const pending = predictions.filter((p) => p.match?.status === 'scheduled').length

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Meus Palpites</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{totalPoints}</p>
          <p className="text-xs text-slate-400 mt-1">Pontos totais</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{exactScores}</p>
          <p className="text-xs text-slate-400 mt-1">Placar exato</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{correctResults}</p>
          <p className="text-xs text-slate-400 mt-1">Resultado certo</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-slate-300">{pending}</p>
          <p className="text-xs text-slate-400 mt-1">Aguardando</p>
        </Card>
      </div>

      {predictions.length === 0 ? (
        <Card className="p-12 text-center">
          <Star className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Você ainda não fez nenhum palpite.</p>
          <Link to="/jogos" className="inline-block mt-4 text-blue-400 hover:underline">
            Ver jogos disponíveis →
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {predictions.map((pred) => {
            const match = pred.match
            if (!match) return null
            const finished = match.status === 'finished'

            return (
              <Link to={`/jogos/${match.id}`} key={pred.id}>
                <Card hover className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    {/* Phase & date */}
                    <div className="hidden sm:flex flex-col min-w-24">
                      <span className="text-xs text-blue-400">{phaseLabel(match.phase)}</span>
                      <span className="text-xs text-slate-500">{formatDateShort(match.match_date)}</span>
                    </div>

                    {/* Teams & scores */}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <span className="text-sm text-white font-medium text-right">{match.home_team?.name}</span>
                        <span className="text-lg">{getFlagEmoji(match.home_team?.code ?? '')}</span>
                      </div>

                      <div className="flex flex-col items-center gap-0.5 min-w-16">
                        {/* Prediction */}
                        <span className="text-sm font-mono text-slate-300">
                          {pred.home_score}–{pred.away_score}
                        </span>
                        {/* Official */}
                        {finished && (
                          <span className="text-xs font-mono text-slate-500">
                            {match.home_score}–{match.away_score}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-lg">{getFlagEmoji(match.away_team?.code ?? '')}</span>
                        <span className="text-sm text-white font-medium">{match.away_team?.name}</span>
                      </div>
                    </div>

                    {/* Points & badges */}
                    <div className="flex flex-col items-end gap-1 min-w-20">
                      {finished ? (
                        <>
                          <span className="text-lg font-bold text-yellow-400">+{pred.total_points}</span>
                          {pred.exact_score && <Badge variant="success">Exato!</Badge>}
                          {!pred.exact_score && pred.correct_result && <Badge variant="warning">Certo</Badge>}
                        </>
                      ) : (
                        <Badge variant="info">Aguardando</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
