import { useState } from 'react'
import { Plus, Edit2, Save, X, Lock, Unlock } from 'lucide-react'
import { useMatches, useCreateMatch, useUpdateMatch } from '../../hooks/useMatches'
import { useTeams } from '../../hooks/useTeams'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'
import { Badge } from '../ui/Badge'
import { formatDateShort, phaseLabel, getFlagEmoji } from '../../lib/utils'
import type { Match, MatchPhase } from '../../types'

const phases: MatchPhase[] = [
  'group_a','group_b','group_c','group_d','group_e','group_f',
  'group_g','group_h','group_i','group_j','group_k','group_l',
  'round_of_32','round_of_16','quarter_final','semi_final','third_place','final'
]

const emptyForm = {
  phase: 'group_a' as MatchPhase,
  match_number: 1,
  home_team_id: '',
  away_team_id: '',
  match_date: '',
  venue: '',
  city: '',
  status: 'scheduled' as Match['status'],
  is_locked: false,
}

export function AdminMatches() {
  const { data: matches = [] } = useMatches()
  const { data: teams = [] } = useTeams()
  const createMatch = useCreateMatch()
  const updateMatch = useUpdateMatch()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  function resetForm() {
    setForm(emptyForm)
    setShowForm(false)
    setEditingId(null)
  }

  async function handleSubmit() {
    const payload = {
      ...form,
      home_team_id: form.home_team_id || null,
      away_team_id: form.away_team_id || null,
    }
    if (editingId) {
      await updateMatch.mutateAsync({ id: editingId, data: payload })
    } else {
      await createMatch.mutateAsync(payload)
    }
    resetForm()
  }

  function startEdit(match: Match) {
    setForm({
      phase: match.phase,
      match_number: match.match_number,
      home_team_id: match.home_team_id ?? '',
      away_team_id: match.away_team_id ?? '',
      match_date: match.match_date.slice(0, 16),
      venue: match.venue ?? '',
      city: match.city ?? '',
      status: match.status,
      is_locked: match.is_locked,
    })
    setEditingId(match.id)
    setShowForm(true)
  }

  async function toggleLock(match: Match) {
    await updateMatch.mutateAsync({ id: match.id, data: { is_locked: !match.is_locked } })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Jogos ({matches.length})</h2>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus className="w-4 h-4" /> Adicionar
        </Button>
      </div>

      {showForm && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-white mb-3">
            {editingId ? 'Editar jogo' : 'Novo jogo'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Select label="Fase" value={form.phase} onChange={(e) => setForm({ ...form, phase: e.target.value as MatchPhase })}>
              {phases.map((p) => <option key={p} value={p}>{phaseLabel(p)}</option>)}
            </Select>
            <Input
              label="Nº do jogo"
              type="number"
              value={form.match_number}
              onChange={(e) => setForm({ ...form, match_number: Number(e.target.value) })}
            />
            <Select label="Time da casa" value={form.home_team_id} onChange={(e) => setForm({ ...form, home_team_id: e.target.value })}>
              <option value="">A definir</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
            <Select label="Time visitante" value={form.away_team_id} onChange={(e) => setForm({ ...form, away_team_id: e.target.value })}>
              <option value="">A definir</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
            <Input
              label="Data e hora"
              type="datetime-local"
              value={form.match_date}
              onChange={(e) => setForm({ ...form, match_date: e.target.value })}
            />
            <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Match['status'] })}>
              <option value="scheduled">Agendado</option>
              <option value="live">Ao Vivo</option>
              <option value="finished">Encerrado</option>
              <option value="cancelled">Cancelado</option>
            </Select>
            <Input
              label="Estádio"
              placeholder="MetLife Stadium"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
            />
            <Input
              label="Cidade"
              placeholder="Nova York"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
          <div className="flex gap-2 mt-3">
            <Button onClick={handleSubmit} loading={createMatch.isPending || updateMatch.isPending}>
              <Save className="w-4 h-4" /> Salvar
            </Button>
            <Button variant="ghost" onClick={resetForm}>
              <X className="w-4 h-4" /> Cancelar
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {matches.map((match) => (
          <Card key={match.id} className="p-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-xs text-blue-400 whitespace-nowrap">{phaseLabel(match.phase)}</span>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium text-white truncate">
                    {match.home_team ? `${getFlagEmoji(match.home_team.code)} ${match.home_team.name}` : '? A definir'}
                  </span>
                  <span className="text-slate-500">×</span>
                  <span className="text-sm font-medium text-white truncate">
                    {match.away_team ? `${getFlagEmoji(match.away_team.code)} ${match.away_team.name}` : '? A definir'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-400 hidden sm:block">{formatDateShort(match.match_date)}</span>
                {match.status === 'live' && <Badge variant="live">Vivo</Badge>}
                {match.status === 'finished' && <Badge>Enc.</Badge>}
                <button onClick={() => toggleLock(match)} className="text-slate-400 hover:text-white p-1" title={match.is_locked ? 'Desbloquear' : 'Bloquear'}>
                  {match.is_locked ? <Lock className="w-4 h-4 text-red-400" /> : <Unlock className="w-4 h-4" />}
                </button>
                <button onClick={() => startEdit(match)} className="text-slate-400 hover:text-white p-1">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
