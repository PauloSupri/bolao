import { Link } from 'react-router-dom'
import { Calendar, MapPin, Lock } from 'lucide-react'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { formatDateShort, phaseLabel, isMatchLocked, getFlagEmoji } from '../lib/utils'
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

function ScoreDisplay({ match }: { match: Match }) {
  if (match.status === 'finished' || match.status === 'live') {
    return (
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-white">{match.home_score ?? 0}</span>
        <span className="text-slate-500">×</span>
        <span className="text-2xl font-bold text-white">{match.away_score ?? 0}</span>
      </div>
    )
  }
  return <div className="text-slate-500 font-mono text-lg">vs</div>
}

export function MatchCard({ match, prediction, showPrediction = false }: MatchCardProps) {
  const locked = isMatchLocked(match.match_date, match.is_locked)
  const hasPrediction = prediction != null

  return (
    <Link to={`/jogos/${match.id}`}>
      <Card hover className="p-4 cursor-pointer group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-blue-400 font-medium">{phaseLabel(match.phase)}</span>
          <div className="flex items-center gap-2">
            {locked && <Lock className="w-3 h-3 text-slate-500" />}
            <StatusBadge status={match.status} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
            <span className="text-2xl">
              {match.home_team ? getFlagEmoji(match.home_team.code) : '🏳️'}
            </span>
            <span className="text-sm font-medium text-white text-center truncate w-full">
              {match.home_team?.name ?? 'A definir'}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <ScoreDisplay match={match} />
            {showPrediction && hasPrediction && (
              <div className="text-xs text-slate-400">
                Palpite: {prediction.home_score}×{prediction.away_score}
              </div>
            )}
            {showPrediction && hasPrediction && prediction.total_points > 0 && (
              <div className="text-xs text-yellow-400 font-semibold">
                +{prediction.total_points} pts
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
            <span className="text-2xl">
              {match.away_team ? getFlagEmoji(match.away_team.code) : '🏳️'}
            </span>
            <span className="text-sm font-medium text-white text-center truncate w-full">
              {match.away_team?.name ?? 'A definir'}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDateShort(match.match_date)}</span>
          </div>
          {match.city && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-24">{match.city}</span>
            </div>
          )}
          {!hasPrediction && !locked && (
            <span className="text-blue-400 group-hover:underline">Palpitar →</span>
          )}
          {hasPrediction && !locked && (
            <span className="text-green-400">✓ Palpitado</span>
          )}
        </div>
      </Card>
    </Link>
  )
}
