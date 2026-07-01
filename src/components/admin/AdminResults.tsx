import { useState } from 'react'
import { Save, RefreshCw, CheckCircle } from 'lucide-react'
import { useMatches, useUpdateMatch } from '../../hooks/useMatches'
import { usePlayers } from '../../hooks/usePlayers'
import { supabase } from '../../lib/supabase'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { getFlagEmoji, formatDateShort, phaseLabel } from '../../lib/utils'
import type { Match } from '../../types'

export function AdminResults() {
  const { data: matches = [] } = useMatches()
  const { data: allPlayers = [] } = usePlayers()
  const updateMatch = useUpdateMatch()

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [homePenalties, setHomePenalties] = useState<number | ''>('')
  const [awayPenalties, setAwayPenalties] = useState<number | ''>('')
  const [goalscorers, setGoalscorers] = useState<{ playerId: string; goals: number }[]>([])
  const [saving, setSaving] = useState(false)
  const [recalculating, setRecalculating] = useState(false)
  const [done, setDone] = useState(false)

  const liveAndScheduled = matches.filter((m) => m.status !== 'cancelled')
  const matchPlayers = allPlayers.filter(
    (p) => selectedMatch && (p.team_id === selectedMatch.home_team_id || p.team_id === selectedMatch.away_team_id)
  )

  function selectMatch(match: Match) {
    setSelectedMatch(match)
    setHomeScore(match.home_score ?? 0)
    setAwayScore(match.away_score ?? 0)
    setHomePenalties(match.home_score_penalties ?? '')
    setAwayPenalties(match.away_score_penalties ?? '')
    setDone(false)
    // Load existing goalscorers
    supabase
      .from('match_goalscorers')
      .select('*')
      .eq('match_id', match.id)
      .then(({ data }) => {
        setGoalscorers(data?.map((g) => ({ playerId: g.player_id, goals: g.goals })) ?? [])
      })
  }

  function toggleGoalscorer(playerId: string) {
    setGoalscorers((prev) => {
      const exists = prev.find((g) => g.playerId === playerId)
      if (exists) return prev.filter((g) => g.playerId !== playerId)
      return [...prev, { playerId, goals: 1 }]
    })
  }

  function updateGoals(playerId: string, goals: number) {
    setGoalscorers((prev) => prev.map((g) => g.playerId === playerId ? { ...g, goals } : g))
  }

  async function handleSave() {
    if (!selectedMatch) return
    setSaving(true)
    try {
      // Update match result
      await updateMatch.mutateAsync({
        id: selectedMatch.id,
        data: {
          home_score: homeScore,
          away_score: awayScore,
          home_score_penalties: homePenalties !== '' ? Number(homePenalties) : null,
          away_score_penalties: awayPenalties !== '' ? Number(awayPenalties) : null,
          status: 'finished',
          is_locked: true,
        },
      })

      // Update goalscorers
      await supabase.from('match_goalscorers').delete().eq('match_id', selectedMatch.id)
      if (goalscorers.length > 0) {
        await supabase.from('match_goalscorers').insert(
          goalscorers.map((g) => ({
            match_id: selectedMatch.id,
            player_id: g.playerId,
            goals: g.goals,
            is_penalty: false,
          }))
        )
      }

      // Recalculate scores
      await recalculateScores(selectedMatch.id)
      setDone(true)
    } finally {
      setSaving(false)
    }
  }

  async function recalculateScores(matchId: string) {
    setRecalculating(true)
    try {
      await supabase.rpc('recalculate_match_scores', { p_match_id: matchId })
    } finally {
      setRecalculating(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Match list */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Selecionar jogo</h2>
        <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin pr-1">
          {liveAndScheduled.map((match) => (
            <button
              key={match.id}
              onClick={() => selectMatch(match)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                selectedMatch?.id === match.id
                  ? 'bg-blue-600/20 border-blue-500/50'
                  : 'bg-slate-800/60 border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-blue-400">{phaseLabel(match.phase)}</span>
                <span className="text-xs text-slate-400">{formatDateShort(match.match_date)}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-white">
                  {match.home_team ? `${getFlagEmoji(match.home_team.code)} ${match.home_team.name}` : 'A definir'}
                </span>
                <span className="text-slate-500 text-xs">vs</span>
                <span className="text-sm text-white">
                  {match.away_team ? `${getFlagEmoji(match.away_team.code)} ${match.away_team.name}` : 'A definir'}
                </span>
                {match.status === 'finished' && (
                  <span className="ml-auto text-xs text-green-400 font-mono">
                    {match.home_score}–{match.away_score}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Result form */}
      <div>
        {!selectedMatch ? (
          <Card className="p-12 text-center">
            <p className="text-slate-400">Selecione um jogo para lançar o resultado.</p>
          </Card>
        ) : (
          <Card className="p-5 space-y-5">
            <h2 className="text-lg font-semibold text-white">Lançar resultado</h2>

            <div className="flex items-center justify-around gap-4">
              <div className="text-center flex-1">
                <p className="text-sm text-slate-400 mb-2">{selectedMatch.home_team?.name ?? 'Casa'}</p>
                <Input
                  type="number"
                  min="0"
                  value={homeScore}
                  onChange={(e) => setHomeScore(Number(e.target.value))}
                  className="text-center text-2xl font-bold"
                />
              </div>
              <span className="text-slate-500 text-xl">×</span>
              <div className="text-center flex-1">
                <p className="text-sm text-slate-400 mb-2">{selectedMatch.away_team?.name ?? 'Fora'}</p>
                <Input
                  type="number"
                  min="0"
                  value={awayScore}
                  onChange={(e) => setAwayScore(Number(e.target.value))}
                  className="text-center text-2xl font-bold"
                />
              </div>
            </div>

            {/* Penalty score */}
            <div>
              <p className="text-xs text-slate-400 mb-2">Placar dos pênaltis (opcional, mata-mata)</p>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min="0"
                  placeholder="–"
                  value={homePenalties}
                  onChange={(e) => setHomePenalties(e.target.value === '' ? '' : Number(e.target.value))}
                />
                <span className="text-slate-500">×</span>
                <Input
                  type="number"
                  min="0"
                  placeholder="–"
                  value={awayPenalties}
                  onChange={(e) => setAwayPenalties(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
            </div>

            {/* Goalscorers */}
            {matchPlayers.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-300 mb-2">
                  ⚽ Goleadores (excluir pênaltis)
                </p>
                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
                  {matchPlayers.map((player) => {
                    const gs = goalscorers.find((g) => g.playerId === player.id)
                    return (
                      <div key={player.id} className="flex items-center gap-3">
                        <button
                          onClick={() => toggleGoalscorer(player.id)}
                          className={`flex-1 text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            gs ? 'bg-green-600/20 text-green-400 border border-green-600/40' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          {player.name}
                          <span className="text-xs text-slate-500 ml-1">({player.team?.code})</span>
                        </button>
                        {gs && (
                          <Input
                            type="number"
                            min="1"
                            value={gs.goals}
                            onChange={(e) => updateGoals(player.id, Number(e.target.value))}
                            className="w-16 text-center"
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {done && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                Resultado salvo e pontuação recalculada!
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleSave} loading={saving} className="flex-1">
                <Save className="w-4 h-4" /> Salvar resultado
              </Button>
              <Button
                variant="secondary"
                onClick={() => recalculateScores(selectedMatch.id)}
                loading={recalculating}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
