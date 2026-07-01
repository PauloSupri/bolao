import { useState } from 'react'
import { useMatches } from '../hooks/useMatches'
import { useMyPredictions } from '../hooks/usePredictions'
import { MatchCard } from '../components/MatchCard'
import { Card } from '../components/ui/Card'
import { Swords } from 'lucide-react'
import { phaseLabel } from '../lib/utils'
import type { MatchPhase } from '../types'

const phases: { value: string; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'group_a', label: 'Grupo A' },
  { value: 'group_b', label: 'Grupo B' },
  { value: 'group_c', label: 'Grupo C' },
  { value: 'group_d', label: 'Grupo D' },
  { value: 'group_e', label: 'Grupo E' },
  { value: 'group_f', label: 'Grupo F' },
  { value: 'group_g', label: 'Grupo G' },
  { value: 'group_h', label: 'Grupo H' },
  { value: 'group_i', label: 'Grupo I' },
  { value: 'group_j', label: 'Grupo J' },
  { value: 'group_k', label: 'Grupo K' },
  { value: 'group_l', label: 'Grupo L' },
  { value: 'round_of_32', label: 'Rodada de 32' },
  { value: 'round_of_16', label: 'Oitavas' },
  { value: 'quarter_final', label: 'Quartas' },
  { value: 'semi_final', label: 'Semifinal' },
  { value: 'third_place', label: '3º Lugar' },
  { value: 'final', label: 'Final' },
]

export function MatchesPage() {
  const [selectedPhase, setSelectedPhase] = useState('')
  const { data: matches = [], isLoading } = useMatches(selectedPhase || undefined)
  const { data: predictions = [] } = useMyPredictions()

  const predictionMap = new Map(predictions.map((p) => [p.match_id, p]))

  const grouped = matches.reduce<Record<string, typeof matches>>((acc, m) => {
    const key = m.phase
    if (!acc[key]) acc[key] = []
    acc[key].push(m)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Jogos</h1>
        <span className="text-slate-400 text-sm">{matches.length} jogos</span>
      </div>

      {/* Phase filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {phases.map((p) => (
          <button
            key={p.value}
            onClick={() => setSelectedPhase(p.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedPhase === p.value
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-xl h-40 animate-pulse" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <Card className="p-12 text-center">
          <Swords className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Nenhum jogo encontrado para esta fase.</p>
        </Card>
      ) : (
        Object.entries(grouped).map(([phase, phaseMatches]) => (
          <section key={phase}>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {phaseLabel(phase as MatchPhase)}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {phaseMatches.map((m) => (
                <MatchCard
                  key={m.id}
                  match={m}
                  prediction={predictionMap.get(m.id)}
                  showPrediction
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
