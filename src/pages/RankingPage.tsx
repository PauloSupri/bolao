import { useRanking } from '../hooks/useRanking'
import { useAuth } from '../contexts/AuthContext'
import { Card } from '../components/ui/Card'
import { Trophy, Medal } from 'lucide-react'
import { cn } from '../lib/utils'

export function RankingPage() {
  const { data: ranking = [], isLoading } = useRanking()
  const { profile } = useAuth()

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="w-7 h-7 text-yellow-400" />
        <h1 className="text-2xl font-bold text-white">Ranking Geral</h1>
      </div>

      {ranking.length === 0 ? (
        <Card className="p-12 text-center">
          <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">O ranking será preenchido conforme os jogos forem sendo encerrados.</p>
        </Card>
      ) : (
        <>
          {/* Top 3 podium */}
          {ranking.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[ranking[1], ranking[0], ranking[2]].map((entry, idx) => {
                if (!entry) return null
                const actualPosition = idx === 0 ? 2 : idx === 1 ? 1 : 3
                const heights = ['h-28', 'h-36', 'h-24']
                const colors = ['text-slate-400', 'text-yellow-400', 'text-orange-400']
                const bgColors = ['bg-slate-700/30', 'bg-yellow-500/10 border-yellow-500/30', 'bg-orange-500/10 border-orange-500/30']

                return (
                  <div key={entry.user_id} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-blue-600/30 rounded-full flex items-center justify-center text-lg font-bold text-blue-400">
                      {entry.profile?.full_name?.[0] ?? '?'}
                    </div>
                    <div className={cn(
                      'w-full rounded-t-xl border flex flex-col items-center justify-end pb-3',
                      heights[idx], bgColors[idx]
                    )}>
                      <span className={cn('text-2xl font-bold', colors[idx])}>#{actualPosition}</span>
                      <span className="text-xs text-slate-300 text-center px-1 truncate w-full text-center">
                        {entry.profile?.full_name?.split(' ')[0]}
                      </span>
                      <span className="text-sm font-bold text-white">{entry.total_points} pts</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Full table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">#</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Participante</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Pts</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">Exatos</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">Certos</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">Gols</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">Jogos</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((entry) => {
                    const isMe = entry.user_id === profile?.id
                    const pos = entry.position ?? 0

                    return (
                      <tr
                        key={entry.user_id}
                        className={cn(
                          'border-b border-slate-700/50 last:border-0 transition-colors',
                          isMe ? 'bg-blue-600/10' : 'hover:bg-slate-700/30'
                        )}
                      >
                        <td className="px-4 py-3">
                          <PositionBadge position={pos} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                              isMe ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                            )}>
                              {entry.profile?.full_name?.[0] ?? '?'}
                            </div>
                            <div>
                              <p className={cn('text-sm font-medium', isMe ? 'text-blue-400' : 'text-white')}>
                                {entry.profile?.full_name ?? 'Anônimo'}
                                {isMe && ' (você)'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-white font-bold">{entry.total_points}</span>
                        </td>
                        <td className="px-4 py-3 text-right hidden sm:table-cell">
                          <span className="text-green-400">{entry.exact_scores}</span>
                        </td>
                        <td className="px-4 py-3 text-right hidden sm:table-cell">
                          <span className="text-yellow-400">{entry.correct_results}</span>
                        </td>
                        <td className="px-4 py-3 text-right hidden md:table-cell">
                          <span className="text-blue-400">{entry.goalscorer_points}</span>
                        </td>
                        <td className="px-4 py-3 text-right hidden md:table-cell">
                          <span className="text-slate-400">{entry.games_predicted}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="flex gap-6 text-xs text-slate-500 justify-center">
            <span><span className="text-green-400">Exatos</span> = placar exato (+10 pts)</span>
            <span><span className="text-yellow-400">Certos</span> = resultado correto (+5 pts)</span>
            <span><span className="text-blue-400">Gols</span> = pontos de goleadores (+1/jogador)</span>
          </div>
        </>
      )}
    </div>
  )
}

function PositionBadge({ position }: { position: number }) {
  if (position === 1) return <Medal className="w-5 h-5 text-yellow-400" />
  if (position === 2) return <Medal className="w-5 h-5 text-slate-400" />
  if (position === 3) return <Medal className="w-5 h-5 text-orange-400" />
  return <span className="text-slate-400 text-sm font-medium">{position}º</span>
}
