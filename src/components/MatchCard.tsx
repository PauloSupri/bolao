import { Link } from 'react-router-dom'
import { Calendar, MapPin, Lock } from 'lucide-react'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { FlagImage } from './FlagImage'
import { formatDateShort, phaseLabel, isMatchLocked } from '../lib/utils'
import type { Match, Prediction } from '../types'

interface MatchCardProps {
  match: Match
  prediction?: Prediction | null
  showPrediction?: boolean
}

function StatusBadge({ status }: { status: Match['status'] }) {
  if (status === 'live') return <Badge variant="live">● Ao Vivo</Badge>
  if (status === 'finished') return <Badge variant="default">Encerrado</Badge>
  return <Badge variant="info">Agendado</Badge>
}

export function MatchCard({ match, prediction, showPrediction = false }: MatchCardProps) {
  const locked = isMatchLocked(match.match_date, match.is_locked)
  const hasPrediction = prediction != null
  const isFinished = match.status === 'finished'
  const isLive = match.status === 'live'

  return (
    <Link to={`/jogos/${match.id}`}>
      <Card hover className="p-4 cursor-pointer group">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-blue-400 font-medium truncate max-w-40">{phaseLabel(match.phase)}</span>
          <div className="flex items-center gap-2 shrink-0">
            {locked && !isFinished && !isLive && <Lock className="w-3 h-3 text-slate-500" />}
            <StatusBadge status={match.status} />
          </div>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between gap-2">
          {/* Home team */}
          <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
            <FlagImage code={match.home_team?.code ?? ''} size="lg" />
            <span className="text-xs font-semibold text-white text-center leading-tight line-clamp-2">
              {match.home_team?.name ?? 'A definir'}
            </span>
          </div>

          {/* Score / VS */}
          <div className="flex flex-col items-center gap-1 px-2 shrink-0">
            {isFinished || isLive ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white tabular-nums">{match.home_score ?? 0}</span>
                  <span className="text-slate-500 text-lg">–</span>
                  <span className="text-2xl font-bold text-white tabular-nums">{match.away_score ?? 0}</span>
                </div>
                {isLive && <span className="text-xs text-green-400 font-semibold animate-pulse">AO VIVO</span>}
              </>
            ) : (
              <span className="text-slate-500 font-bold text-base">VS</span>
            )}

            {/* Prediction vs result */}
            {showPrediction && hasPrediction && (
              <div className="text-center mt-1">
                <div className="text-xs text-slate-400">
                  Palpite: <span className="text-white font-mono">{prediction.home_score}–{prediction.away_score}</span>
                </div>
                {prediction.total_points > 0 && (
                  <div className="text-xs text-yellow-400 font-bold">+{prediction.total_points} pts</div>
                )}
              </div>
            )}
          </div>

          {/* Away team */}
          <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
            <FlagImage code={match.away_team?.code ?? ''} size="lg" />
            <span className="text-xs font-semibold text-white text-center leading-tight line-clamp-2">
              {match.away_team?.name ?? 'A definir'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDateShort(match.match_date)}</span>
          </div>
          {match.city && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-28">{match.city}</span>
            </div>
          )}
          {!hasPrediction && !locked && (
            <span className="text-blue-400 group-hover:underline font-medium">Palpitar →</span>
          )}
          {hasPrediction && !isFinished && (
            <span className="text-green-400 font-medium">✓ Palpitado</span>
          )}
          {hasPrediction && isFinished && prediction?.exact_score && (
            <span className="text-green-400 font-bold">★ Exato!</span>
          )}
          {hasPrediction && isFinished && !prediction?.exact_score && prediction?.correct_result && (
            <span className="text-yellow-400 font-medium">✓ Certo</span>
          )}
        </div>
      </Card>
    </Link>
  )
}
